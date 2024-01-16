import { useState } from 'react'
import { useMutation } from "@tanstack/react-query"

import PropTypes from 'prop-types'

import './NoteEditor.scss'
import { saveNote, getLang } from '../api/api_App'
import { LoadingPage } from '../components/LoadingPage'

import languages from '../../public/translations/languages.json'

export const NoteEditor = ({prop_title="", prop_content="", prop_id="", toggleEditor, refetchNotes}) => {
    NoteEditor.propTypes = {
        prop_title: PropTypes.string,
        prop_content: PropTypes.string,
        prop_id: PropTypes.string,
        toggleEditor: PropTypes.func.isRequired,
        refetchNotes: PropTypes.func.isRequired,
    }

    const [title, setTitle] = useState(prop_title)
    const [content, setContent] = useState(prop_content)
    const [id] = useState(prop_id)
    const [titleLength, setTitleLength] = useState(title.length);
    const [contentLength, setContentLength] = useState(content.length);

    const maxTitleLength = 50;
    const maxContentLength = 5000;

    const text = getLang() === "pl" ? languages["pl-PL"]["noteEditor"] : languages["en-US"]["noteEditor"];

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        if (newTitle.length <= maxTitleLength) {
            setTitle(newTitle);
            setTitleLength(newTitle.length);
        }
    };

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        if (newContent.length <= maxContentLength) {
            setContent(newContent);
            setContentLength(newContent.length);
        }
    };


    const saveNoteMutation = useMutation({
        mutationFn: () => saveNote(title, content, id),
        onSuccess: () => {
            refetchNotes().then(() => toggleEditor());
        },
        onError: () => {
            console.log("error")
            saveNoteMutation.reset()
        },
    }) 
    
    const handleSaveNote = () => {
        saveNoteMutation.mutate()
    }

    if (!saveNoteMutation.isIdle) {
        return <LoadingPage info={text.saveNote}/>
    }

    return (
        <div className="note-editor">
            <div className="title-input">
                <p className="length">{titleLength}/{maxTitleLength}</p>
                <h2 className='header'>{text.title}</h2>
                <input type="text" value={title} onChange={handleTitleChange} />
            </div>

            <div className="content-input">
                <h2 className='header'>{text.content}</h2>
                <p className="length">{contentLength}/{maxContentLength}</p>
                <textarea
                    name="note-content"
                    id="note-content"
                    cols="30"
                    rows="10"
                    value={content}
                    onChange={handleContentChange}
                />
            </div>

            <div className="controls">
                <button className='exit' onClick={() => toggleEditor()}>{text.exitBtn}</button>
                <button className='save' onClick={() => handleSaveNote()}>{text.saveBtn}</button>
            </div>
        </div>
    );
};