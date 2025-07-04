"use client"

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from 'uuid';

interface Agent {
    id: string;
    name: string;
    avatar: string;
}

interface Quest {
    id: string;
    quest: string;
    target: string;
    number_of_attempts: number;
    badge: 'gold' | 'silver' | 'bronze'; // Added badge type
}

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
    badge?: 'gold' | 'silver' | 'bronze'; // Added badge to active quest
}

interface Victory {
    id: string;
    agentId: string;
    agentName: string;
    questId: string;
    questName: string;
    attempts: number;
    completedAt: string;
    badge: 'gold' | 'silver' | 'bronze';
}

const quests: Quest[] = [
    {
        id: "1",
        quest: "Make the character happy",
        target: "happy",
        number_of_attempts: 5,
        badge: 'gold'
    },
    {
        id: "2",
        quest: "Make the character sad",
        target: "sad",
        number_of_attempts: 5,
        badge: 'silver'
    },
    {
        id: "3",
        quest: "Make the character feel fear",
        target: "fear",
        number_of_attempts: 5,
        badge: 'gold'
    },
    {
        id: "5",
        quest: "Make the character angry",
        target: "angry",
        number_of_attempts: 5,
        badge: 'silver'
    },
    
    {
        id: "6",
        quest: "Ensure the character starts thinking",
        target: "thinking",
        number_of_attempts: 5,
        badge: 'silver'
    },
    {
        id: "7",
        quest: "Make the character feel embarrassed",
        target: "embarrassed",
        number_of_attempts: 5,
        badge: 'gold'
    },
    {
        id: "8",
        quest: "Make the character feel sleepy",
        target: "sleepy",
        number_of_attempts: 5,
        badge: 'gold'
    },
    {
        id: "9",
        quest: "Make the character feel love/affection",
        target: "love/affection",
        number_of_attempts: 5,
        badge: 'gold'
    },

    

    
];

interface Props {
    currentEmotion: string | null;
    currentAgent: Agent | null;
    questState: ActiveQuest | null;
    setQuestState: (quest: ActiveQuest | null) => void;
}

const QuestComponent: React.FC<Props> = ({
    currentEmotion,
    currentAgent,
    questState,
    setQuestState
}) => {
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Add this useEffect to track quest completion
    useEffect(() => {
        if (questState?.status === 'success') {
            recordVictory(questState);
        }
    }, [questState?.status]);




    // Helper function to record victories
    // Update the recordVictory function in QuestComponent.tsx
    const recordVictory = (quest: ActiveQuest) => {
        if (!currentAgent || quest.status !== 'success') return;

        const victory: Victory = {
            id: uuidv4(),
            agentId: currentAgent.id,
            agentName: currentAgent.name,
            questId: quest.questId,
            questName: quest.quest,
            attempts: quest.attempts,
            completedAt: new Date().toISOString(),
            badge: quest.badge || 'bronze'
        };

        try {
            // Get existing victories or initialize empty array
            const existingVictories = JSON.parse(localStorage.getItem('victories') || '[]');
            const victories = Array.isArray(existingVictories) ? existingVictories : [];

            // Check if this victory already exists
            const alreadyRecorded = victories.some((v: Victory) =>
                v.agentId === victory.agentId &&
                v.questId === victory.questId &&
                v.completedAt === victory.completedAt
            );

            if (!alreadyRecorded) {
                const updatedVictories = [...victories, victory];
                localStorage.setItem('victories', JSON.stringify(updatedVictories));
            }
        } catch (error) {
            console.error('Error recording victory:', error);
        }
    };

    // Update the startQuest function to include the badge
    const startQuest = () => {
        if (!currentAgent?.id || !selectedQuest) {
            setError("No agent or quest selected");
            return;
        }

        // Check for existing active quest
        if (questState && questState.status === 'active') {
            setError("You already have an active quest with this agent");
            return;
        }

        const newQuest: ActiveQuest = {
            id: Date.now().toString(),
            agentId: currentAgent.id,
            questId: selectedQuest.id,
            emotionTarget: selectedQuest.target,
            quest: selectedQuest.quest,
            attempts: 0,
            number_of_attempts: selectedQuest.number_of_attempts,
            status: 'active',
            createdAt: new Date().toISOString(),
            badge: selectedQuest.badge // Add this line to include the badge
        };

        setQuestState(newQuest);
        setIsDialogOpen(false);
        setError("");
        setSelectedQuest(null);
    };

    const resetQuest = () => {
        setQuestState(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            // case 'active': return 'text-blue-600';
            case 'active': return '';
            case 'success': return 'text-green-600';
            case 'failed': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusMessage = () => {
        if (!questState) return null;

        const remaining = questState.number_of_attempts - questState.attempts;

        switch (questState.status) {
            case 'active':
                return `Active: ${remaining} attempts remaining to make them ${questState.emotionTarget}`;
            case 'success':
                return `Success! You made them ${questState.emotionTarget} in ${questState.attempts} attempts!`;
            case 'failed':
                return `Failed! You couldn't make them ${questState.emotionTarget} in ${questState.number_of_attempts} attempts.`;
            default:
                return null;
        }
    };

    if (!currentAgent) {
        return null;
    }

    return (
        <div className=' mb-3 max-w-md mx-auto rounded-lg shadow-sm border'>
            {/* Quest Status Display */}
            {questState && (
                <div className={`mb-3 p-2 flex justify-center ${questState.status === 'active' ? 'bg-gray-600 ' :
                    questState.status === 'success' ? 'bg-green-50 border-green-200' :
                        'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-sm">{questState.quest}</h4>
                            <p className={`text-xs ${getStatusColor(questState.status)}`}>
                                {getStatusMessage()}
                            </p>
                        </div>
                        {questState.status !== 'active' && (
                            <Button
                                onClick={resetQuest}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                            >
                                New Quest
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Quest Selector */}
            {!questState || questState.status !== 'active' ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full bg-indigo-700 text-white"
                            onClick={() => {
                                setError("");
                                setSelectedQuest(null);
                            }}
                        >
                            {questState ? 'Start New Quest' : 'Start Quest'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Choose a Quest</DialogTitle>
                            <DialogDescription>
                                Select a quest to try with {currentAgent.name}
                            </DialogDescription>
                        </DialogHeader>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Select onValueChange={(value) => {
                                const quest = quests.find(q => q.id === value);
                                setSelectedQuest(quest || null);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a quest..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {quests.map(quest => (
                                        <SelectItem key={quest.id} value={quest.id}>
                                            {quest.quest} (Target: {quest.target})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedQuest && (
                                <div className="p-3 border rounded-lg bg-gray-50">
                                    <h4 className="font-semibold">{selectedQuest.quest}</h4>
                                    <p className="text-sm text-gray-600">
                                        Target emotion: {selectedQuest.target}<br />
                                        Attempts allowed: {selectedQuest.number_of_attempts}
                                    </p>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                onClick={startQuest}
                                disabled={!selectedQuest}
                            >
                                Start Quest
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="text-center py-3">
                    <p className="text-sm text-gray-600">Quest in progress...</p>
                </div>
            )}
        </div>
    );
};

// Helper function to update quest progress
function updateQuestProgress(quest: ActiveQuest, currentEmotion: string): ActiveQuest {
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
}

export default QuestComponent;


export const getBadgeColor = (badge: 'gold' | 'silver' | 'bronze') => {
    switch (badge) {
        case 'gold': return 'bg-yellow-500 text-white';
        case 'silver': return 'bg-gray-300 text-gray-800';
        case 'bronze': return 'bg-amber-700 text-white';
        default: return 'bg-gray-500 text-white';
    }
};