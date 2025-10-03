import { createContext, type ReactNode, useContext, useState } from "react";

type AuthContextType = {
	authenticated: boolean | null;
	setAuthenticated: (auth: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authenticated, setAuthenticated] = useState<boolean | null>(false);

	return (
		<AuthContext.Provider value={{ authenticated, setAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
