import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';

import { Message } from './types';

interface Props {
	onSend: (message: Message) => void;
}

export const ChatInput: FC<Props> = ({ onSend }) => {
	const [content, setContent] = useState<string>();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		if (value.length > 4000) {
			alert('Message limit is 4000 characters');
			return;
		}

		setContent(value);
	};

	const handleSend = () => {
		if (!content) {
			alert('Please enter a message');
			return;
		}
		onSend({ role: 'user', content });
		setContent('');
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	useEffect(() => {
		if (textareaRef && textareaRef.current) {
			textareaRef.current.style.height = 'inherit';
			textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
		}
	}, [content]);

	return (
		<div className="relative h-full">
			<textarea
				ref={textareaRef}
				className="h-full w-full rounded-lg border-2 border-neutral-200 py-1 pl-4 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-300"
				style={{ resize: 'none' }}
				placeholder="Type a message..."
				value={content}
				rows={1}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
};
