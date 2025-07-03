"use client"

import React from 'react';
import { Agent, AgentSummary } from '@/types/agent';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { findReactionSymbolByName, reactions } from '@/data/characterReactions';

interface ChatSummaryProps {
  chatSummary: AgentSummary | null;
  loadingSummary: boolean;
  currentAgent: Agent | null;
}

export const ChatSummary: React.FC<ChatSummaryProps> = ({ chatSummary, loadingSummary, currentAgent }) => {
  
  if (loadingSummary) {
    return (
      <div className="w-full md:w-80 bg-white border border-gray-300 rounded shadow-md p-5">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!chatSummary) {
    return (
      <div className="w-full md:w-80 bg-white border border-gray-300 rounded shadow-md p-5">
        <div className="text-center text-gray-400 text-sm">
          Chat summary will appear after a few messages
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 bg-white border border-gray-300 rounded shadow-md p-5">
      <div className="text-gray-700 flex items-center gap-1">
        <h1 className="font-extrabold">Relationship:</h1>
        <span>{chatSummary.relationship}</span>
      </div>

      <div className="text-gray-700 mt-5">
        <h1 className="font-extrabold text-sm">{currentAgent?.name ?? chatSummary?.agentName} is {chatSummary?.currentEmotion}</h1>
        <span className='capitalize text-7xl text0ce'>
          {/* {chatSummary.agentName} is {chatSummary.currentEmotion}  */}
          {findReactionSymbolByName(chatSummary?.currentEmotion)}
          </span>
      </div>

      
      
      <div className="mt-5 text-gray-700">
        <h1 className="font-extrabold">Chat Summary</h1>
        <p className="text-xs">{chatSummary.summary}</p>
      </div>
      
      {chatSummary.lastUpdated && (
        <div className="mt-2 text-xs text-gray-400">
          Last updated: {new Date(chatSummary.lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};
