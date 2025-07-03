'use client'

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useMainContext } from "@/contexts/MainContext";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



const AgentsPage = () => {
    
    const { data: agents, isLoading } = useQuery({
        queryKey: ['agents'], 
        queryFn: () => {
            return fetch('https://agents-api.doodles.app/agents')
                .then((res) => res.json())
                .then((data) => data);
        }
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center p-8">
                <LoadingSpinner size="lg" message="Loading agent..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex px-4 flex-col items-center justify-start mt-10" style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}>
            
            {/* AIM-style header */}
            <div className="w-full max-w-md bg-blue-700 text-white text-lg font-bold py-3 px-4 rounded-t shadow flex items-center justify-between">
                <span>Choose you character</span>
                {/* <span className="text-xs font-normal opacity-80">AIM</span> */}
            </div>

            {/* Buddy list container */}
            <div className="w-full max-w-md bg-white border border-blue-300 rounded-b shadow-md overflow-hidden">
                {agents?.agents.map((agent: { id: string; name: string; description: string }) => (
                    <Link href={`/agents/${agent.id}/chat`} key={agent.id} className="no-underline">
                        <div className="flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-blue-100 cursor-pointer transition-colors">
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 border border-white shadow" title="Online"></span>
                            <div>
                                <h2 className="text-base font-bold text-blue-900 leading-tight">{agent.name}</h2>
                                <p className="text-xs text-gray-600">{agent.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AgentsPage;
