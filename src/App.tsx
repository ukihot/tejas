import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./adapters/hooks/AuthContext";
import { ThemeProvider } from "./adapters/hooks/ThemeContext";
import { RequireAuth } from "./adapters/views/_components/RequireAuth";
import Home from "./adapters/views/pages/Home";
import SignIn from "./adapters/views/pages/SignIn";

function AppRoutes() {
	const { authenticated } = useAuth();

	return (
		<Routes>
			{/* 認証保護ルート */}
			<Route element={<RequireAuth isAuthenticated={authenticated} />}>
				<Route path="/" element={<Home />} />
				{/* 追加の保護ルートもここに */}
			</Route>

			{/* 非保護ルート */}
			<Route path="/signin" element={<SignIn />} />
		</Routes>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<ThemeProvider>
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</ThemeProvider>
		</AuthProvider>
	);
}
