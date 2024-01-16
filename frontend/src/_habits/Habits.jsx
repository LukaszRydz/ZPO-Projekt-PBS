import PropTypes from "prop-types";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingPage } from "../components/LoadingPage";
import { fetchHabits } from "../api/api_App";
import { HabitCreator } from "./HabitCreator";

import "./Habits.scss";
import "../createNewBtn.scss"

import { Habit } from "./Habit";

export const Habits = ({ langPack }) => {
    Habits.propTypes = {
        langPack: PropTypes.object.isRequired,
    };

    const [creatorFlag, setCreatorFlag] = useState(false);
    const text = langPack["habits"];

    const { data: habits, isLoading, refetch: refetchHabits} = useQuery({
        queryFn: () => fetchHabits(),
        queryKey: ["habits"],
    });

    if (isLoading) {
        return <LoadingPage info={text.fetchingHabits} />;
    }

    const toggleCreator = () => (creatorFlag ? setCreatorFlag(false) : setCreatorFlag(true));

    if (creatorFlag) {
        return <HabitCreator toggleCreator={toggleCreator} refetchHabits={refetchHabits} />;
    }

    if (habits.length === 0) {
        return (
            <div className="habits">
                <h2 className="header">{text.habitsNotFound}</h2>
                <button className="create-new-btn" onClick={() => toggleCreator()}>
                    <img src="./public/images/plus.png" alt="add_habit" />
                </button>
            </div>
        );
    }

    return (
        <div className="habits">
            {habits?.map((habit) => {
                return <Habit key={habit.key} habit={habit} refetchHabits={refetchHabits} langPack={langPack}/>;
            })}

            <button className="create-new-btn" onClick={() => toggleCreator()}>
                <img src="./public/images/plus.png" alt="add_habit" />
            </button>
        </div>
    );
};
