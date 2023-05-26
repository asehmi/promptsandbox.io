import { AllDataTypes, TextNodeDataType } from '@chatbutler/shared';
import { Node } from 'reactflow';

import TabsTemplate from '../TabsTemplate';

export default function ChatMessageTabs({
	selectedNode,
	updateNode,
}: {
	selectedNode: Node<TextNodeDataType>;
	updateNode: (id: string, data: AllDataTypes) => void;
}) {
	return (
		<TabsTemplate selectedNode={selectedNode} updateNode={updateNode} tabs={[]}></TabsTemplate>
	);
}
