import { useState } from 'react'
import { useMutation } from "@tanstack/react-query"
import PropTypes from 'prop-types'
import { getLang, saveHabit } from '../api/api_App'
import { LoadingPage } from '../components/LoadingPage'

import './HabitCreator.scss'
import languages from '../../public/translations/languages.json'

export const HabitCreator = ({toggleCreator, refetchHabits}) => {
    HabitCreator.propTypes = {
        toggleCreator: PropTypes.func.isRequired,
        refetchHabits: PropTypes.func.isRequired,
    }

    const [title, setTitle] = useState("")
    const text = getLang() === "pl" ? languages["pl-PL"]["habitCreator"] : languages["en-US"]["habitCreator"];

    const saveHabitMutation = useMutation({
        mutationFn: () => saveHabit(title),
        onSuccess: () => {
            refetchHabits().then(() => toggleCreator());
        },
        onError: () => {
            console.log("error")
            saveHabitMutation.reset()
        },
    })

    const handleSaveHabit = () => {
        saveHabitMutation.mutate()
    }

    if (!saveHabitMutation.isIdle) {
        return <LoadingPage info={text.saveHabit}/>
    }
    
    return (
        <div className='habit-creator'>
            <div className="title-input">
                <h2 className='header'>{text.header}</h2>
                <input type="text" defaultValue={title} onChange={e => setTitle(e.target.value)}/>
            </div>

            <div className="controls">
                <button className='exit-btn' onClick={() => toggleCreator()}>{text.exitBtn}</button>
                <button className='save-btn' onClick={() => handleSaveHabit()}>{text.saveBtn}</button>
            </div>
        </div>
    )
}