import type { PropsWithChildren } from "react";

export function Card({
	children,
	className = "",
}: PropsWithChildren<{ className?: string }>) {
	return (
		<div className={`w-full max-w-md rounded-md p-8 shadow-lg ${className}`}>
			{children}
		</div>
	);
}

export default Card;
