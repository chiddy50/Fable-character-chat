// components/AgentHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Agent, AgentSummary } from '@/types/agent';
import { findReactionSymbolByName } from '@/data/characterReactions';

interface AgentHeaderProps {
	agent: Agent;
	onDeleteMemory: () => void;
	chatSummary: AgentSummary | null;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({ agent, onDeleteMemory, chatSummary }) => {
	return (
		<div className="flex items-center mb-2">
			<div className="relative">
				<img
					src={agent.avatar}
					alt={agent.name}
					className="w-12 h-12 rounded-lg mr-3 border border-blue-300"
				/>
				{chatSummary?.currentEmotion &&
				<div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-lg border-2 border-white shadow-md bg-white">
					{findReactionSymbolByName(chatSummary?.currentEmotion)}
				</div>}
			</div>
			<div>
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-bold text-gray-800 leading-tight">{agent.name}</h2>
					<span
						className="inline-block w-3 h-3 rounded-full bg-green-500 border border-white shadow"
						title="Online"
					></span>
				</div>
				<div className="text-xs text-gray-500">Instant Message</div>
			</div>

			<Button onClick={onDeleteMemory} className="ml-auto" title="Delete all memories">
				<Trash />
			</Button>
		</div>
	);
};