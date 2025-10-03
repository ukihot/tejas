import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { type FormEvent, useId, useState } from "react";

export default function Home() {
	const idGreetInput = useId();

	const [greetMsg, setGreetMsg] = useState<string>("");
	const [name, setName] = useState<string>("");

	const [dbPath, setDbPath] = useState<string>("");
	const [dbMsg, setDbMsg] = useState<string>("");

	const [migrationMsg, setMigrationMsg] = useState<string>("");

	// --------------------
	// 非同期コマンド呼び出し
	// --------------------
	async function greet(): Promise<void> {
		console.log("[greet] Invoking greet command with name:", name);
		try {
			const msg = await invoke<string>("greet", { name });
			console.log("[greet] Result:", msg);
			setGreetMsg(msg);
		} catch (err) {
			console.error("[greet] Error:", err);
			setGreetMsg(`Error: ${(err as Error).message}`);
		}
	}

	async function setDatabasePath(): Promise<void> {
		console.log("[setDatabasePath] dbPath:", dbPath);
		if (!dbPath) {
			setDbMsg("Please select a database path first.");
			return;
		}

		try {
			const msg = await invoke<string>("set_db_path", { path: dbPath });
			console.log("[setDatabasePath] Result:", msg);
			setDbMsg(msg);
		} catch (err) {
			console.error("[setDatabasePath] Error:", err);
			setDbMsg(`Error: ${(err as Error).message}`);
		}
	}

	async function runMigration(): Promise<void> {
		console.log("[runMigration] Starting migration");
		try {
			const msg = await invoke<string>("run_migration");
			console.log("[runMigration] Result:", msg);
			setMigrationMsg(msg);
		} catch (err) {
			console.error("[runMigration] Error:", err);
			setMigrationMsg(`Error: ${(err as Error).message}`);
		}
	}

	// --------------------
	// ファイル選択ダイアログ（既存DB）
	// --------------------
	const handleOpenDialog = async () => {
		console.log("[handleOpenDialog] Opening file dialog for existing DB");
		try {
			const selected = await open({
				multiple: false,
				filters: [{ name: "SQLite Database", extensions: ["db", "sqlite"] }],
			});

			console.log("[handleOpenDialog] Selected:", selected);

			if (selected) {
				setDbPath(selected);
				setDbMsg(`Selected: ${selected}`);
			} else {
				setDbMsg("No file selected.");
			}
		} catch (err) {
			console.error("[handleOpenDialog] Error:", err);
			setDbMsg(`Error: ${(err as Error).message}`);
		}
	};

	// --------------------
	// フォルダ選択＋新規DB作成
	// --------------------
	const handleCreateDb = async () => {
		console.log("[handleCreateDb] Opening folder dialog to create new DB");
		try {
			const folderPath = await open({
				directory: true,
				multiple: false,
			});

			console.log("[handleCreateDb] Selected folder:", folderPath);

			if (!folderPath) {
				setDbMsg("No folder selected.");
				return;
			}

			// Rust側で database.db を作成
			const msg = await invoke<string>("create_db", {
				folderPath,
			});
			console.log("[handleCreateDb] create_db result:", msg);
			setDbMsg(msg);

			// 作成した DB を自動でセット
			const newDbPath = `${folderPath}/database.db`;
			console.log("[handleCreateDb] New DB path set to:", newDbPath);
			setDbPath(newDbPath);
		} catch (err) {
			console.error("[handleCreateDb] Error:", err);
			setDbMsg(`Error: ${(err as Error).message}`);
		}
	};

	// --------------------
	// 汎用フォーム submit
	// --------------------
	async function handleSubmit(
		event: FormEvent<HTMLFormElement>,
		callback: () => Promise<void>,
	) {
		event.preventDefault();
		console.log("[handleSubmit] Form submitted");
		await callback();
	}

	// --------------------
	// JSX
	// --------------------
	return (
		<main className="container">
			<h1>Welcome to Tauri + React + TypeScript</h1>

			{/* Greetフォーム */}
			<form className="row" onSubmit={(e) => void handleSubmit(e, greet)}>
				<input
					id={idGreetInput}
					value={name}
					onChange={(e) => setName(e.currentTarget.value)}
					placeholder="Enter a name..."
				/>
				<button type="submit">Greet</button>
			</form>
			<p className={greetMsg.startsWith("Error:") ? "error" : ""}>{greetMsg}</p>

			<hr />

			{/* DB操作 */}
			<div className="row">
				<button type="button" onClick={handleOpenDialog}>
					Set DB Path
				</button>
				<button type="button" onClick={handleCreateDb}>
					Create New DB
				</button>
				<p>{dbPath ? `Selected Path: ${dbPath}` : dbMsg}</p>
			</div>

			<form
				className="row"
				onSubmit={(e) => void handleSubmit(e, setDatabasePath)}
			>
				<button type="submit">Confirm DB Path</button>
			</form>
			<p className={dbMsg.startsWith("Error:") ? "error" : ""}>{dbMsg}</p>

			<hr />

			{/* マイグレーション実行 */}
			<button type="button" onClick={runMigration}>
				Run Migration
			</button>
			<p className={migrationMsg.startsWith("Error:") ? "error" : ""}>
				{migrationMsg}
			</p>
		</main>
	);
}
