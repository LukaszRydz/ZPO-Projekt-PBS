import { useState } from "react";

import { LoginForm } from "./forms/LoginForm";
import { RegisterForm } from "./forms/RegisterForm";
import { ForgotPassword } from "./forms/ForgotPassword";
import { Separator } from "../components/Separator";

import "./Auth.scss";
import { LoadingForm } from "./forms/LoadingForm";

export const Auth = () => {
    const [activeForm, setActiveForm] = useState("login");
    const [requestDetails, setRequestDetails] = useState({
        isFetching: false,
        details: null,
        // if false user have to confirm message
        confirmation: false,
        error: false
    });


    const toggleForm = (form) => {      
        setActiveForm(form);
    }
    
    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="hexagon-1"><div className="hexagon-2"><img className="auth-logo" src="./public/images/logo.png" alt="logo" /></div></div>
                {(requestDetails.isFetching || requestDetails.details) ? <LoadingForm requestDetails={requestDetails} setRequestDetails={setRequestDetails}/> : (
                    <>
                        {activeForm === "login" && <LoginForm toggleForm={toggleForm} setRequestDetails={setRequestDetails}/>}
                        {activeForm === "register" && <RegisterForm toggleForm={toggleForm} setRequestDetails={setRequestDetails}/>}
                        {activeForm === "forgotPassword" && <ForgotPassword toggleForm={toggleForm} setRequestDetails={setRequestDetails}/>}
                        {activeForm !== "forgotPassword" && (
                            <>
                                <Separator text="or"/>
                                <button className="form-btn" onClick={() => toggleForm("forgotPassword")}>Forgot Password?</button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}