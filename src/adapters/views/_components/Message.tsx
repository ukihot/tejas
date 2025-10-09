type Props = {
	text: string;
};

export const Message = ({ text }: Props) => {
	const colorClass = text.startsWith("Error:")
		? "text-red-500"
		: "text-green-500";

	return <p className={`mt-4 text-sm hover:underline ${colorClass}`}>{text}</p>;
};

export default Message;
