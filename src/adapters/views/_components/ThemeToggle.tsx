import { useTheme } from "../../hooks/ThemeContext";

export function ThemeToggle() {
	const { toggleTheme, isDark } = useTheme();

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				role="switch"
				aria-checked={isDark}
				onClick={toggleTheme}
				className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? "bg-accent" : "bg-red-300"} dark:bg-slate-500`}
			>
				<span
					className={`inline-block h-4 w-4 transform rounded-full bg-bg transition-transform ${isDark ? "translate-x-6" : "translate-x-1"} dark:bg-brand`}
				/>
			</button>
		</div>
	);
}

export default ThemeToggle;
