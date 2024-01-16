import { useMutation } from "@tanstack/react-query";

import propTypes from "prop-types";

import { deleteNote } from "../api/api_App";
import { LoadingPage } from "../components/LoadingPage";

export const Note = ({ note, toggleEditor, refetchNotes, langPack }) => {
	Note.propTypes = {
		note: propTypes.object.isRequired,
		toggleEditor: propTypes.func.isRequired,
		refetchNotes: propTypes.func.isRequired,
		langPack: propTypes.object.isRequired,
	};
	const text = langPack["note"];

	const deleteNoteMutation = useMutation({
		mutationFn: () => deleteNote(note.key),
		onSuccess: () => {
			refetchNotes();
		},
		onError: (err) => console.log(err),
	});

	const handleEditClick = () => {
		toggleEditor(note.title, note.content, note.key);
	};

	const handleDeleteClick = (e) => {
		e.stopPropagation();
		deleteNoteMutation.mutate();
	};

	if (deleteNoteMutation.status === "pending") {
		return <LoadingPage info={text.deleting} />;
	}

	return (
		<div className="note" key={note.key} onClick={handleEditClick}>
			<p className="edit-date">
				{text.edited + " " + note.date}
			</p>

			<div className="title-container">
				<h1 className="header">{text.title}</h1>
				<p className="content">{note.title}</p>
			</div>

			<button
				className="delete-btn"
				onClick={handleDeleteClick}
			>
				<img
					src="./public/images/delete.png"
					alt="note-btn-delete"
				/>
			</button>
		</div>
	);
};
