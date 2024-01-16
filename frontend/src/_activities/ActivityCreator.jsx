import PropTypes from "prop-types";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query"

// Flatpickr - calendar
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import { Polish } from "flatpickr/dist/l10n/pl.js";

import "./ActivityCreator.scss";
import { saveActivity } from "../api/api_App";
import { LoadingPage } from "../components/LoadingPage";

export const ActivityCreator = ({ toggleCreator, langPack, refetchActivities }) => {
    ActivityCreator.propTypes = {
        toggleCreator: PropTypes.func.isRequired,
        refetchActivities: PropTypes.func.isRequired,
        langPack: PropTypes.object.isRequired,
    };

    const calendarLangPack = sessionStorage.getItem("hh_lang") == 'pl' ? Polish : null;
    const text = langPack["activityCreator"];

    const [title, setTitle] = useState("");
    const [date, setDate] = useState();
    const [time, setTime] = useState();

    const saveActivityMutation = useMutation({
        mutationFn: () => saveActivity(title, date, time),
        onSuccess: () => {
            refetchActivities().then(() => toggleCreator());
            console.log("success");
        },
        onError: () => {
            console.log("error");
            saveActivityMutation.reset();
        },
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Dodaj 1, ponieważ miesiące są indeksowane od 0
    const day = today.getDate().toString().padStart(2, '0');

    const calendarChangeHandler = (selectedDates, dateStr) => {
        const splitSpace = dateStr.split(" ");
        setDate(splitSpace[0]);
        setTime(splitSpace[1]);
    };

    const flatpickrRef = useRef(null);
    const onSaveHandler = () => {
        // Spróbuj uzyskać dostęp do instancji Flatpickr i ręcznie zaktualizuj stan
        if (flatpickrRef.current) {
            const selectedDates = flatpickrRef.current.flatpickr.selectedDates;
            const dateStr = flatpickrRef.current.flatpickr.formatDate(selectedDates[0], "d-m-Y H:i");

            const splitSpace = dateStr.split(" ");
            setDate(splitSpace[0]);
            setTime(splitSpace[1]);
        }

        saveActivityMutation.mutate();
    }

    if (saveActivityMutation.isLoading) {
        return <LoadingPage info={text.saveActivity} />;
    }
    
    return (
        <div className="activity-creator">
            <div className="title">
                <h2>{text.title}</h2>
                <input type="text" onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="calendar">
                <Flatpickr
                    data-enable-time
                    value={date}
                    onChange={calendarChangeHandler}
                    options={{
                        inline: true,
                        enableTime: true,
                        time_24hr: true,
                        enableSeconds: false,
                        minDate: `${year}-${month}-${day}`,
                        minTime: `${day}-${month}-${year}` === date ? today.getHours() + ":" + today.getMinutes() : "00:00",    
                        dateFormat: "d-m-Y H:i",
                        locale: calendarLangPack,
                    }}
                />
            </div>

            <div className="controls">
                <button className="exit activity-btn" onClick={() => toggleCreator()}>{text.exitBtn}</button>
                <button className="save activity-btn" onClick={onSaveHandler}>{text.saveBtn}</button>
            </div>
        </div>
    );
};
