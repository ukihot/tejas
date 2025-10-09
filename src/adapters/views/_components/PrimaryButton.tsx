import type React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
};

export const PrimaryButton = ({ children, className = "", ...rest }: Props) => {
	return (
		<button
			className={`mt-4 w-full rounded-md bg-accent py-3 font-sans transition-colors ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
};

export default PrimaryButton;
