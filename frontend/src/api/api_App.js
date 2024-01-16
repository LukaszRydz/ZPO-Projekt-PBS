export const getLocalId = () => sessionStorage.getItem("hh_localId") || window.location.replace("/auth");
export const getIdToken = () => sessionStorage.getItem("hh_idToken") || window.location.replace("/auth");
export const getLang = () => sessionStorage.getItem("hh_lang") || 'en';

const db = import.meta.env.VITE_DB_URL;

// ================================= NOTES API =================================
// 
//                                     START
// 
// ================================= NOTES API =================================


export const fetchNotes = async () => {
    const res = await fetch(db + '/get_notes?localId=' + getLocalId())
    if (res.status === 204) return []; 
    return res.json();
}

export const saveNote = async (title="", content="", id="") => {
    const endpoint = id ? '/update_note' : '/add_note';
    const method = id ? 'PUT' : 'POST';
    const data = {
        'localId': getLocalId(),
        'title': title,
        'content': content,
        'noteId': id,
    };

    const res = await fetch(db + endpoint, {
        method: method,
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

export const deleteNote = async (id) => {
    const data = {
        'localId': getLocalId(),
        'noteId': id,
    };

    const res = await fetch(db + '/delete_note', {
        method: 'DELETE',
        mode: "cors",
        body: JSON.stringify( data ),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

// ================================= NOTES API =================================
// 
//                                      END
// 
// ================================= NOTES API =================================


// ================================= HABITS API =================================
//
//                                     START
//
// ================================= HABITS API =================================

export const fetchHabits = async () => {
    const res = await fetch(db + '/get_habits?localId=' + getLocalId())
    if (res.status === 404 || res.status === 204) return []; 
    return res.json();
}

export const saveHabit = async (title="") => {
    const data = {
        'localId': getLocalId(),
        'title': title,
    };

    const res = await fetch(db + '/add_habit', {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

export const deleteHabit = async (id) => {
    const data = {
        'localId': getLocalId(),
        'habitId': id,
    };

    const res = await fetch(db + '/delete_habit', {
        method: 'DELETE',
        mode: "cors",
        body: JSON.stringify( data ),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}


export const doneHabit = async (id) => {
    const data = {
        'localId': getLocalId(),
        'habitId': id,
    };

    const res = await fetch(db + '/done_habit', {
        method: 'PUT',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

// ================================= HABITS API =================================
//
//                                      END
//
// ================================= HABITS API =================================


// ================================= ACTIVITY API =================================
//
//                                     START
//
// ================================= ACTIVITY API =================================

export const fetchActivities = async () => {
    const res = await fetch(db + '/get_activities?localId=' + getLocalId())
    if (res.status === 404 || res.status === 204) return []; 
    return res.json();
}

export const saveActivity = async (title, date, time) => {
    const data = {
        'localId': getLocalId(),
        'title': title,
        'date': date,
        'time': time,
    };

    const res = await fetch(db + '/add_activity', {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

export const deleteActivity = async (id) => {
    const data = {
        'localId': getLocalId(),
        'id': id,
    };

    const res = await fetch(db + '/delete_activity', {
        method: 'DELETE',
        mode: "cors",
        body: JSON.stringify( data ),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}   

export const changeActivityStatus = async (id, state) => {
    const data = {
        'localId': getLocalId(),
        'id': id,
        'state': state,
    };

    const res = await fetch(db + '/change_activity_state', {
        method: 'PUT',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

// ================================= USER API =================================

export const getUser = async () => {
    const res = await fetch(db + '/get_user?localId=' + getLocalId())
    if (res.status === 404 || res.status === 204) return []; 
    return res.json();
}

export const changeUserLang = async (lang) => {
    const data = {
        'localId': getLocalId(),
        'lang': lang,
    };

    const res = await fetch(db + '/change_user_lang', {
        method: 'PUT',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json()
}

