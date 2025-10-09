import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useLayoutEffect,
	useState,
} from "react";

const themes = ["light", "dark"] as const;
type Theme = (typeof themes)[number];

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
	isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const getInitialTheme = (): Theme => {
		if (typeof window === "undefined") return "light";
		const stored = localStorage.getItem("theme");
		if (stored === "light" || stored === "dark") return stored;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useLayoutEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", theme === "dark");
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = useCallback(
		() => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
		[],
	);

	const isDark = theme === "dark";

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
};
