import PropTypes from "prop-types";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "../api/api_App";
import { Note } from "./Note";

import "./Notes.scss";
import "../createNewBtn.scss";

import { LoadingPage } from "../components/LoadingPage";
import { NoteEditor } from "./NoteEditor";

export const Notes = ({ langPack }) => {
	Notes.propTypes = {
		langPack: PropTypes.object.isRequired,
	};

	const [editorFlag, setEditorFlag] = useState(false);
	const [currentNoteObj, setCurrentNoteObj] = useState({});
	const text = langPack["notes"];

	const {
		data: notes,
		isLoading,
		refetch: refetchNotes,
	} = useQuery({
		queryFn: () => fetchNotes(),
		queryKey: ["notes"],
	});

	const toggleEditor = (title = "", content = "", id = "") => {
		setCurrentNoteObj({
			title: title,
			content: content,
			id: id,
		});

		editorFlag ? setEditorFlag(false) : setEditorFlag(true);
	};

	if (isLoading) {
		return <LoadingPage info={text.fetchingNotes} />;
	}

	if (editorFlag) {
		return (
			<NoteEditor
				prop_title={currentNoteObj.title}
				prop_content={currentNoteObj.content}
				prop_id={currentNoteObj.id}
				toggleEditor={toggleEditor}
				refetchNotes={refetchNotes}
			/>
		);
	}

	if (notes.length > 0) {
		return (
			<div className="notes">
				{notes?.map((note) => {
					console.log(note);
					return (
						<Note
							key={note.key}
							note={note}
							toggleEditor={toggleEditor}
							refetchNotes={refetchNotes}
							langPack={langPack}
						/>
					);
				})}
				<button
					className="create-new-btn"
					onClick={() => toggleEditor()}
				>
					<img src="./public/images/plus.png" alt="add_note" />
				</button>
			</div>
		);
	} else {
		return (
			<div className="notes">
				<div className="notes-no-found">
					<h1>{text.notesNotFound}</h1>
				</div>
				<button
					className="create-new-btn"
					onClick={() => toggleEditor()}
				>
					<img src="./public/images/plus.png" alt="add_note" />
				</button>
			</div>
		);
	}
};