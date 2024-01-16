import PropTypes from 'prop-types';

export const LoadingForm = ({requestDetails, setRequestDetails}) => {
    LoadingForm.propTypes = {
        requestDetails: PropTypes.object.isRequired,
        setRequestDetails: PropTypes.func.isRequired
    };
    
    return (
        <>
            <div className="auth-form">
                {requestDetails.error ? (
                    <>
                        <p className="error-text">{requestDetails.details}</p>
                    </>
                ) : (<p>{requestDetails.details}</p>)}
                {(requestDetails.confirmation === true) && (<button className="form-btn" onClick={() => setRequestDetails({isFetching: false, error: false, confirmation: false})}>{"< Back"}</button>)}
            </div>
        </>
    );
}