import PropTypes from "prop-types";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import "./Activities.scss";

import { LoadingPage } from "../components/LoadingPage";
import { ActivityCreator } from "./ActivityCreator";
import { fetchActivities } from "../api/api_App";
import { Activity } from "./Activity";

export const Activities = ({ langPack }) => {
    Activities.propTypes = {
        langPack: PropTypes.object.isRequired,
    };

    const [creatorFlag, setCreatorFlag] = useState(false);
    const toggleCreator = () => {
        creatorFlag ? setCreatorFlag(false) : setCreatorFlag(true);
    };

    const text = langPack["activities"];

    const { data: activities, isLoading, refetch: refetchActivities } = useQuery({
        queryFn: () => fetchActivities(),
        queryKey: ["activities"],
    });

    if (isLoading) {
        return <LoadingPage info={text.fetchingActivities}/>
    }

    if (creatorFlag) {
        return <ActivityCreator toggleCreator={toggleCreator} langPack={langPack} refetchActivities={refetchActivities} />;
    }

    if (activities.length > 0) {
        return (
            <div className="activities">
                {activities?.map((activity) => {
                    if (activity.state === "pending") {
                        return <Activity key={activity.key} activity={activity} refetchActivities={refetchActivities} langPack={langPack} />;
                    }
                })}
                <button className="create-new-btn" onClick={() => toggleCreator()}>
                    <img src="./public/images/plus.png" alt="add_activity" />
                </button>
            </div>
        );
    }

    return (
        <div className="activities">
            <h1>{text.activitiesNotFound}</h1>
            <button className="create-new-btn" onClick={() => toggleCreator()}>
                <img src="./public/images/plus.png" alt="add_activity" />
            </button>
        </div>
    );
};
