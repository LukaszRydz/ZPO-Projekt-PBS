import PropTypes from 'prop-types';
import { register } from '../../api/api_Auth';

export const RegisterForm = ({toggleForm, setRequestDetails}) => {
    RegisterForm.propTypes = {
        toggleForm: PropTypes.func.isRequired,
        setRequestDetails: PropTypes.func.isRequired
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, cpassword } = e.target;

        setRequestDetails({isFetching: true, details: "Registering..."});
        await register(email.value, password.value, cpassword.value).then((res) => {
            if (res.code === "ERR_NETWORK") {
                setRequestDetails({isFetching: false, details: "Network error. Please try again later.", confirmation: true, error: true});
            }
            else if (res.status >= 200 && res.status < 300) {
                setRequestDetails({isFetching: false, details: "Registration successful!", confirmation: true});
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

                <div className="imput-container">
                    <label className="form-label" htmlFor="cpassword">Confirm password:</label>
                    <input className="form-input" min="5" max="40" required type="password" name="cpassword" id="cpassword" />
                </div>

                <div className="controls">
                    <button className="form-btn form-submit-btn" type="submit">{"Register >"}</button>
                    <button className="form-btn" onClick={() => toggleForm("login")}>Login</button>
                </div>
            </form>
        </>
    );
}