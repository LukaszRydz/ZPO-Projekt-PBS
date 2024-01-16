import PropTypes from "prop-types";

import "./Separator.scss";
export const Separator = ({text="or"}) => {
    Separator.propTypes = {
        text: PropTypes.string.isRequired
    };

    return (
        <div className="separator">
            <hr />
                <p className="separator-text">{text}</p>
            <hr />
        </div>
    );
}