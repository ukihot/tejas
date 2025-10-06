import { type FormEvent, useId, useState } from "react";
import { UserInteractor } from "../../../applications/interactors/UserInteractor";
import { UserPresenter } from "../../presenters/UserPresenter";
import { UserDAO } from "../../../infrastructures/dao/UserDAO";
import { UserController } from "../../controllers/UserController";

export default function Home() {
	const idUsernameInput = useId();
	const idPasswordInput = useId();
	const idDisplayNameInput = useId();

	// ----------------------
	// State
	// ----------------------
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	// displayName removed — not used in simplified Home UI
	const [userMsg, setUserMsg] = useState<string>("");
	const [domain, setDomain] = useState<string>("hoge.private");
	const [domainController, setDomainController] = useState<string>("192.168.100.1:389");

	// ----------------------
	// Setup Adapter
	// ----------------------
	const repository = new UserDAO();
	const presenter = new UserPresenter(setUserMsg, () => {}, setUserMsg, () => {});
	const interactor = new UserInteractor(repository, presenter);
	const controller = new UserController(interactor);

	// ----------------------
	// Handlers
	// ----------------------
	async function handleSubmit(event: FormEvent<HTMLFormElement>, callback: () => Promise<void>) {
		event.preventDefault();
		await callback();
	}

	const authenticateHandler = async () => {
		try {
			await controller.authenticateUser(username, password);
		} catch (err) {
			setUserMsg(`Error: ${(err as Error).message}`);
		}
	};

	const checkAdHandler = async () => {
		try {
			await controller.checkAd(username, password, domain, domainController);
		} catch (err) {
			setUserMsg(`Error: ${(err as Error).message}`);
		}
	};

	// ----------------------
	// UI
	// ----------------------
	return (
		<main
			style={{
				maxWidth: "600px",
				margin: "2rem auto",
				fontFamily: "sans-serif",
			}}
		>
			<h1>Tauri + React + TypeScript</h1>

			<hr />

			{/* Authenticate User Section */}
			<section style={{ marginBottom: "2rem" }}>
				<h2>Authenticate User</h2>
				<form onSubmit={(e) => void handleSubmit(e, authenticateHandler)}>
					<input
						id={idUsernameInput}
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
						placeholder="Username"
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<input
						id={idPasswordInput}
						type="password"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
						placeholder="Password"
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<button type="submit" style={{ display: "block", width: "100%" }}>
						Authenticate
					</button>
				</form>
				<p className={userMsg.startsWith("Error:") ? "error" : ""}>{userMsg}</p>
			</section>

			{/* AD Check Section */}
			<section style={{ marginBottom: "2rem" }}>
				<h2>AD Check</h2>
				<form onSubmit={(e) => void handleSubmit(e, checkAdHandler)}>
					<input
						id={idUsernameInput + "-ad"}
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
						placeholder="Username"
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<input
						id={idPasswordInput + "-ad"}
						type="password"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
						placeholder="Password"
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<input
						id={idDisplayNameInput + "-domain"}
						value={domain}
						onChange={(e) => setDomain(e.currentTarget.value)}
						placeholder="Domain"
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<input
						id={idDisplayNameInput + "-dc"}
						value={domainController}
						onChange={(e) => setDomainController(e.currentTarget.value)}
						placeholder="Domain Controller"
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<button type="submit" style={{ display: "block", width: "100%" }}>
						Check AD
					</button>
				</form>
				<p className={userMsg.startsWith("Error:") ? "error" : ""}>{userMsg}</p>
			</section>
		</main>
	);
}
