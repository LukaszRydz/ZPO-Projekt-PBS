from datetime import datetime as dt
from Helpers import move_keys_inside_values

class Activities:
    def __init__(self, firebase_db):
        self.db = firebase_db
    
    
    # +++++++++++++++++++++++++++++++++++++++++ HELPERS +++++++++++++++++++++++++++++++++++++++++
    def user_path(self, localId): return self.db.child("users").child(localId)
    def get_activity_by_id(self, localId, id): return self.user_path(localId).child("activities").child(id)
    # +++++++++++++++++++++++++++++++++++++++++ HELPERS +++++++++++++++++++++++++++++++++++++++++

    def get_activities(self, localId):
        if not self.user_path(localId).child("activities").get().val():
            return {'data': f'You have no notes yet.', 'status': 204}
        
        try:
            response = self.user_path(localId).child("activities").get()
            if response:
                return {'data': move_keys_inside_values(response.val()), 'status': 200}
            else:
                return {'data': 'No activities found.', 'status': 404}
        except Exception as e:
            print(e)
            return {'data': f'Getting activities failed. {e}', 'status': 520}
    
    def add_activity(self, localId, title, date, time):
        try:
            response = self.user_path(localId).child("activities").push({
                "title": title,
                "date": date,
                "time": time,
                "state": "pending",
                "added": dt.now().strftime("%d/%m/%Y %H:%M:%S") 
            })

            if response:
                return {'data': f'Activity added successfully.', 'status': 201}
            
        except Exception as e:
            print(e)
            return {'data': f'Adding activity failed. {e}', 'status': 520}
        

    def change_activity_state(self, localId, id, state):
        try:
            response = self.user_path(localId).child("activities").child(id).update({
                "state": state
            })

            if response:
                return {'data': f'Activity state changed successfully.', 'status': 200}
            
        except Exception as e:
            print(e)
            return {'data': f'Changing activity state failed. {e}', 'status': 520}
        

    def delete_activity(self, localId, id):
        try:
            response = self.get_activity_by_id(localId, id).remove()
            return {'data': f'Activity deleted successfully.', 'status': 200}
            
        except Exception as e:
            print(e)
            return {'data': f'Deleting activity failed. {e}', 'status': 520}