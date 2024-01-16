from datetime import datetime as dt

from Helpers import move_keys_inside_values

class Notes:
    def __init__(self, firebase_db):
        self.db = firebase_db


    # +++++++++++++++++++++++++++++++++++++++++ HELPERS +++++++++++++++++++++++++++++++++++++++++
    def user_path(self, localId): return self.db.child("users").child(localId)
    def __get_note_by_id(self, localId, noteId): return self.user_path(localId).child("notes").child(noteId) 
    # ----------------------------------------- HELPERS -----------------------------------------


    def get_notes(self, localId):
        if not self.user_path(localId).child("notes").get().val():
            return {'data': f'You have no notes yet.', 'status': 204}
        
        try:
            data = self.user_path(localId).child('notes').get()
            if data.val():
                data = move_keys_inside_values(data.val())
                return {'data': data, 'status': 200}
            else:
                return {'data': f'Fetching notes failed.', 'status': 520}
            
        except Exception as e:
            return {'data': f'Fetching notes failed. {e}', 'status': 520}
    

    def add_note(self, localId, title, content):
        try:
            response = self.user_path(localId).child("notes").push({
                "title": title,
                "content": content,
                "date": dt.now().strftime("%d/%m/%Y %H:%M:%S")
            })
            if response:
                return {'data': f'Note added successfully.', 'status': 201}
            
        except Exception as e:
            return {'data': f'Adding note failed. {e}', 'status': 520}


    def update_note(self, localId, noteId, title, content):
        try:
            self.user_path(localId).child(f'notes/{noteId}').update({
                "title": title,
                "content": content,
                "date": dt.now().strftime("%d/%m/%Y %H:%M:%S"),
            })
            return {'data': f'Note updated successfully.', 'status': 200}
        
        except Exception as e:
            return {'data': f'Updating note failed. {e}', 'status': 520}

    def delete_note(self, localId, noteId):
        try:
            self.__get_note_by_id(localId, noteId).remove()
            return {'data': f'Note deleted successfully.', 'status': 200}
        except Exception as e:
            return {'data': f'Deleting note failed. {e}', 'status': 520}
    