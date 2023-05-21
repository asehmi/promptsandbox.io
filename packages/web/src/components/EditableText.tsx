import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import useStore, { RFState, selector } from '../store/useStore';
import { RFStateSecret } from '../store/useStoreSecret';
import isWorkflowOwnedByUser from '../utils/isWorkflowOwnedByUser';
import { useQueryParams } from '../utils/useQueryParams';

const EditableText = ({
	currentWorkflow,
	setCurrentWorkflow,
	setWorkflows,
	session,
}: {
	currentWorkflow: RFState['currentWorkflow'];
	setCurrentWorkflow: RFState['setCurrentWorkflow'];
	setWorkflows: RFState['setWorkflows'];
	session: RFStateSecret['session'];
}) => {
	const { workflows, setUiErrorMessage } = useStore(selector, shallow);
	const [isEditing, setIsEditing] = useState(false);
	const [acceptableText, setAcceptableText] = useState(
		currentWorkflow ? currentWorkflow.name : '',
	);
	const params = useQueryParams();

	const handleTextClick = () => {
		if (!isWorkflowOwnedByUser(session, params)) {
			return;
		}
		if (!isEditing) {
			setIsEditing(true);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length >= 5 && e.target.value.length <= 30) {
			setAcceptableText(e.target.value);
		}

		if (currentWorkflow) {
			setCurrentWorkflow({
				...currentWorkflow,
				name: e.target.value,
			});
		}
	};

	const handleSubmit = () => {
		setIsEditing(false);

		if (currentWorkflow && currentWorkflow.name.length > 30) {
			setUiErrorMessage('Workflow name cannot be longer than 30 characters');
		} else if (currentWorkflow && currentWorkflow.name.length < 5) {
			setUiErrorMessage('Workflow name must be at least 5 characters');
		}

		// update workflows to edit the name field
		const newWorkflows = workflows.map((workflow) => {
			if (workflow.id === currentWorkflow?.id) {
				return {
					...workflow,
					name: acceptableText,
				};
			}
			return workflow;
		});
		if (currentWorkflow) {
			setCurrentWorkflow({
				...currentWorkflow,
				name: acceptableText,
			});
			setWorkflows(newWorkflows);
		}
	};

	const inputStyle =
		'border-none outline-none focus:ring-0 focus:border-none text-gray-800 w-full';

	return (
		<div className="flex items-center bg-slate-50 text-lg">
			{currentWorkflow && !isEditing && (
				<p
					onClick={handleTextClick}
					style={{
						wordWrap: 'break-word',
						whiteSpace: 'normal',
						maxWidth: '100%',
					}}
					className={`cursor-pointer font-medium text-gray-800`}
				>
					{currentWorkflow.name}
				</p>
			)}
			{currentWorkflow && isEditing && (
				<input
					autoFocus
					value={currentWorkflow.name}
					onChange={handleInputChange}
					onBlur={handleSubmit}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSubmit();
						}
					}}
					className={`${inputStyle}`}
					maxLength={30}
					minLength={5}
				/>
			)}
		</div>
	);
};

export default EditableText;
