const PORT = process.env.PORT || 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const bp = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

// ROUTES
app.get("/todos/:userEmail", async (req, res) => {
	const { userEmail } = req.params;

	try {
		const todos = await pool.query(
			`SELECT * FROM todos WHERE user_email = '${userEmail}'`
		);
		res.status(200).json(todos.rows);
	} catch (err) {
		console.log(err);
	}
});

app.post("/todos", async (req, res) => {
	const { user_email, title, progress, date } = req.body;

	console.log(user_email, title, progress, date);
	const id = uuidv4();

	try {
		const newToDo = await pool.query(
			`INSERT INTO todos (id, user_email, tittle, progress, date) VALUES ('${id}', '${user_email}', '${title}', '${progress}', '${date}') `
		);
		res.json(newToDo);
	} catch (err) {
		console.log(err);
	}
});

app.put("/todos/:id", async (req, res) => {
	const { id } = req.params;
	const { user_email, title, progress, date } = req.body;
	try {
		const editToDo = await pool.query(
			`UPDATE todos SET user_email = '${user_email}', tittle = '${title}', progress = ${progress}, date = '${date}' WHERE id = '${id}'`
		);
		res.json(editToDo);
	} catch (err) {
		console.log(err);
	}
});

app.delete("/todos/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const deleteTodDo = await pool.query(
			`DELETE FROM todos WHERE id = '${id}'`
		);
		res.json(deleteTodDo);
	} catch (err) {
		console.log(err);
	}
});

app.post("/cadastrar", async (req, res) => {
	const { email, password } = req.body;
	const salt = bp.genSaltSync(10);
	const hashedPassword = bp.hashSync(password, salt);
	try {
		const cadastrar = await pool.query(
			`INSERT INTO users (email, hashed_passwd) VALUES ('${email}', '${hashedPassword}')`
		);
		const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

		res.json({ email, token });
	} catch (err) {
		console.log(err);
		if (err) {
			res.json({ detail: err.detail });
		}
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const users = await pool.query(
			`SELECT * FROM users WHERE email = '${email}'`
		);

		if (!users.rows.length) return json("Usuário não existe!");

		const sucess = await bp.compare(password, users.rows[0].hashed_passwd);
		const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
		if (sucess) {
			res.json({ email: users.rows[0].email, token });
		} else {
			res.json({ detail: "Não foi possível fazer o login!" });
		}
	} catch (err) {
		console.log(err);
	}
});

// APP
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
