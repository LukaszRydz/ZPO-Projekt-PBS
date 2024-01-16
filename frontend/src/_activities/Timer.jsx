import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { changeActivityStatus } from "../api/api_App";

export const Timer = ({ endDate, endTime, id, refetchActivities }) => {
    Timer.propTypes = {
        endDate: PropTypes.string.isRequired,
        endTime: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        refetchActivities: PropTypes.func.isRequired,
    };

    const [day, month, year] = endDate.split("-");
    const [hour, minute] = endTime.split(":");

    const calculateTimeLeft = useCallback(() => {
        const date = new Date(year, month - 1, day, hour, minute, 0, 0);
        const timeDiff = date - new Date();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        switch (true) {
            case days >= 1:
                return { timeLeft: "Pozostało " + days + " dni", interval: timeDiff - (86400000 * days) }; // 24h
            case hours >= 1:
                return { timeLeft: "Pozostało " + hours + " godzin." , interval: timeDiff - (3600000 * hours) };
            case seconds > 0:
                return { timeLeft: "Pozostało " + minutes + " minut " + (seconds - minutes * 60) + " sekund", interval: 1000 }; // 1s
            default:
                return { timeLeft: "Pozostało 0 sekund", interval: 0 };
        }
    }, [day, month, year, hour, minute]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const { interval } = calculateTimeLeft();
        const intervalId = setInterval(() => {
            const updatedTimeLeft = calculateTimeLeft();
            setTimeLeft(updatedTimeLeft);

            if (updatedTimeLeft.interval <= 0) {
                clearInterval(intervalId);
                changeActivityStatus(id, 'expired').then(() => refetchActivities());
            }
        }, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [calculateTimeLeft]);

    return <p>{timeLeft.timeLeft}</p>;
};
