import { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { shallow } from 'zustand/shallow';

import useStore, { selector } from '../store/useStore';
import { ChatPromptNodeDataType } from './types/NodeTypes';
import RunnableToolbarTemplate from './templates/RunnableToolbarTemplate';
import { Disclosure } from '@headlessui/react';
import { SignalIcon, ClipboardIcon, ArrowsPointingOutIcon } from '@heroicons/react/20/solid';
import { conditionalClassNames } from '../utils/classNames';
import ShowPromptSwitch from '../components/ShowPromptSwitch';
import LargeTextArea from '../components/FullScreenEditor';

const ChatPrompt: FC<NodeProps<ChatPromptNodeDataType>> = (props) => {
	const { data, selected, id } = props;

	const { updateNode, openAIApiKey } = useStore(selector, shallow);
	const [showPrompt, setshowPrompt] = useState(true);
	const [showFullScreen, setShowFullScreen] = useState(false);

	// TODO: Fullscreen button to edit prompts with a larger display
	return (
		<div
			style={{
				// height: showPrompt ? '20rem' : '5rem',
				width: '35rem',
			}}
			className=""
		>
			<div
				className={`h-full bg-slate-100 shadow-lg border-2  ${
					selected ? 'border-indigo-600' : 'border-slate-300'
				} flex flex-col `}
			>
				{RunnableToolbarTemplate(data, selected, updateNode, id, openAIApiKey)}
				{/* how to spread  */}

				<div
					className={`py-1 flex justify-between items-center pr-4 border-b-1 border-slate-400 text-xl bg-indigo-300`}
				>
					<div className="flex gap-2 items-center py-2">
						<h1 className="text-start pl-4">
							<span className="font-semibold">Chat Call:</span> {data.name}
						</h1>
						{data.isLoading && (
							<svg
								className="animate-spin -ml-1 mr-3 h-7 w-7 text-black"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						)}
					</div>
					{ShowPromptSwitch(showPrompt, setshowPrompt)}
				</div>

				<LargeTextArea
					heading="Chat Prompt"
					showFullScreen={showFullScreen}
					setShowFullScreen={setShowFullScreen}
				>
					<Content
						data={data}
						showPrompt={showPrompt}
						showFullScreen={showFullScreen}
						setShowFullScreen={setShowFullScreen}
					/>
				</LargeTextArea>
				{!showFullScreen && (
					<Content
						data={data}
						showPrompt={showPrompt}
						showFullScreen={showFullScreen}
						setShowFullScreen={setShowFullScreen}
					/>
				)}
			</div>
			<Handle
				type="target"
				position={Position.Left}
				id="chat-prompt-messages"
				style={{
					left: '-4.5rem',
				}}
				className="top-1/2 h-7 bg-slate-50 flex gap-1 border-1 border-slate-700"
			>
				<div className=" bg-purple-300 w-5 h-full pointer-events-none"></div>
				<p className="text-xl font-bold self-center -z-10 pointer-events-none p-1">Chat</p>
			</Handle>

			<Handle type="source" position={Position.Right} id="chat-prompt" className="w-4 h-4" />
		</div>
	);
};

const Content: FC<{
	data: ChatPromptNodeDataType;
	showPrompt: boolean;
	showFullScreen: boolean;
	setShowFullScreen: (show: boolean) => void;
}> = ({ data, showPrompt, showFullScreen, setShowFullScreen }) => {
	return (
		<>
			<div className="h-14 flex justify-between items-center px-4">
				<p className="flex gap-1 items-center text-xl">
					<SignalIcon
						className={conditionalClassNames(
							data.response.length > 0 ? 'text-green-500' : 'text-slate-400',
							' -ml-1 mr-1 h-7 w-7 flex-shrink-0',
						)}
						aria-hidden="true"
					/>
					<span
						className={conditionalClassNames(
							data.response.length === 0 && 'text-slate-400',
						)}
					>
						Current results:
					</span>
				</p>

				<ArrowsPointingOutIcon
					className={'text-slate-500 hover:text-slate-800  h-6 w-6 flex-shrink-0'}
					aria-hidden="true"
					onClick={() => {
						setShowFullScreen(!showFullScreen);
					}}
				/>
			</div>
			{showPrompt && (
				<div
					className="px-3 pb-3 bg-slate-50
				 rounded-b-lg flex flex-col justify-between gap-4 items-end"
				>
					<p>{data.response}</p>
					<ClipboardIcon
						className={conditionalClassNames(
							' -ml-1 mr-1 h-7 w-7 flex-shrink-0 cursor-pointer text-slate-500 hover:text-slate-900 active:scale-50',
						)}
						aria-hidden="true"
						onClick={() => {
							navigator.clipboard.writeText(data.response);
						}}
					/>
				</div>
			)}
		</>
	);
};

export default memo(ChatPrompt);