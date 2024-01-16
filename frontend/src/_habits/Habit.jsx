import propTypes from "prop-types";

import { useMutation } from "@tanstack/react-query";
import { deleteHabit, doneHabit } from "../api/api_App";

import { LoadingPage } from "../components/LoadingPage";

export const Habit = ({ habit, refetchHabits, langPack }) => {
    Habit.propTypes = {
        refetchHabits: propTypes.func.isRequired,
        habit: propTypes.object.isRequired,
        langPack: propTypes.object.isRequired,
    };
    const text = langPack["habit"];

    const doneHabitMutation = useMutation({
        mutationFn: () => doneHabit(habit.key),
        onSuccess: () => {
            refetchHabits();
        },
        onError: (err) => console.log(err),
    });

    const deleteHabitMutation = useMutation({
        mutationFn: () => deleteHabit(habit.key),
        onSuccess: () => {
            refetchHabits();
        },
        onError: (err) => console.log(err),
    });

    const handleDoneClick = (e) => {
        e.stopPropagation();
        doneHabitMutation.mutate();
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        deleteHabitMutation.mutate();
    }

    if (doneHabitMutation.status === "pending") {
        return <LoadingPage info={text.saveHabit} />;
    }

    if (deleteHabitMutation.status === "pending") {
        return <LoadingPage info={text.deleteHabit} />;
    }

    return (
        <div className="habit" key={habit.key}>
            {habit.done && 
                <svg className="done-mark" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path fill="#c8e6c9" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#4caf50" d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"></path>
                </svg>
            }
            <div className="title-container">
                <h1 className="header">{text.header}</h1>
                <p className="content">{habit.title}</p>
            </div>

            <div className="controls">
                <button className="delete-btn" onClick={handleDeleteClick}>{text.deleteButton}</button>
                <button className="check-btn" onClick={handleDoneClick} disabled={habit.done}>{text.doneButton} </button>
            </div>
            <div className="combo"><p>{'combo: ' + habit.combo}</p></div>
        </div>
    );
};
