import type React from "react";

type TextInputProps = {
	id?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	type?: React.HTMLInputTypeAttribute;
	required?: boolean;
	className?: string;
};

export const TextInput = ({
	id,
	value,
	onChange,
	placeholder,
	type = "text",
	required = false,
	className = "",
}: TextInputProps) => {
	return (
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			className={`mb-4 w-full rounded-md border border-steel bg-white px-4 py-3 text-steel-dark transition-colors focus:border-accent focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:text-white ${className}
      `}
		/>
	);
};

export default TextInput;
