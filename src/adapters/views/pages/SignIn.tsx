import { type FormEvent, useId, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { AppInteractor } from "../../../applications/interactors/AppInteractor";
import { TauriDatabaseRepository } from "../../../infrastructures/dao/TauriDatabaseRepository";
import { AppController } from "../../controllers/AppController";
import { useAuth } from "../../hooks/AuthContext";
import { AppPresenter } from "../../presenters/AppPresenter";

export default function SignIn() {
	// ----------------------
	// Context
	// ----------------------
	const { authenticated, setAuthenticated } = useAuth();

	// ----------------------
	// Form State
	// ----------------------
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [domain, setDomain] = useState("hoge.private");
	const [domainController, setDomainController] = useState("192.168.100.1:389");
	const [loginMsg, setLoginMsg] = useState("");

	// ----------------------
	// Unique IDs
	// ----------------------
	const idUsername = useId();
	const idPassword = useId();
	const idDomain = useId();
	const idDc = useId();

	// ----------------------
	// Controller Setup
	// ----------------------
	const presenter = useMemo(
		() =>
			new AppPresenter(
				() => {}, // DBメッセージ不要
				() => {}, // Migrationメッセージ不要
				setLoginMsg, // AD審査メッセージ
				setAuthenticated, // Context の認証状態更新
			),
		[setAuthenticated],
	);

	const controller = useMemo(
		() =>
			new AppController(
				new AppInteractor(new TauriDatabaseRepository(), presenter),
			),
		[presenter],
	);

	// ADログイン済みなら即リダイレクト
	if (authenticated) return <Navigate to="/" replace />;

	// ----------------------
	// Submit Handler
	// ----------------------
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			await controller.checkAd(username, password, domain, domainController);
			// Presenter側で setAuthenticated が呼ばれる
		} catch (err) {
			setAuthenticated(false);
			setLoginMsg(`Error: ${(err as Error).message}`);
		}
	};

	// ----------------------
	// UI
	// ----------------------
	return (
		<main
			style={{
				maxWidth: "400px",
				margin: "2rem auto",
				fontFamily: "sans-serif",
			}}
		>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				<input
					id={idUsername}
					value={username}
					onChange={(e) => setUsername(e.currentTarget.value)}
					placeholder="Username"
					required
					style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
				/>
				<input
					id={idPassword}
					type="password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
					placeholder="Password"
					required
					style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
				/>
				<input
					id={idDomain}
					value={domain}
					onChange={(e) => setDomain(e.currentTarget.value)}
					placeholder="Domain"
					style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
				/>
				<input
					id={idDc}
					value={domainController}
					onChange={(e) => setDomainController(e.currentTarget.value)}
					placeholder="Domain Controller"
					style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
				/>
				<button type="submit" style={{ display: "block", width: "100%" }}>
					Sign In
				</button>
			</form>

			{loginMsg && (
				<p style={{ color: loginMsg.startsWith("Error:") ? "red" : "green" }}>
					{loginMsg}
				</p>
			)}
		</main>
	);
}
