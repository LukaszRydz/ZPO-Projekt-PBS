from datetime import datetime as dt
from Helpers import move_keys_inside_values

class Habits:
    def __init__(self, firebase_db):
        self.db = firebase_db

    # +++++++++++++++++++++++++++++++++++++++++ HELPERS +++++++++++++++++++++++++++++++++++++++++
    def user_path(self, localId): return self.db.child("users").child(localId)
    def __get_habit_by_id(self, localId, noteId): return self.user_path(localId).child("habits").child(noteId)
    # ----------------------------------------- HELPERS -----------------------------------------

    def get_habits(self, localId):
        if not self.user_path(localId).child("habits").get().val():
            return {'data': f'You have no habits yet.', 'status': 204}
        
        try:
            data = self.user_path(localId).child('habits').get()
            if data.val():

                updated_data = {}
                for habit_id, habit in data.val().items():
                    if habit['date'] != dt.now().strftime("%d/%m/%Y"):   
                        updated_data[habit_id] = {
                            "title": habit['title'],
                            "date": dt.now().strftime("%d/%m/%Y"),
                            "combo": 0 if not habit['done'] else habit['combo'],
                            "done": False,
                        }

                if updated_data:
                    self.user_path(localId).child('habits').update(updated_data)
                    data = self.user_path(localId).child('habits').get()

                data = move_keys_inside_values(data.val())
                return {'data': data, 'status': 200}
            else:
                return {'data': f'Fetching habits failed.', 'status': 520}
            
        except Exception as e:
            return {'data': f'Fetching habits failed. {e}', 'status': 520}
        

    def add_habit(self, localId, title):
        try:
            response = self.user_path(localId).child("habits").push({
                "title": title,
                "date": dt.now().strftime("%d/%m/%Y"),
                "done": False,
                "combo": 0,
            })

            if response:
                return {'data': f'Habit added successfully.', 'status': 201}
            
        except Exception as e:
            return {'data': f'Adding habit failed. {e}', 'status': 520}
        
    
    def done_habit(self, localId, habitId):
        habit_path = self.__get_habit_by_id(localId, habitId).get().val()
        try:
            self.user_path(localId).child(f'habits/{habitId}').update({
                "done": True,
                "combo": habit_path['combo'] + 1,
            })
            return {'data': f'Habit done successfully.', 'status': 200}
        
        except Exception as e:
            print(e)
            return {'data': f'Doing habit failed. {e}', 'status': 520}
        
    
    def delete_habit(self, localId, habitId):
        try:
            self.user_path(localId).child(f'habits/{habitId}').remove()
            return {'data': f'Habit deleted successfully.', 'status': 200}
        
        except Exception as e:
            return {'data': f'Deleting habit failed. {e}', 'status': 520}