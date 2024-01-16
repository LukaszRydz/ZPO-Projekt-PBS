from flask import Flask, request, Response
from flask_cors import CORS

import pyrebase

from dotenv import load_dotenv, dotenv_values
import json

from classes.User import User
from classes.Notes import Notes
from classes.Habits import Habits
from classes.Activities import Activities

# Macros
def get_arg(arg): return request.args.get(arg)


load_dotenv()
env = dotenv_values("./private/.env")

class App:

    # Flask config
    flask = Flask(__name__)
    CORS(flask)

    # Firebase config
    firebase = pyrebase.initialize_app({
        "apiKey": env["apiKey"],
        "authDomain": env["authDomain"],
        "databaseURL": env["databaseURL"],
        "projectId": env["projectId"],
        "storageBucket": env["storageBucket"],
        "messagingSenderId": env["messagingSenderId"],
        "appId": env["appId"],
        "measurementId": env["measurementId"]
    })
    firebase_auth = firebase.auth()
    firebase_db = firebase.database()

    # Classes
    user = User(firebase_auth=firebase_auth, firebase_db=firebase_db)
    notes = Notes(firebase_db=firebase_db)
    habits = Habits(firebase_db=firebase_db)
    activities = Activities(firebase_db=firebase_db)

    # Routes
    @flask.route("/register_via_email_and_password", methods=["POST"])
    def register_via_email_and_password():
        # Get data from request
        data = request.get_json()
        email, password, cpassword = data["email"], data["password"], data["cpassword"]
        response = App.user.register_via_email_and_password(email=email, password=password, cpassword=cpassword)

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/login_via_email_and_password", methods=["POST"])
    def login_via_email_and_password():
        # Get data from request
        data = request.get_json()
        response = App.user.login_via_email_and_password(email=data["email"], password=data["password"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    
    
    @flask.route("/delete_account", methods=["DELETE"])
    def delete_account():
        response = App.user.delete_account(localId=get_arg('localId'), idToken=get_arg('idToken'))

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/change_user_lang", methods=["PUT"])
    def change_user_lang():
        # Get data from request
        data = request.get_json()
        response = App.user.change_user_lang(localId=data["localId"], lang=data["lang"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/get_user", methods=["GET"])
    def get_user():
        # Get data from request
        response = App.user.get_user(localId=get_arg('localId'))

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/send_password_reset_email", methods=["POST"])
    def send_password_reset_email():
        # Get data from request
        data = request.get_json()
        response = App.user.change_password(email=data["email"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/get_notes", methods=["GET"])
    def get_notes():
        # Get data from request
        response = App.notes.get_notes(localId=get_arg('localId'))

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/add_note", methods=["POST"])
    def add_note():
        # Get data from request
        data = request.get_json()
        response = App.notes.add_note(localId=data["localId"], title=data["title"], content=data["content"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/update_note", methods=["PUT"])
    def update_note():
        # Get data from request
        data = request.get_json()
        response = App.notes.update_note(
            localId=data["localId"], 
            noteId=data["noteId"], 
            title=data["title"], 
            content=data["content"]
        )

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/delete_note", methods=["DELETE"])
    def delete_note():
        # Get data from request
        data = request.get_json()
        response = App.notes.delete_note(localId=data["localId"], noteId=data["noteId"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/get_habits", methods=["GET"])
    def get_habits():
        # Get data from request
        response = App.habits.get_habits(localId=get_arg('localId'))

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/add_habit", methods=["POST"])
    def add_habit():
        # Get data from request
        data = request.get_json()
        response = App.habits.add_habit(localId=data["localId"], title=data["title"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    
    @flask.route("/done_habit", methods=["PUT"])
    def done_habit():
        # Get data from request
        data = request.get_json()
        response = App.habits.done_habit(localId=data["localId"], habitId=data["habitId"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/delete_habit", methods=["DELETE"])
    def delete_habit():
        # Get data from request
        data = request.get_json()
        response = App.habits.delete_habit(localId=data["localId"], habitId=data["habitId"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')
    

    @flask.route("/get_activities", methods=["GET"])
    def get_activities():
        # Get data from request
        response = App.activities.get_activities(localId=get_arg('localId'))

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/add_activity", methods=["POST"])
    def add_activity():
        # Get data from request
        data = request.get_json()
        response = App.activities.add_activity(localId=data["localId"], title=data["title"], date=data["date"], time=data["time"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/change_activity_state", methods=["PUT"])
    def change_activity_state():
        # Get data from request
        data = request.get_json()
        response = App.activities.change_activity_state(localId=data["localId"], id=data["id"], state=data["state"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')


    @flask.route("/delete_activity", methods=["DELETE"])
    def delete_activity():
        # Get data from request
        data = request.get_json()
        response = App.activities.delete_activity(localId=data["localId"], id=data["id"])

        return Response(json.dumps(response['data']), status=response['status'], mimetype='application/json')

if __name__ == "__main__":
    # clean console
    print('\033c')
    
    app = App()
    app.flask.run(debug=True, port=3050, threaded=True)
    





# ? Lista statusów HTTP
# 200 - OK - Request oznacza, że żądanie zostało pomyślnie przetworzone.
# 201 - CREATED - Request spowodował utworzenie nowego zasobu.
# 204 - NO CONTENT - Request został pomyślnie przetworzony, ale nie zwraca żadnych treści.
# 400 - BAD REQUEST - Request jest niepoprawny.
# 401 - UNAUTHORIZED - Request wymaga uwierzytelnienia.
# 403 - FORBIDDEN - Serwer zrozumiał żądanie, ale odmawia jego wykonania.
# 404 - NOT FOUND - Zasób nie został znaleziony.
# 409 - CONFLICT - Request spowodował konflikt.
# 500 - INTERNAL SERVER ERROR - Serwer napotkał nieoczekiwany stan, który uniemożliwił mu spełnienie żądania.
# 503 - SERVICE UNAVAILABLE - Serwer nie jest gotowy do obsługi żądania.
# 504 - GATEWAY TIMEOUT - Serwer nie otrzymał odpowiedzi w określonym czasie.
# 507 - INSUFFICIENT STORAGE - Serwer nie może przechowywać reprezentacji zasobu.
# 511 - NETWORK AUTHENTICATION REQUIRED - Klient musi się uwierzytelnić, aby uzyskać dostęp do sieci.
# 520 - UNKNOWN ERROR - Nieznany błąd pochodzący z serwera.
# 522 - ORIGIN CONNECTION TIME-OUT - Serwer nie mógł uzyskać odpowiedzi od oryginalnego serwera w określonym czasie.
# 524 - A TIMEOUT OCCURRED - Serwer otrzymał odpowiedź od oryginalnego serwera, ale nie otrzymał żadnej odpowiedzi w określonym czasie.
# 525 - SSL HANDSHAKE FAILED - Serwer nie mógł nawiązać bezpiecznego połączenia z oryginalnym serwerem.
# 526 - INVALID SSL CERTIFICATE - Serwer otrzymał nieprawidłowy certyfikat SSL od oryginalnego serwera.
# 527 - RAILGUN ERROR - Błąd Railgun.
# 530 - ORIGIN DNS ERROR - Serwer nie mógł nawiązać połączenia z oryginalnym serwerem DNS.
# 531 - SSL CERTIFICATE ERROR - Serwer nie mógł nawiązać bezpiecznego połączenia z oryginalnym serwerem, ponieważ jego certyfikat SSL jest nieprawidłowy.
# 532 - SSL HANDSHAKE FAILED - Serwer nie mógł nawiązać bezpiecznego połączenia z oryginalnym serwerem, ponieważ jego certyfikat SSL jest nieprawidłowy.