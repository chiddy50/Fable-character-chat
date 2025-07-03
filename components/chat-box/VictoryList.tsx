// Refactored VictoryList component with medal icons and modern Tailwind design
"use client";

import { useEffect, useState } from 'react';
import { getBadgeColor } from './QuestComponent';
import { Medal } from 'lucide-react'; // Or use heroicons/other SVGs

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

const badgeIconColor = {
    gold: 'text-yellow-500',
    silver: 'text-gray-400',
    bronze: 'text-amber-700'
};

const VictoryList = () => {
    const [victories, setVictories] = useState<Victory[]>([]);

    useEffect(() => {
        const loadVictories = () => {
            try {
                const stored = localStorage.getItem('victories');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) setVictories(parsed);
                }
            } catch (error) {
                console.error('Failed to load victories:', error);
            }
        };

        loadVictories();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'victories') loadVictories();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="mt-6 w-full mx-auto bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">🏆 Your Victories</h3>

            {victories.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center">No victories yet. Complete some quests!</p>
            ) : (
                <ul className="space-y-3">
                    {victories.map((victory) => (
                        <li
                            key={victory.id}
                            className="flex items-center justify-between bg-white rounded-md border border-gray-100 p-3 shadow-sm hover:shadow-md transition"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-700">{victory.questName}</p>
                                <p className="text-xs text-slate-500">
                                    With <span className="font-medium text-slate-600">{victory.agentName}</span> in {victory.attempts} attempts
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Medal className={`w-4 h-4 ${badgeIconColor[victory.badge]}`} />
                                <span className={`text-xs font-semibold capitalize  px-3 py-1 rounded-sm ${getBadgeColor(victory.badge)}`}>
                                    {victory.badge}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VictoryList;
