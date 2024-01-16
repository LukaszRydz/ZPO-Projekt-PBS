import { PropTypes } from 'prop-types'

import './Navbar.scss'

import languages from '../../public/translations/languages.json'
import { getLang } from '../api/api_App'

export const Navbar = ({handlePageChange, page}) => {
    Navbar.propTypes = {
        handlePageChange: PropTypes.func.isRequired,
        page: PropTypes.string.isRequired
    }
    
    const text = getLang() == 'pl' ? languages['pl-PL']['navbar'] : languages['en-US']['navbar']

    return (
        <div className="navbar">
            <button disabled={page === 'habits'} onClick={() => handlePageChange("habits")}>
                <img src="./public/images/habits.png" alt="habits" />
                <p>{text.habits}</p>
                <div className="arrow-up"></div>
            </button>
            <button disabled={page === 'notes'} onClick={() => handlePageChange("notes")}>
                <img src="./public/images/notes.png" alt="notes" />
                <p>{text.notes}</p>
                <div className="arrow-up"></div>
            </button>
            <button disabled={page === 'activities'} onClick={() => handlePageChange("activities")}>
                <img src="./public/images/activities.png" alt="activities" />
                <p>{text.activities}</p>
                <div className="arrow-up"></div>
            </button>
            <button disabled={page === 'settings'} onClick={() => handlePageChange("settings")}>
                <img src="./public/images/settings.png" alt="settings" />
                <p>{text.settings}</p>
                <div className="arrow-up"></div>
            </button>
        </div>
    )
}