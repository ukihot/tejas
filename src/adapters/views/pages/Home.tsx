import { open } from "@tauri-apps/plugin-dialog";
import { type FormEvent, useId, useState } from "react";
import { AppInteractor } from "../../../applications/interactors/AppInteractor";
import { TauriDatabaseRepository } from "../../../infrastructures/dao/TauriDatabaseRepository";
import { AppController } from "../../controllers/AppController";
import { AppPresenter } from "../../presenters/AppPresenter";

export default function Home() {
	const idUsernameInput = useId();
	const idPasswordInput = useId();
	const idDisplayNameInput = useId();

	// ----------------------
	// State
	// ----------------------
	const [dbPath, setDbPath] = useState<string>("");
	const [dbMsg, setDbMsg] = useState<string>("");
	const [tableMsg, setTableMsg] = useState<string>("");

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [displayName, setDisplayName] = useState<string>("");
	const [userMsg, setUserMsg] = useState<string>("");

	const [dbConfirmed, setDbConfirmed] = useState<boolean>(false);

	// ----------------------
	// Setup Adapter
	// ----------------------
	const repository = new TauriDatabaseRepository();
	const presenter = new AppPresenter(
		setDbMsg,
		setTableMsg,
		setUserMsg,
		() => {},
	);
	const interactor = new AppInteractor(repository, presenter);
	const controller = new AppController(interactor);

	// ----------------------
	// Handlers
	// ----------------------
	async function handleSubmit(
		event: FormEvent<HTMLFormElement>,
		callback: () => Promise<void>,
	) {
		event.preventDefault();
		await callback();
	}

	const handleOpenDbDialog = async () => {
		const selected = await open({
			multiple: false,
			filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }],
		});
		if (selected) {
			setDbPath(selected as string);
			setDbConfirmed(false);
		}
	};

	const confirmDbPath = async () => {
		await controller.setDatabasePath(dbPath);
		setDbConfirmed(true);
	};

	const createTableHandler = async () => {
		await controller.createTable();
	};

	const createUserHandler = async () => {
		await controller.createUser(username, password, displayName);
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

			{/* DB Path Section */}
			<section style={{ marginBottom: "2rem" }}>
				<h2>Database Setup</h2>
				<div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
					<button type="button" onClick={handleOpenDbDialog}>
						Select Existing DB
					</button>
					<button type="button" onClick={handleOpenDbDialog}>
						Create New DB
					</button>
				</div>
				<p>{dbPath ? `Selected: ${dbPath}` : dbMsg}</p>
				{dbPath && (
					<form onSubmit={(e) => void handleSubmit(e, confirmDbPath)}>
						<button type="submit">Confirm Database</button>
					</form>
				)}
			</section>

			{/* Create Table Section */}
			<section style={{ marginBottom: "2rem" }}>
				<h2>Create Users Table</h2>
				<p>This will create the users table in the selected database.</p>
				{dbConfirmed && (
					<form onSubmit={(e) => void handleSubmit(e, createTableHandler)}>
						<button type="submit">Create Users Table</button>
					</form>
				)}
				{!dbConfirmed && <p>Please confirm database first.</p>}
				<p>{tableMsg}</p>
			</section>

			{/* Create User Section */}
			<section style={{ marginBottom: "2rem" }}>
				<h2>Create User</h2>
				<form onSubmit={(e) => void handleSubmit(e, createUserHandler)}>
					<input
						id={idUsernameInput}
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
						placeholder="Username"
						disabled={!dbConfirmed}
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<input
						id={idPasswordInput}
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
						placeholder="Password"
						type="password"
						disabled={!dbConfirmed}
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<input
						id={idDisplayNameInput}
						value={displayName}
						onChange={(e) => setDisplayName(e.currentTarget.value)}
						placeholder="Display Name (optional)"
						disabled={!dbConfirmed}
						style={{ display: "block", marginBottom: "0.5rem", width: "100%" }}
					/>
					<button type="submit" disabled={!dbConfirmed}>
						Create User
					</button>
				</form>
				<p className={userMsg.startsWith("Error:") ? "error" : ""}>{userMsg}</p>
			</section>
		</main>
	);
}
