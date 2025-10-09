import { type FormEvent, useId, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserInteractor } from "../../../applications/interactors/UserInteractor";
import { UserDAO } from "../../../infrastructures/dao/UserDAO";
import { UserController } from "../../controllers/UserController";
import { useAuth } from "../../hooks/AuthContext";
import { SignInPresenter } from "../../presenters/SignInPresenter";
import { Card } from "../_components/Card";
import { Logo } from "../_components/Logo";
import { Message } from "../_components/Message";
import { PrimaryButton } from "../_components/PrimaryButton";
import { TextInput } from "../_components/TextInput";
import ThemeToggle from "../_components/ThemeToggle";

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
		() => new SignInPresenter(setLoginMsg, setAuthenticated),
		[setAuthenticated],
	);

	const controller = useMemo(
		() =>
			new UserController(
				new UserInteractor(new UserDAO(), undefined, presenter),
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
		} catch (err) {
			setAuthenticated(false);
			setLoginMsg(`Error: ${(err as Error).message}`);
		}
	};

	// ----------------------
	// UI
	// ----------------------
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-white p-8 transition-colors duration-300 dark:bg-brand">
			{/* ロゴ */}
			<Logo />

			{/* テーマ切替 */}
			<div className="mb-6">
				<ThemeToggle />
			</div>

			{/* フォーム */}
			<form className="w-full max-w-md" onSubmit={handleSubmit}>
				<Card>
					<TextInput
						id={idUsername}
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
						placeholder="Username"
						required
					/>
					<TextInput
						id={idPassword}
						type="password"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
						placeholder="Password"
						required
					/>
					<TextInput
						id={idDomain}
						value={domain}
						onChange={(e) => setDomain(e.currentTarget.value)}
						placeholder="Domain"
					/>
					<TextInput
						id={idDc}
						value={domainController}
						onChange={(e) => setDomainController(e.currentTarget.value)}
						placeholder="Domain Controller"
					/>
					<PrimaryButton type="submit">Sign In</PrimaryButton>
				</Card>
			</form>

			{/* メッセージ */}
			{loginMsg && <Message text={loginMsg} />}
		</main>
	);
}
