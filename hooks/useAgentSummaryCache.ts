
import { useLocalStorage } from './useLocalStorage';
import { AgentSummary } from '../types/agent';

export const useAgentSummaryCache = () => {
    const [agentList, setAgentList] = useLocalStorage<AgentSummary[]>('agentList', []);

    const getAgentSummary = (agentId: string): AgentSummary | null => {
        return agentList.find(agent => agent.agentId === agentId) || null;
    };

    const saveAgentSummary = (summary: Partial<AgentSummary>, agentId: string, agentName: string, messageCount: number) => {
        const agentSummary: AgentSummary = {
            ...summary,
            agentId,
            agentName,
            lastUpdated: new Date().toISOString(),
            messageCount,
            version: "1.0"
        } as AgentSummary;

        setAgentList(prevList => {
            const existingIndex = prevList.findIndex(agent => agent.agentId === agentId);

            if (existingIndex !== -1) {
                const updatedList = [...prevList];
                updatedList[existingIndex] = agentSummary;
                return updatedList;
            } else {
                return [...prevList, agentSummary];
            }
        });

        console.log('Agent summary saved to localStorage');
    };

    const removeAgentSummary = (agentId: string) => {
        setAgentList(prevList => prevList.filter(agent => agent.agentId !== agentId));
        console.log('Agent summary removed from localStorage');
    };

    const shouldUpdateSummary = (cachedSummary: AgentSummary | null, currentMessageCount: number): boolean => {
        if (!cachedSummary) return true;

        // Update only when there are new messages (not on every load)
        const messageDifference = currentMessageCount - (cachedSummary.messageCount || 0);

        // Update if there are 2+ new messages or cache is older than 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const cacheAge = new Date(cachedSummary.lastUpdated || 0);
        const isCacheStale = cacheAge < oneHourAgo;

        return messageDifference >= 2 || isCacheStale;
    };

    return {
        getAgentSummary,
        saveAgentSummary,
        removeAgentSummary,
        shouldUpdateSummary
    };
};