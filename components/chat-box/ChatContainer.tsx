"use client"

// components/ChatContainer.tsx
import React, { useRef, useEffect, forwardRef } from 'react';
import { Message, Agent } from '@/types/agent';
import { ChatMessage } from '@/components/chat-box/ChatMessage';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ChatContainerProps {
  messages: Message[];
  agent: Agent;
  loading: boolean;
  loadingMemories: boolean;
  agentMemoryLoading: boolean;
  hasNextPage: boolean;
  onScroll: (element: HTMLDivElement) => void;
}

export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ messages, agent, loading, loadingMemories, agentMemoryLoading, hasNextPage, onScroll }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle scroll events for pagination
    useEffect(() => {
      const element = containerRef.current;
      if (!element) return;

      const handleScroll = () => onScroll(element);
      element.addEventListener('scroll', handleScroll);

      return () => element.removeEventListener('scroll', handleScroll);
    }, [onScroll]);

    // Expose ref to parent component
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(containerRef.current);
      } else if (ref) {
        ref.current = containerRef.current;
      }
    }, [ref]);

    return (
      <div 
        ref={containerRef}
        className="flex-1 mb-3 border border-gray-300 rounded bg-white p-3 min-h-64 max-h-80 overflow-y-auto" 
        style={{ fontSize: '15px' }}
      >
        {/* Loading indicator for pagination */}
        {loadingMemories && (
          <LoadingSpinner size="sm" message="Loading more messages..." />
        )}
        
        {/* Pagination info */}
        {messages.length > 0 && !agentMemoryLoading && (
          <div className="text-center text-xs text-gray-400 mb-2">
            Showing {messages.length} messages
            {hasNextPage && " • Scroll to top for more"}
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !agentMemoryLoading && (
          <div className="text-center text-gray-400 text-sm mt-8">
            Start chatting with {agent.name}!
          </div>
        )}
        
        {/* Messages */}
        {messages.map((msg, idx) => (
          <ChatMessage 
            key={`${msg.user}-${idx}`} 
            message={msg} 
            agent={agent} 
            index={idx} 
          />
        ))}

        {/* Loading indicator for new messages */}
        {loading && (
          <div className="my-3 flex gap-2">
            <img 
              src={agent.avatar} 
              alt={agent.name} 
              className="w-6 h-6 rounded-full border border-gray-300" 
            />
            <div className="text-xs text-gray-700 bg-blue-50 rounded-b-2xl rounded-tr-2xl p-4 flex-1">                                        
              <i className="bx bx-dots-horizontal-rounded bx-burst text-2xl text-gray-600"></i>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatContainer.displayName = 'ChatContainer';