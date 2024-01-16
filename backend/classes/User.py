from datetime import datetime as dt
from datetime import timedelta
import re

class User:
    def __init__(self, firebase_auth, firebase_db):
        self.auth = firebase_auth
        self.db = firebase_db

    # +++++++++++++++++++++++++++++++++++++++++ HELPERS +++++++++++++++++++++++++++++++++++++++++
    def __get_user_path(self, localId): return self.db.child("users").child(localId) 
    # ----------------------------------------- HELPERS -----------------------------------------
    

    # +++++++++++++++++++++++++++++++++++++++++ REGISTER +++++++++++++++++++++++++++++++++++++++++
    @staticmethod
    def __register_create_user_template(email):
        return {
            "user_info": {
                "email": email,
                "username": email.split("@")[0],
                "created_at": dt.now().strftime("%d/%m/%Y %H:%M:%S"),
                "disabled_at": "",                                                                              # Czas kiedy użytkownik zgłosił chęć usunięcia konta (po 30 dniach konto zostanie usunięte)
                "deleted_at": "",                                                                               # Czas kiedy konto zostało usunięte (po 30 dniach konto zostanie usunięte z bazy danych)
                "role": "user",                                                                                 # "user", "admin", "moderator"
                "account_status": "non-verfied",                                                                # "active", "suspended", "deleted, non-verfied", "disabled"
                "logs": {
                    "logins": [],
                    "password_changes": [],
                    "email_changes": [],
                },
                # Additional fields (to be added later)
                "profile_picture": "",
                "gender": "",
            },
            "user_settings": {
                "theme": "default",
                "language": "en",
            },
        }
    
    
    @staticmethod
    def __register_validate(method, *args, **kwargs):
        # Returns False if validation passes, else returns error message
        
        __EMAIL_REGEX = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
        __PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$')
        
        if method == "email&password":
            if kwargs['password'] != kwargs['cpassword']:
                return {"data": 'Passwords do not match', 'status': 422}
            
            if not __EMAIL_REGEX.match(kwargs['email']):
                return {"data": 'Invalid email', 'status': 422}
            
            if not __PASSWORD_REGEX.match(kwargs['password']):
                print(kwargs['password'])
                return {"data": 'Minimum eight characters, at least one letter, one number and one special character.', 'status': 422}
            
            return False


    def register_via_email_and_password(self, email, password, cpassword):
        if (validation_res := self.__register_validate("email&password", email=email, password=password, cpassword=cpassword)): return validation_res
        
        user = None
        try:
            # Create user
            user = self.auth.create_user_with_email_and_password(email, password)
            if user:
                # Add user to database with default values
                self.__get_user_path(user['localId']).set(self.__register_create_user_template(email))

                return {"data": 'user created successfully', 'status': 201}

            return {"data": 'user creation failed', 'status': 400}
        
        except Exception as e:

            if user:
                # Delete user if when database creation fails
                self.auth.delete_user_account(user["idToken"])

            if 'EMAIL_EXISTS' in str(e):
                return {"data": 'Email already exists', 'status': 409}

            return {"data": f'Registration failed: {e}', "status": 520}
        
    # ----------------------------------------- REGISTER -----------------------------------------
        

    # +++++++++++++++++++++++++++++++++++++++++ LOGIN +++++++++++++++++++++++++++++++++++++++++
    # This method is implemented to reduce the number of requests sent to Firebase.
    @staticmethod
    def __login_validate(method, *args, **kwargs):
        # Returns False if validation passes, else returns error message
        __EMAIL_REGEX = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
        __PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$')
        
        if method == "email&password":
            if not __EMAIL_REGEX.match(kwargs['email']):
                return {"data": 'Invalid email', 'status': 422}
            
            if not __PASSWORD_REGEX.match(kwargs['password']):
                return {"data": 'Minimum eight characters, at least one letter, one number and one special character.', 'status': 422}
            
            return False

    
    def login_via_email_and_password(self, email, password):
        # Validate email and password
        if (validation_res := self.__login_validate("email&password", email=email, password=password)): return validation_res
        
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)
            if user:
                # check user status
                account_status = self.__get_user_path(user['localId']).child("user_info/account_status").get().val()
                if account_status == "suspended":
                    return {"data": 'Account suspended', "status": 403}
                
                elif account_status == "disabled":
                    # TODO: TO NIE WIEM CZY DZIAŁA BO TEN FEATURE BĘDZIE WPROWADZONY CHYBA W *** PÓŹNIEJ :|
                    disabled_at = self.__get_user_path(user["localId"]).child("user_info/disabled_at").get().val()
                    delete_at = dt.strptime(disabled_at, "%d/%m/%Y") + timedelta(days=30)

                    return {"data": f'Account disabled at {disabled_at} and will be deleted {delete_at}', "status": 403}
                
                elif account_status == "deleted":
                    return {"data": 'Account deleted', "status": 403}
                
                # add language to response
                user['language'] = self.__get_user_path(user['localId']).child("user_settings/language").get().val()
                print(user['language'])

                return {"data": user, 'status': 200}
            else:
                return {"data": 'Unexpected error', "status": 520}
            

        except Exception as e:
            if 'INVALID_LOGIN_CREDENTIALS' in str(e):
                return {"data": 'Wrong email or password', 'status': 401}

            return {"data": f'Login failed: {e}', "status": 520}

    # ----------------------------------------- LOGIN -----------------------------------------

        
    # +++++++++++++++++++++++++++++++++++++++++ OTHER +++++++++++++++++++++++++++++++++++++++++
    def change_password(self, email):
        try:
            self.auth.send_password_reset_email(email)
            return {"data": 'Email sent successfully', "status": 200}
        except Exception as e:
            return {"data": f'Password change failed: {e}', "status": 520}
        

    def delete_account(self, localId, idToken):
        try:
            # Delete user from database
            user_info = self.__get_user_path(localId).child("user_info")
            user_info.update({"account_status": "disabled", "disabled_at": dt.now().strftime("%d/%m/%Y")})
            return {"data": 'Account deleted successfully', "status": 200}
        
        except Exception as e:
            return {"data": f'Account deletion failed: {e}', "status": 520}
        

    def change_user_lang(self, localId, lang):
        try:
            self.__get_user_path(localId).child("user_settings").update({"language": lang})
            return {"data": 'Language changed successfully', "status": 200}
        
        except Exception as e:
            return {"data": f'Language change failed: {e}', "status": 520}
        

    def get_user(self, localId):
        try:
            # user settings and info
            user_settings = self.__get_user_path(localId).child("user_settings").get().val()
            user_info = self.__get_user_path(localId).child("user_info").get().val()
            user = {**user_settings, **user_info}

            return {"data": user, "status": 200}
        
        except Exception as e:
            return {"data": f'User get failed: {e}', "status": 520}
    # ----------------------------------------- OTHER -----------------------------------------