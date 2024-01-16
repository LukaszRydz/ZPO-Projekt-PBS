import axios from 'axios';

const DB_URL= import.meta.env.VITE_DB_URL;

export const login = (mail, pass) => {
    return axios.post(DB_URL + '/login_via_email_and_password', {email: mail, password: pass})
    .then((res) => {
        if (res.status >= 200 && res.status < 300) return res;
    }).catch((err) => {
        if (err.response) return err.response;
        return err  
    })
};

export const register = (mail, pass, cpass) => {
    return axios.post(DB_URL + '/register_via_email_and_password', {email: mail, password: pass, cpassword: cpass})
    .then((res) => {
        if (res.status >= 200 && res.status < 300) return res;
    }).catch((err) => {
        if (err.response) return err.response;
        return err.response;
    })
}

export const forgotPassword = (mail) => {
    return axios.post(DB_URL + '/send_password_reset_email', {email: mail})
    .then((res) => {
        if (res.status >= 200 && res.status < 300) return res;
    }).catch((err) => {
        return err.response;
    })
}

export const deleteAccount = (idToken, localId) => {
    console.log(idToken, localId)
    return axios.delete(DB_URL + `/delete_account?idToken=${idToken}&localId=${localId}`)
    .then((res) => {
        console.log(res.status);
        if (res.status >= 200 && res.status < 300) return res;
    }).catch((err) => {
        return err.response;
    })
}