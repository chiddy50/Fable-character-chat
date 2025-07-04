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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Trophy,
    Target,
    Zap,
    Crown,
    Award,
    Play,
    RotateCcw,
    CheckCircle,
    XCircle,
    Clock,
    Heart,
    Smile,
    Frown,
    Angry,
    Eye,
    Brain,
    Bed,
    Sparkles
} from 'lucide-react'
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
    badge: 'gold' | 'silver' | 'bronze';
    icon?: React.ReactNode;
    difficulty: 'easy' | 'medium' | 'hard';
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
    badge?: 'gold' | 'silver' | 'bronze';
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

const emotionIcons = {
    happy: <Smile className="w-4 h-4" />,
    sad: <Frown className="w-4 h-4" />,
    fear: <Eye className="w-4 h-4" />,
    angry: <Angry className="w-4 h-4" />,
    thinking: <Brain className="w-4 h-4" />,
    embarrassed: <Sparkles className="w-4 h-4" />,
    sleepy: <Bed className="w-4 h-4" />,
    'love/affection': <Heart className="w-4 h-4" />,
}

const quests: Quest[] = [
    {
        id: "1",
        quest: "Make the character happy",
        target: "happy",
        number_of_attempts: 5,
        badge: 'gold',
        icon: emotionIcons.happy,
        difficulty: 'easy'
    },
    {
        id: "2",
        quest: "Make the character sad",
        target: "sad",
        number_of_attempts: 5,
        badge: 'silver',
        icon: emotionIcons.sad,
        difficulty: 'medium'
    },
    {
        id: "3",
        quest: "Make the character feel fear",
        target: "fear",
        number_of_attempts: 5,
        badge: 'gold',
        icon: emotionIcons.fear,
        difficulty: 'hard'
    },
    {
        id: "5",
        quest: "Make the character angry",
        target: "angry",
        number_of_attempts: 5,
        badge: 'silver',
        icon: emotionIcons.angry,
        difficulty: 'medium'
    },
    {
        id: "6",
        quest: "Ensure the character starts thinking",
        target: "thinking",
        number_of_attempts: 5,
        badge: 'silver',
        icon: emotionIcons.thinking,
        difficulty: 'medium'
    },
    {
        id: "7",
        quest: "Make the character feel embarrassed",
        target: "embarrassed",
        number_of_attempts: 5,
        badge: 'gold',
        icon: emotionIcons.embarrassed,
        difficulty: 'hard'
    },
    {
        id: "8",
        quest: "Make the character feel sleepy",
        target: "sleepy",
        number_of_attempts: 5,
        badge: 'gold',
        icon: emotionIcons.sleepy,
        difficulty: 'hard'
    },
    {
        id: "9",
        quest: "Make the character feel love/affection",
        target: "love/affection",
        number_of_attempts: 5,
        badge: 'gold',
        icon: emotionIcons['love/affection'],
        difficulty: 'hard'
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

    useEffect(() => {
        if (questState?.status === 'success') {
            recordVictory(questState);
        }
    }, [questState?.status]);

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
            const existingVictories = JSON.parse(localStorage.getItem('victories') || '[]');
            const victories = Array.isArray(existingVictories) ? existingVictories : [];

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

    const startQuest = () => {
        if (!currentAgent?.id || !selectedQuest) {
            setError("No agent or quest selected");
            return;
        }

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
            badge: selectedQuest.badge
        };

        setQuestState(newQuest);
        setIsDialogOpen(false);
        setError("");
        setSelectedQuest(null);
    };

    const resetQuest = () => {
        setQuestState(null);
    };

    const getBadgeColor = (badge: 'gold' | 'silver' | 'bronze') => {
        switch (badge) {
            case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
            case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800';
            case 'bronze': return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
        switch (difficulty) {
            case 'easy': return 'text-green-600 bg-green-50 border-green-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'hard': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getProgressPercentage = () => {
        if (!questState) return 0;
        return (questState.attempts / questState.number_of_attempts) * 100;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <Clock className="w-4 h-4 text-black" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-black" />;
            case 'failed': return <XCircle className="w-4 h-4 text-black" />;
            default: return null;
        }
    };

    if (!currentAgent) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto mb-4 px-4 sm:px-0">
            {/* Active Quest Display */}
            {questState && (
                <Card className={`mb-4 transition-all duration-300 gap-2 ${questState.status === 'active'
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg'
                        : questState.status === 'success'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg'
                            : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-lg'
                    }`}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(questState.status)}
                                <CardTitle className="text-base text-black pb-0 font-semibold">
                                    {questState.quest}
                                </CardTitle>
                            </div>
                            <Badge className={getBadgeColor(questState.badge || 'bronze')}>
                                {questState.badge === 'gold' && <Crown className="w-3 h-3 mr-1" />}
                                {questState.badge === 'silver' && <Award className="w-3 h-3 mr-1" />}
                                {questState.badge === 'bronze' && <Trophy className="w-3 h-3 mr-1" />}
                                {questState.badge?.toUpperCase()}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Target className="w-4 h-4" />
                                <span>Target: {questState.emotionTarget}</span>
                            </div>

                            {questState.status === 'active' && (
                                <div className="space-y-2 text-black">
                                    <div className="flex justify-between  text-sm">
                                        <span>Progress</span>
                                        <span className="font-medium">
                                            {questState.attempts} / {questState.number_of_attempts}
                                        </span>
                                    </div>
                                    <Progress
                                        value={getProgressPercentage()}
                                        className="h-2"
                                    />
                                    <p className="text-xs text-gray-500">
                                        {questState.number_of_attempts - questState.attempts} attempts remaining
                                    </p>
                                </div>
                            )}

                            {questState.status === 'success' && (
                                <div className="text-center py-2">
                                    <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-semibold">Quest Completed!</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Success in {questState.attempts} attempts
                                    </p>
                                </div>
                            )}

                            {questState.status === 'failed' && (
                                <div className="text-center py-2">
                                    <div className="flex items-center justify-center space-x-2 text-red-600 mb-2">
                                        <XCircle className="w-5 h-5" />
                                        <span className="font-semibold">Quest Failed</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Better luck next time!
                                    </p>
                                </div>
                            )}

                            {questState.status !== 'active' && (
                                <Button
                                    onClick={resetQuest}
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Start New Quest
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quest Selector */}
            {!questState || questState.status !== 'active' ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => {
                                setError("");
                                setSelectedQuest(null);
                            }}
                        >
                            <Play className="w-5 h-5 mr-2" />
                            {questState ? 'Start New Quest' : 'Begin Quest'}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="w-full max-w-md mx-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                                <Zap className="w-5 h-5 text-indigo-600" />
                                <span>Choose Your Quest</span>
                            </DialogTitle>
                            <DialogDescription>
                                Select a quest to try with <span className="font-semibold">{currentAgent.name}</span>
                            </DialogDescription>
                        </DialogHeader>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                                <XCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Select onValueChange={(value) => {
                                const quest = quests.find(q => q.id === value);
                                setSelectedQuest(quest || null);
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a quest..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {quests.map(quest => (
                                        <SelectItem key={quest.id} value={quest.id}>
                                            <div className="flex items-center space-x-2">
                                                {quest.icon}
                                                <span>{quest.quest}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedQuest && (
                                <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                                                    {selectedQuest.icon}
                                                    <span>{selectedQuest.quest}</span>
                                                </h4>
                                                <Badge className={getBadgeColor(selectedQuest.badge)}>
                                                    {selectedQuest.badge === 'gold' && <Crown className="w-3 h-3 mr-1" />}
                                                    {selectedQuest.badge === 'silver' && <Award className="w-3 h-3 mr-1" />}
                                                    {selectedQuest.badge === 'bronze' && <Trophy className="w-3 h-3 mr-1" />}
                                                    {selectedQuest.badge?.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Target className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">Target:</span>
                                                    <span className="font-medium">{selectedQuest.target}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Zap className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">Attempts:</span>
                                                    <span className="font-medium">{selectedQuest.number_of_attempts}</span>
                                                </div>
                                            </div>

                                            <Badge
                                                variant="outline"
                                                className={`${getDifficultyColor(selectedQuest.difficulty)} text-xs`}
                                            >
                                                {selectedQuest.difficulty.toUpperCase()} DIFFICULTY
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Button
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                onClick={startQuest}
                                disabled={!selectedQuest}
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Start Quest
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="text-center py-1">
                    <div className="flex items-center justify-center space-x-2 text-indigo-600 mb-2">
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span className="font-semibold">Quest in Progress</span>
                    </div>
                    {/* <p className="text-sm text-gray-600">
                        Keep chatting to complete your quest!
                    </p> */}
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

    if (currentEmotion && currentEmotion.toLowerCase() === quest.emotionTarget.toLowerCase()) {
        updatedQuest.status = 'success';
    } else if (updatedQuest.attempts >= quest.number_of_attempts) {
        updatedQuest.status = 'failed';
    }

    return updatedQuest;
}

export default QuestComponent;

export const getBadgeColor = (badge: 'gold' | 'silver' | 'bronze') => {
    switch (badge) {
        case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
        case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800';
        case 'bronze': return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
        default: return 'bg-gray-500 text-white';
    }
};