import PropTypes from 'prop-types';
import { Timer } from './Timer';
import { useMutation } from '@tanstack/react-query';
import { changeActivityStatus, deleteActivity } from '../api/api_App';
import { LoadingPage } from '../components/LoadingPage';

export const Activity = ({ activity, refetchActivities, langPack }) => {
    Activity.propTypes = {
        activity: PropTypes.object.isRequired,
        refetchActivities: PropTypes.func.isRequired,
        langPack: PropTypes.object.isRequired,
    };

    const text = langPack['activity'];

    const deleteActivityMutation = useMutation({
        mutationFn: () => deleteActivity(activity.key),
        onSuccess: () => refetchActivities(),
        onError: () => deleteActivityMutation.reset(),
    });

    const changeActivityStatusMutation = useMutation({
        mutationFn: () => changeActivityStatus(activity.key, 'done'),
        onSuccess: () => refetchActivities(),
        onError: () => changeActivityStatusMutation.reset(),
    });

    const chandleDeleteActivity = () => {
        deleteActivityMutation.mutate();
    }

    const chandleChangeActivityStatus = () => {
        changeActivityStatusMutation.mutate();
    }

    if (deleteActivityMutation.status === 'pending') {
        return <LoadingPage info={text.deletingActivity} />;
    }

    return (
        <div className="activity" key={activity.key}>
            <div className="info">
                
                <div className='info-div title'>
                    <h1 className='header'>Title:</h1>
                    <p className='content'>{activity.title}</p>
                </div>

                <div className='info-div date'>
                    <h1 className='header'>End date:</h1>
                    <p className='content'>{activity.date + ' ' + activity.time}</p>
                </div>

                <div className="timer">
                    <Timer endDate={activity.date} endTime={activity.time} id={activity.key} refetchActivities={refetchActivities}/>
                </div>
            
            </div>

            <div className="controls">
                <button className="delete-btn" onClick={chandleDeleteActivity}>Delete</button>
                <button className="check-btn" onClick={chandleChangeActivityStatus} disabled={activity.state === 'done'}>Done</button>
            </div>
        </div>
    );
};