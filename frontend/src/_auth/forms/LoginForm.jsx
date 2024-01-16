import PropTypes from 'prop-types';

import { login } from "../../api/api_Auth";
import { useNavigate } from 'react-router-dom';

export const LoginForm = ({toggleForm, setRequestDetails}) => {    
    LoginForm.propTypes = {
        toggleForm: PropTypes.func.isRequired,
        setRequestDetails: PropTypes.func.isRequired
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = e.target;

        setRequestDetails({isFetching: true, details: "Logging in..."});
        await login(email.value, password.value).then((res) => {
            if (res.code === "ERR_NETWORK") {
                setRequestDetails({isFetching: false, details: "Network error. Please try again later.", confirmation: true, error: true});
            }
            else if (res.status >= 200 && res.status < 300) {
                setRequestDetails({isFetching: false, details: null});
                sessionStorage.setItem("hh_idToken", res.data.idToken);
                sessionStorage.setItem("hh_localId", res.data.localId);
                sessionStorage.setItem("hh_lang", res.data.language);
                navigate('/')
            } else {
                setRequestDetails({isFetching: false, details: res.data, confirmation: true, error: true});
            }
        })
    };

    return (
        <>
            <form className="auth-form" onSubmit={handleSubmit}>

                <div className="imput-container">
                    <label className="form-label" htmlFor="email">Email:</label>
                    <input className="form-input" min="3" max="25" required type="email" name="email" id="email" />
                </div>

                <div className="imput-container">
                    <label className="form-label" htmlFor="password">Password:</label>
                    <input className="form-input" min="5" max="40" required type="password" name="password" id="password" />
                </div>

                <div className="controls">
                    <button className="form-btn form-submit-btn" type="submit">{"Login >"}</button>
                    <button className="form-btn" onClick={() => toggleForm("register")}>Register</button>
                </div>
            </form>
        </>
    );
};
