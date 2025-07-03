// Types (should match your existing types)
interface AgentListItem {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    lastUpdated: number;
    messageCount: number;
    summary: string|null;
    isNewChat: boolean;
}

// Constants
const STORAGE_KEYS = {
    AGENT_LIST: 'agentList',
    CHAT_CACHE: 'chatCache_'
} as const;

/**
 * Fetches an agent by ID from localStorage agentList and resets all its values
 * @param agentId - The ID of the agent to reset
 * @returns The reset agent data or null if agent not found
 */
export const resetAgentById = (agentId: string): AgentListItem | null => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
        console.warn('resetAgentById: localStorage not available (SSR environment)');
        return null;
    }

    try {
        // Get current agent list from localStorage
        const storedAgentList = localStorage.getItem(STORAGE_KEYS.AGENT_LIST);
        
        if (!storedAgentList) {
            console.warn('resetAgentById: No agent list found in localStorage');
            return null;
        }

        const agentList: AgentListItem[] = JSON.parse(storedAgentList);
        
        // Find the agent by ID
        const agentIndex = agentList.findIndex(agent => agent.id === agentId);
        
        if (agentIndex === -1) {
            console.warn(`resetAgentById: Agent with ID "${agentId}" not found in agent list`);
            return null;
        }

        // Get the agent to reset
        const agentToReset = agentList[agentIndex];
        
        // Create reset agent with default values (keeping only essential info)
        const resetAgent: AgentListItem = {
            id: agentToReset.id,
            name: agentToReset.name,
            avatar: agentToReset.avatar,
            lastMessage: '', // Reset to empty
            summary: "",
            lastUpdated: Date.now(), // Update to current time
            messageCount: 0, // Reset to zero
            isNewChat: true // Mark as new chat
        };

        // Update the agent in the list
        agentList[agentIndex] = resetAgent;

        // Save updated agent list back to localStorage
        localStorage.setItem(STORAGE_KEYS.AGENT_LIST, JSON.stringify(agentList));

        // Also clear the chat cache for this agent
        const chatCacheKey = `${STORAGE_KEYS.CHAT_CACHE}${agentId}`;
        localStorage.removeItem(chatCacheKey);

        console.log(`Successfully reset agent "${agentToReset.name}" (ID: ${agentId})`);
        return resetAgent;

    } catch (error) {
        console.error('resetAgentById: Error resetting agent:', error);
        return null;
    }
};

/**
 * Resets multiple agents by their IDs
 * @param agentIds - Array of agent IDs to reset
 * @returns Array of reset agents (null for agents not found)
 */
const resetMultipleAgentsById = (agentIds: string[]): (AgentListItem | null)[] => {
    return agentIds.map(id => resetAgentById(id));
};

/**
 * Resets all agents in the localStorage agentList
 * @returns Array of all reset agents
 */
const resetAllAgents = (): AgentListItem[] => {
    if (typeof window === 'undefined') {
        console.warn('resetAllAgents: localStorage not available (SSR environment)');
        return [];
    }

    try {
        const storedAgentList = localStorage.getItem(STORAGE_KEYS.AGENT_LIST);
        
        if (!storedAgentList) {
            console.warn('resetAllAgents: No agent list found in localStorage');
            return [];
        }

        const agentList: AgentListItem[] = JSON.parse(storedAgentList);
        
        // Reset all agents
        const resetAgents = agentList.map(agent => ({
            id: agent.id,
            name: agent.name,
            avatar: agent.avatar,
            lastMessage: '',
            summary: "",
            lastUpdated: Date.now(),
            messageCount: 0,
            isNewChat: true
        }));

        // Save reset agent list
        localStorage.setItem(STORAGE_KEYS.AGENT_LIST, JSON.stringify(resetAgents));

        // Clear all chat caches
        agentList.forEach(agent => {
            const chatCacheKey = `${STORAGE_KEYS.CHAT_CACHE}${agent.id}`;
            localStorage.removeItem(chatCacheKey);
        });

        console.log(`Successfully reset ${resetAgents.length} agents`);
        return resetAgents;

    } catch (error) {
        console.error('resetAllAgents: Error resetting all agents:', error);
        return [];
    }
};

/**
 * Gets an agent by ID without resetting (for checking before reset)
 * @param agentId - The ID of the agent to fetch
 * @returns The agent data or null if not found
 */
const getAgentById = (agentId: string): AgentListItem | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const storedAgentList = localStorage.getItem(STORAGE_KEYS.AGENT_LIST);
        
        if (!storedAgentList) {
            return null;
        }

        const agentList: AgentListItem[] = JSON.parse(storedAgentList);
        return agentList.find(agent => agent.id === agentId) || null;

    } catch (error) {
        console.error('getAgentById: Error fetching agent:', error);
        return null;
    }
};

/**
 * Removes an agent completely from localStorage (both agentList and chat cache)
 * @param agentId - The ID of the agent to remove
 * @returns true if agent was removed, false if not found
 */
const removeAgentById = (agentId: string): boolean => {
    if (typeof window === 'undefined') {
        console.warn('removeAgentById: localStorage not available (SSR environment)');
        return false;
    }

    try {
        const storedAgentList = localStorage.getItem(STORAGE_KEYS.AGENT_LIST);
        
        if (!storedAgentList) {
            console.warn('removeAgentById: No agent list found in localStorage');
            return false;
        }

        const agentList: AgentListItem[] = JSON.parse(storedAgentList);
        const agentIndex = agentList.findIndex(agent => agent.id === agentId);
        
        if (agentIndex === -1) {
            console.warn(`removeAgentById: Agent with ID "${agentId}" not found`);
            return false;
        }

        // Remove agent from list
        const removedAgent = agentList.splice(agentIndex, 1)[0];
        
        // Save updated list
        localStorage.setItem(STORAGE_KEYS.AGENT_LIST, JSON.stringify(agentList));
        
        // Remove chat cache
        const chatCacheKey = `${STORAGE_KEYS.CHAT_CACHE}${agentId}`;
        localStorage.removeItem(chatCacheKey);

        console.log(`Successfully removed agent "${removedAgent.name}" (ID: ${agentId})`);
        return true;

    } catch (error) {
        console.error('removeAgentById: Error removing agent:', error);
        return false;
    }
};

// Export all functions
export {
    resetAgentById,
    resetMultipleAgentsById,
    resetAllAgents,
    getAgentById,
    removeAgentById
};

// Example usage:
/*
// Reset a single agent
const resetAgent = resetAgentById('agent-123');
if (resetAgent) {
    console.log('Agent reset successfully:', resetAgent);
} else {
    console.log('Agent not found or reset failed');
}

// Reset multiple agents
const resetAgents = resetMultipleAgentsById(['agent-123', 'agent-456']);
console.log('Reset results:', resetAgents);

// Reset all agents
const allResetAgents = resetAllAgents();
console.log('All agents reset:', allResetAgents);

// Get agent without resetting (to check before reset)
const agent = getAgentById('agent-123');
if (agent) {
    console.log('Agent found:', agent);
    // Now reset if needed
    resetAgentById('agent-123');
}

// Remove agent completely
const removed = removeAgentById('agent-123');
console.log('Agent removed:', removed);
*/