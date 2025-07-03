// types/agent.ts
export interface Message {
  text: string;
  user: string;
}

export interface Agent {
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface AgentSummary {
  agentId: string;
  agentName: string;
  relationship: string;
  summary: string;
  lastUpdated: string;
  currentEmotion: string;
  messageCount: number;
  version: string;
}

export interface Memory {
  id: string;
  content: {
    text: string;
    source: string;
  };
  createdAt: string;
}