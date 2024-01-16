import propTypes from "prop-types";

import "./LoadingPage.scss"

export const LoadingPage = ({info="fetching..."}) => {
    LoadingPage.propTypes = {
        info: propTypes.string.isRequired,
    }

    return (
        <>
            <div className="loading-page">
                <h3>Loading</h3>
                <div className="loader"></div>
                <h3 className="info">{info}</h3>
            </div>
        </>
    )
}