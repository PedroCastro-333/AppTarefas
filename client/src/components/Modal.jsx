import { useState } from "react";
import {useCookies} from 'react-cookie'

const Modal = ({ mode, setShowModal, getData, task }) => {
	const editMode = mode === "edit" ? true : false;
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const [data, setData] = useState({
		user_email: editMode ? task.user_email : cookie.Email,
		title: editMode ? task.tittle : null,
		progress: editMode ? task.progress : 50,
		Date: editMode ? task.Date : new Date().now,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		setData((data) => ({
			...data,
			[name]: value,
		}));
	};

	const postData = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("http://localhost:8000/todos", {
				method: "POST",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify(data),
			});
			if (res.status === 200) {
				setShowModal(false);
				getData();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const editData = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`http://localhost:8000/todos/${task.id}`, {
				method: "PUT",
				headers: { "Content-type": "application/json" },
				body: JSON.stringify(data),
			});
			if (res.status === 200) {
				setShowModal(false);
				getData();
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="overlay">
			<div className="modal">
				<div className="form-title-container">
					<h3>Vamos {editMode ? "editar" : "criar"} uma tarefa!</h3>
					<button onClick={() => setShowModal(false)}>X</button>
				</div>

				<form>
					<input
						required
						maxLength={30}
						placeholder="Nome da tarefa"
						name="title"
						value={data.title}
						onChange={handleChange}
					/>
					<br />
					<label for="range">
						Arraste para selecionar seu atual progresso.
					</label>
					<input
						type="range"
						id="range"
						min="0"
						max="100"
						name="progress"
						value={data.progress}
						onChange={handleChange}
					/>
					<input
						className={mode}
						type="submit"
						onClick={editMode ? editData : postData}
					/>
				</form>
			</div>
		</div>
	);
};

export default Modal;
