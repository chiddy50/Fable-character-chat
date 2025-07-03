
import React from 'react';
import { Message, Agent } from '@/types/agent';

interface ChatMessageProps {
  message: Message;
  agent: Agent;
  index: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, agent, index }) => {
  const isUser = message.user === "user";

  return (
    <div key={index} className="mb-2 flex gap-2">
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="flex items-center justify-center rounded-full w-6 h-6 bg-gray-100">
            <i className="bx bxs-user text-lg text-gray-700"></i>
          </div>
        ) : (
          <img 
            src={agent.avatar} 
            alt={agent.name} 
            className="w-6 h-6 rounded-full border border-gray-300" 
          />
        )}
      </div>
      <p className={`text-xs text-gray-700 rounded-b-2xl rounded-tr-2xl p-4 ${
        isUser ? 'bg-gray-100' : 'bg-blue-50'
      }`}>
        {message.text}
      </p>
    </div>
  );
};