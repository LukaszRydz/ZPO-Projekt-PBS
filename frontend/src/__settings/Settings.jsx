import PropTypes from 'prop-types'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';

import { deleteAccount, forgotPassword } from '../api/api_Auth'
import { changeUserLang, getIdToken, getLang, getLocalId, getUser } from '../api/api_App'
import { LoadingPage } from '../components/LoadingPage'

import './Settings.scss'

export const Settings = ({ langPack, setLang }) => {
    Settings.propTypes = {
        langPack: PropTypes.object.isRequired,
        setLang: PropTypes.func.isRequired,
    }

    const navigate = useNavigate();
    const text = langPack['settings']

    const {data: user} = useQuery({
        queryKey: ['user'],
        queryFn: () => getUser(),
        isError: (err) => console.log(err),
        isSuccess: (data) => console.log(data),
    });

    const deleteAccountMutation = useMutation({
        mutationFn: () => deleteAccount(getIdToken(), getLocalId()),
        onSuccess: () => {
            alert("Account deleted")
            navigate("/auth")
        },
        onError: (err) => console.log(err),
    })

    const changLangMutation = useMutation({
        mutationFn: (langPack) => changeUserLang(langPack),
        onSuccess: () => {
            sessionStorage.setItem("hh_lang", getLang() === "pl" ? "en" : "pl");
            setLang(getLang());
        },
        onError: (err) => console.log(err),
    })

    const changePasswordMutation = useMutation({
        mutationFn: () => forgotPassword(user.email),
        onSuccess: () => {
            alert("Reset password email sent")
        },
        onError: (err) => console.log(err),
    })

    const handleLogout = () => {
        sessionStorage.removeItem("hh_token");
        sessionStorage.removeItem("hh_userId");
        sessionStorage.removeItem("hh_lang");

        navigate("/auth")
    }   

    const handleLangChange = (langPack) => {
        changLangMutation.mutate(langPack)
    }

    const handleDeleteAccount = () => {
        deleteAccountMutation.mutate()
    }

    const handleChangePassword = () => {
        changePasswordMutation.mutate()
    }

    if (deleteAccountMutation.status === "pending") {
        return <LoadingPage info={text.deleteAccount} />;
    }

    if (changLangMutation.status === "pending") {
        return <LoadingPage info={text.changeLanguage} />;
    }

    if (changePasswordMutation.status === "pending") {
        return <LoadingPage info={text.changePassword} />;
    }

    return (
        <div className="settings">
            <div className="langs options-div">
                <h2>{text.languages}</h2>
                <div className='controls'>
                    <button className='lang-btn' disabled={getLang() === 'pl'} onClick={() => handleLangChange("pl")}>
                        <img src="./public/images/lang_pl.png" alt="pl-PL" />
                    </button>
                    <button className='lang-btn' disabled={getLang() === 'en'} onClick={() => handleLangChange("en")}>
                        <img src="./public/images/lang_en.png" alt="en-US" />
                    </button>
                </div>
            </div>

            <div className="account options-div">
                <h2>{text.userSettings}</h2>
                <div className='controls controls-user-settings'>
                    <button className='btn-delete user-settings-btn' onClick={handleDeleteAccount}>{text.deleteAccountBtn}</button>
                    <button className='change-password user-settings-btn' onClick={handleChangePassword}>{text.changePasswordBtn}</button>
                    <button className='btn-logout user-settings-btn' onClick={handleLogout}>{text.logoutBtn}</button>
                </div>
            </div>
        </div>
    )
}