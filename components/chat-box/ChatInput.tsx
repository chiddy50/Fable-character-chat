"use client"

import React from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  loading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  onSendMessage, 
  loading 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && input.trim()) {
      onSendMessage();
    }
  };

  return (
    <div className="flex items-center bg-gray-50 gap-2 border border-gray-100 rounded-lg px-3">
      <input
        className="flex-1 bg-gray-50 rounded px-3 py-3 text-sm outline-0 focus:outline-non placeholder:text-black text-black"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading}
        style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}
      />
      {!loading && <i onClick={onSendMessage} className='bx bx-play-circle text-2xl cursor-pointer text-gray-500' ></i>}
      {loading && <i className='bx bx-stop-circle bx-flashing text-2xl cursor-pointer text-gray-600' ></i>}

    </div>
  );
};