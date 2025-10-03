import { Navigate, Outlet } from "react-router-dom";

type Props = {
	isAuthenticated: boolean | null;
};

export const RequireAuth = ({ isAuthenticated }: Props) => {
	if (isAuthenticated === null) {
		// 認証未確認なら Loading 表示
		return <div>Loading...</div>;
	}

	// 認証済みなら Outlet（子ルート）を表示、未認証なら SignIn へ
	return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};
