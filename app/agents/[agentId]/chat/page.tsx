"use client";

import { Button } from "@/components/ui/button";
import { getConversationSummaryPrompt } from "@/lib/prompts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

// Import our custom components and hooks
import { useAgentSummaryCache } from "@/hooks/useAgentSummaryCache";
import { AgentHeader } from "@/components/shared/AgentHeader";
import { ChatContainer } from "@/components/chat-box/ChatContainer";
import { ChatInput } from "@/components/chat-box/ChatInput";
import { ChatSummary } from "@/components/chat-box/ChatSummary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Message, Agent, AgentSummary, Memory } from "@/types/agent";
import QuestComponent from "@/components/chat-box/QuestComponent";
// import VictoryList from "@/components/chat-box/VictoryList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://agents-api.doodles.app";
const API_HEADERS = {
    "Content-Type": "application/json",
    "x-mini-app-id": process.env.NEXT_PUBLIC_APP_ID,
    "x-mini-app-secret": process.env.NEXT_PUBLIC_APP_SECRET ,
};

interface ActiveQuest {
    id: string;
    agentId: string;
    questId: string;
    emotionTarget: string;
    quest: string;
    attempts: number;
    number_of_attempts: number;
    status: 'active' | 'success' | 'failed';
    createdAt: string;
}

