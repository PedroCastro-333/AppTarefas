import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setUserEmail] = useState(null);
	const [password, setPassword] = useState();
	const [confirmPassword, setConfirmPassword] = useState(null);
	const [error, setError] = useState(null);
	const [cookie, setCookie, removeCookie] = useCookies(null);

	const viewLoginOpt = (status) => {
		setIsLogin(status);
	};

	const handleSubmit = async (e, endpoint) => {
		e.preventDefault();
		if (!isLogin && password !== confirmPassword) {
			setError("As senhas não conferem.");
			return;
		}

		const response = await fetch(`http://localhost:8000/${endpoint}`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json();
		if (data.detail) {
			setError(data.detail);
		} else {
			setCookie("Email", data.email);
			setCookie("AuthToken", data.token);
			window.location.reload();
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-container-box">
				<form>
					<h2>{isLogin ? "Faça seu login." : "Faça seu cadastro."}</h2>
					<input
						type="email"
						placeholder="E-mail"
						onChange={(e) => setUserEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Senha"
						onChange={(e) => setPassword(e.target.value)}
					/>
					{!isLogin && (
						<input
							type="password"
							placeholder="Confirme sua senha"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					)}
					<input
						type="submit"
						className="create"
						value="Entrar"
						onClick={(e) => handleSubmit(e, isLogin ? "login" : "cadastrar")}
					/>
					{error && <p>{error}</p>}
				</form>

				<div className="auth-options">
					<button
						style={{
							backgroundColor: isLogin
								? "rgb(255,255,255)"
								: "rgb(188,188,188)",
						}}
						onClick={() => viewLoginOpt(false)}
					>
						Cadastre-se
					</button>
					<button
						style={{
							backgroundColor: !isLogin
								? "rgb(255,255,255)"
								: "rgb(188,188,188)",
						}}
						onClick={() => viewLoginOpt(true)}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
};

export default Auth;
