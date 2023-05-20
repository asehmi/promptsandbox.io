import { PencilIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Node } from 'reactflow';

import DefaultTab from './DefaultTab';
import { AllDataTypes } from '../../../nodes/types/NodeTypes';
import { handleChange } from '../../../utils/handleFormChange';
import TabsNavigator from '../TabsNavigator';

interface TabsInterface {
	name: string;
	icon?: React.ForwardRefExoticComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined;
			titleId?: string | undefined;
		}
	>;
}

export default function TabsTemplate({
	selectedNode,
	updateNode,
	tabs,
	defaultTab,
	children,
}: {
	selectedNode: Node<AllDataTypes>;
	updateNode: (id: string, data: AllDataTypes) => void;
	tabs: TabsInterface[];
	defaultTab?: string;
	children?: (selected: string) => React.ReactNode;
}) {
	const allTabs = [{ name: 'Block', icon: PencilIcon }, ...tabs];
	const [selected, setSelected] = useState(defaultTab ? defaultTab : allTabs[0].name);
	return (
		<div className="flex h-full flex-col">
			<TabsNavigator tabs={allTabs} selected={selected} setSelected={setSelected} />
			<div className="grow overflow-y-auto pr-4 pl-2 pt-4">
				<div className="">
					{selected === 'Block' && (
						<DefaultTab
							selectedNode={selectedNode}
							handleChange={(e) =>
								handleChange(e, selectedNode.id, selectedNode.data, updateNode)
							}
						/>
					)}
					{children && children(selected)}
				</div>
			</div>
		</div>
	);
}
