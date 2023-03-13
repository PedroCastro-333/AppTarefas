import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import { useCookies } from "react-cookie";

const App = () => {
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const userEmail = cookie.Email;
	const authToken = cookie.AuthToken;
	const [tarefas, setTarefas] = useState(null);

	const getData = async () => {
		try {
			const res = await fetch(`http://localhost:8000/todos/${userEmail}`);
			const json = await res.json();
			setTarefas(json);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (authToken) {
			getData();
		}
	}, []);

	//ORGANIZAR POR DATA
	const sortedTarefas = tarefas?.sort(
		(a, b) => new Date(a.date) - new Date(b.date)
	);

	return (
		<div className="app">
			{!authToken && <Auth />}
			{authToken && (
				<>
					<ListHeader listName={"Tarefas do feriado"} getData={getData} />
					<p className="user-email">Bem vindo de volta {userEmail}</p>
					{sortedTarefas?.map((task) => (
						<ListItem key={task.id} task={task} getData={getData} />
					))}
				</>
			)}
		</div>
	);
};

export default App;
