import { useState } from "react";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import TickIcon from "./TickIcon";

const ListItem = ({ task, getData }) => {
	const [ShowModal, setShowModal] = useState(false);

	const deleteItem = async () => {
		try {
			const res = await fetch(`http://localhost:8000/todos/${task.id}`, {
				method: "DELETE",
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
		<li className="list-item">
			<TickIcon />
			<div className="info-container">
				<p className="task-tittle">{task.tittle}</p>
				<ProgressBar />
			</div>

			<div className="btn-container">
				<button className="edit__task" onClick={() => setShowModal(true)}>
					EDITAR
				</button>
				<button className="delete_task" onClick={deleteItem}>
					DELETAR
				</button>
			</div>
			{ShowModal && (
				<Modal
					mode={"edit"}
					setShowModal={setShowModal}
					task={task}
					getData={getData}
				/>
			)}
		</li>
	);
};

export default ListItem;
