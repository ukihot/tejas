import { type FormEvent, useId, useState } from "react";
import { UserInteractor } from "../../../applications/interactors/UserInteractor";
import { UserDAO } from "../../../infrastructures/dao/UserDAO";
import { UserController } from "../../controllers/UserController";
import { HomePresenter } from "../../presenters/HomePresenter";
import { Card } from "../_components/Card";
import { Logo } from "../_components/Logo";
import { Message } from "../_components/Message";
import { PrimaryButton } from "../_components/PrimaryButton";
import { TextInput } from "../_components/TextInput";

export default function Home() {
	const idUsernameInput = useId();
	const idPasswordInput = useId();

	// ----------------------
	// State
	// ----------------------
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [userMsg, setUserMsg] = useState<string>("");

	// ----------------------
	// Setup Adapter
	// ----------------------
	const repository = new UserDAO();
	const presenter = new HomePresenter(setUserMsg, () => {});
	// Home用出力ポートのみを渡す
	const interactor = new UserInteractor(repository, presenter);
	const controller = new UserController(interactor);

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

	const authenticateHandler = async () => {
		try {
			await controller.authenticateUser(username, password);
		} catch (err) {
			setUserMsg(`Error: ${(err as Error).message}`);
		}
	};

	// ----------------------
	// UI
	// ----------------------
	return (
		<main className="mx-auto my-8 max-w-[600px] p-4 font-sans">
			<Logo />

			<h1 className="mb-2 font-semibold text-lg">Tauri + React + TypeScript</h1>
			<hr className="mb-6" />

			{/* Authenticate User Section */}
			<section className="mb-8">
				<h2 className="mb-4 font-medium text-base">Authenticate User</h2>

				<form onSubmit={(e) => void handleSubmit(e, authenticateHandler)}>
					<Card>
						<TextInput
							id={idUsernameInput}
							value={username}
							onChange={(e) => setUsername(e.currentTarget.value)}
							placeholder="Username"
						/>
						<TextInput
							id={idPasswordInput}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
							placeholder="Password"
						/>
						<PrimaryButton type="submit">Authenticate</PrimaryButton>
					</Card>
				</form>

				{userMsg && <Message text={userMsg} />}
			</section>
		</main>
	);
}