const AgentChatPage = () => {
    // Router and params
    const params = useParams();
    const router = useRouter();
    const agentId = params?.agentId as string | undefined;

    // State management
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
    const [chatSummary, setChatSummary] = useState<AgentSummary | null>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingMemories, setLoadingMemories] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
    const [questState, setQuestState] = useState<ActiveQuest | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    // Constants
    const MESSAGES_PER_PAGE = 10;

    // Refs
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    // Custom hooks
    const {
        getAgentSummary,
        saveAgentSummary,
        removeAgentSummary,
        shouldUpdateSummary
    } = useAgentSummaryCache();


    /**
     * Fetch agent data from API
     */
    const { data: agent, isLoading: agentLoading, error } = useQuery({
        queryKey: ['agent', agentId],
        queryFn: async (): Promise<Agent> => {
            if (!agentId) throw new Error('No agent ID provided');

            const res = await fetch(`${API_BASE_URL}/agents/${agentId}`);
            if (!res.ok) throw new Error('Failed to fetch agent');

            const data = await res.json();
            const agentData: Agent = {
                id: data.id,
                name: data.name,
                avatar: data.avatar
            };

            setCurrentAgent(agentData);
            return agentData;
        },
        enabled: !!agentId,
    });

    /**
     * Fetch agent memories with pagination
     */
    const { data: memories, isLoading: agentMemoryLoading } = useQuery({
        queryKey: ['loadAgentMemory', agentId, currentPage],
        queryFn: async () => {
            if (!agentId) throw new Error('No agent ID provided');

            const currentOffset = (currentPage - 1) * MESSAGES_PER_PAGE;

            const res = await fetch(
                `${API_BASE_URL}/agents/${agentId}/memories?limit=${MESSAGES_PER_PAGE}&offset=${currentOffset}`,
                {
                    method: "GET",
                    headers: API_HEADERS,
                }
            );

            if (!res.ok) throw new Error('Failed to fetch agent memories');
            const data = await res.json();

            // Update pagination state
            setHasNextPage(data.memories && data.memories.length === MESSAGES_PER_PAGE);

            // Transform memories to messages
            const transformedMessages = sortByCreatedAt(data.memories).map((memory: Memory) => ({
                text: memory.content.text,
                user: memory.content.source === "direct" ? "user" : "agent"
            }));

            // Handle message state updates
            if (currentPage === 1) {
                setMessages(transformedMessages);
            } else {
                setMessages((prev) => [...transformedMessages, ...prev]);
            }

            return { memories: data.memories };
        },
        enabled: !!agentId && messages.length < 1,
    });

    useEffect(() => {
        const cachedSummary = localStorage.getItem("agentList") ?? "[]";
        const parseCachedSummary = JSON.parse(cachedSummary);
        const summary = parseCachedSummary.find((item: any) => item.agentId === agentId);
        setChatSummary(summary);
    }, [agentId]);



    // useEffect(() => {
    //     if (questState?.status === 'success') {
    //         const victory: Victory = {
    //             id: uuidv4(),
    //             agentId: questState.agentId,
    //             agentName: currentAgent?.name || '',
    //             questId: questState.questId,
    //             questName: questState.quest,
    //             attempts: questState.attempts,
    //             completedAt: new Date().toISOString(),
    //             badge: questState.badge || 'bronze'
    //         };

    //         const existing = JSON.parse(localStorage.getItem('victories') || '[]');
    //         const alreadyExists = existing.some((v: any) =>
    //             v.agentId === victory.agentId &&
    //             v.questId === victory.questId &&
    //             v.completedAt === victory.completedAt
    //         );

    //         if (!alreadyExists) {
    //             const updated = [...existing, victory];
    //             localStorage.setItem('victories', JSON.stringify(updated));
    //         }
    //     }
    // }, [questState?.status]);



    /**
     * Sort memories by creation date
     */
    const sortByCreatedAt = (array: Memory[]): Memory[] => {
        return array.sort((a, b) => {
            const first = new Date(a.createdAt).getTime();
            const second = new Date(b.createdAt).getTime();
            return first - second;
        });
    };

    const updateQuestProgress = (quest: ActiveQuest, currentEmotion: string): ActiveQuest => {
        if (quest.status !== 'active') return quest;

        const updatedQuest = {
            ...quest,
            attempts: quest.attempts + 1
        };

        // Check if current emotion matches target (case insensitive)
        if (currentEmotion && currentEmotion.toLowerCase() === quest.emotionTarget.toLowerCase()) {
            updatedQuest.status = 'success';
        }
        // Check if attempts exceeded
        else if (updatedQuest.attempts >= quest.number_of_attempts) {
            updatedQuest.status = 'failed';
        }

        return updatedQuest;
    };

    /**
     * Generate chat summary using API
     */
    // Update the getChatSummary function to remove the quest update logic
    // Update the getChatSummary function
    const getChatSummary = async (chatMessages: Message[]) => {
        if (chatMessages.length < 2) {
            setLoadingSummary(false);
            return;
        }

        const prompt = getConversationSummaryPrompt(chatMessages, currentAgent);

        try {
            setLoadingSummary(true);
            const res = await axios.post('/api/json-llm-response', {
                type: "chat-summary",
                prompt,
            });

            if (res.data && currentAgent) {
                const newEmotion = res.data?.currentEmotion;
                setCurrentEmotion(newEmotion);
                setChatSummary(res.data);

                // Only update quest if emotion changed
                if (newEmotion && newEmotion !== currentEmotion) {
                    setQuestState(prev => {
                        if (!prev || prev.status !== 'active') return prev;

                        const attempts = prev.attempts + 1;

                        let status: 'active' | 'success' | 'failed' = 'active';

                        if (newEmotion.toLowerCase() === prev.emotionTarget.toLowerCase()) {
                            status = 'success';
                        } else if (attempts >= prev.number_of_attempts) {
                            status = 'failed';
                        }

                        return {
                            ...prev,
                            attempts,
                            status
                        };
                    });
                }

            }
        } catch (error) {
            console.error('Error generating chat summary:', error);
        } finally {
            setLoadingSummary(false);
            scrollToBottom();

        }
    };
    /**
     * Send a new message
     */
    const sendMessage = async () => {
        if (!input.trim() || !agentId || loading) return;
        scrollToBottom();

        setLoading(true);
        const userMessage: Message = { text: input.trim(), user: "user" };

        // Optimistically add user message
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await fetch(`${API_BASE_URL}/${agentId}/user/message`, {
                method: "POST",
                headers: API_HEADERS,
                body: JSON.stringify({ text: userMessage.text, user: userMessage.user }),
            });

            if (!res.ok) throw new Error('Failed to send message');

            const data = await res.json();
            scrollToBottom();

            const agentMessage: Message = {
                text: Array.isArray(data) ? data[0].text : data.text,
                user: "agent"
            };

            // Add agent response
            setMessages((prev) => [...prev, agentMessage]);

            // Update summary with new messages
            const updatedMessages = [...messages, userMessage, agentMessage];
            await getChatSummary(updatedMessages);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [
                ...prev,
                { text: "Error sending message. Please try again.", user: "system" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete all memories
     */
    const deleteMemory = async () => {
        if (!agentId) return;

        try {
            const res = await fetch(`${API_BASE_URL}/agents/${agentId}/memories`, {
                method: "DELETE",
                headers: API_HEADERS,
            });

            if (!res.ok) throw new Error('Failed to delete memories');

            // Reset state
            setMessages([]);
            setCurrentPage(1);
            setHasNextPage(false);
            setChatSummary(null);
            removeAgentSummary(agentId);
            paginateMemories();

        } catch (error) {
            console.error('Error deleting memories:', error);
        }
    };

    /**
     * Handle pagination when scrolling to top
     */
    const paginateMemories = async () => {
        if (loadingMemories || !hasNextPage || !agentId) return;

        setLoadingMemories(true);
        const nextPage = currentPage + 1;

        try {
            const currentOffset = (nextPage - 1) * MESSAGES_PER_PAGE;

            const res = await fetch(
                `${API_BASE_URL}/agents/${agentId}/memories?limit=${MESSAGES_PER_PAGE}&offset=${currentOffset}`,
                {
                    method: "GET",
                    headers: API_HEADERS,
                }
            );

            if (!res.ok) throw new Error('Failed to fetch memories');
            const data = await res.json();

            // Update pagination state
            setCurrentPage(nextPage);
            setHasNextPage(data.memories && data.memories.length === MESSAGES_PER_PAGE);

            // Process new memories
            const newMemories = sortByCreatedAt(data.memories).map((memory: Memory) => ({
                text: memory.content.text,
                user: memory.content.source === "direct" ? "user" : "agent"
            }));

            // Maintain scroll position
            const element = chatContainerRef.current;
            const scrollHeightBefore = element?.scrollHeight || 0;

            // Prepend new messages
            setMessages((prev) => [...newMemories, ...prev]);

            // Restore scroll position
            setTimeout(() => {
                if (element) {
                    const scrollHeightAfter = element.scrollHeight;
                    const scrollDifference = scrollHeightAfter - scrollHeightBefore;
                    element.scrollTop = element.scrollTop + scrollDifference;
                }
            }, 50);

        } catch (error) {
            console.error('Error fetching memories:', error);
        } finally {
            setLoadingMemories(false);
        }
    };

    /**
     * Handle scroll events for pagination
     */
    const handleScroll = useCallback((element: HTMLDivElement) => {
        if (element.scrollTop < lastScrollTop) {
            // Scrolling up
            if (element.scrollTop === 0) {
                // Reached top - trigger pagination
                if (hasNextPage && !loadingMemories) {
                    paginateMemories();
                }
            }
        }
        setLastScrollTop(element.scrollTop <= 0 ? 0 : element.scrollTop);
    }, [lastScrollTop, hasNextPage, loadingMemories]);

    /**
     * Auto-scroll to bottom for new messages
     */
    const scrollToBottom = useCallback(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, []);

    // Auto-scroll effects
    useEffect(() => {
        if (currentPage === 1 && messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, currentPage, scrollToBottom]);

    // Loading states
    if (agentLoading) {
        return (
            <div className="flex flex-col items-center p-8">
                <LoadingSpinner size="lg" message="Loading agent..." />
            </div>
        );
    }

    if (error || !agent) {
        return (
            <div className="flex flex-col items-center p-8 text-red-600">
                Agent not found.
            </div>
        );
    }

    return (
        <div>
            {/* Back button */}
            <div className="flex items-center gap-5">
                <button
                    className="mb-4 mt-4 ml-4 flex items-center gap-1 text-white hover:underline text-sm font-bold px-2 py-1 rounded transition-colors"
                    onClick={() => router.push("/agents")}
                    type="button"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                <Link href="/">
                    <Button >
                        Victories
                    </Button>
                </Link>
            </div>

            <QuestComponent
                currentEmotion={currentEmotion}
                currentAgent={currentAgent}
                questState={questState}
                setQuestState={setQuestState}
            />

            {/* Main content */}
            <div
                className="flex flex-col md:flex-row max-w-4xl mx-auto p-4 gap-4"
                style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}
            >
                {/* Chat section */}
                <div className="flex flex-col max-w-md mx-auto bg-white border p-4 border-gray-300 rounded shadow-md transition-all duration-500">
                    <AgentHeader agent={agent} onDeleteMemory={deleteMemory} chatSummary={chatSummary} />

                    <ChatContainer
                        ref={chatContainerRef}
                        messages={messages}
                        agent={agent}
                        loading={loading}
                        loadingMemories={loadingMemories}
                        agentMemoryLoading={agentMemoryLoading}
                        hasNextPage={hasNextPage}
                        onScroll={handleScroll}
                    />

                    <ChatInput
                        input={input}
                        setInput={setInput}
                        onSendMessage={sendMessage}
                        loading={loading}
                    />

                    {/* Add VictoryList below QuestComponent */}
                </div>

                {/* Summary section */}
                <ChatSummary
                    currentAgent={currentAgent}
                    chatSummary={chatSummary}
                    loadingSummary={loadingSummary}
                />
            </div>


        </div>
    );
};

export default AgentChatPage;