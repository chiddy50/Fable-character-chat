"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of your context
interface AppContextType {
    mode: any;
    setMode: (value: any) => void;
}

// Create context with proper typing and default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define props for your context provider
interface MainContextProps {
    children: ReactNode;
}

export function MainProvider({ children }: MainContextProps) {
    const [mode, setMode] = useState<string|null>(null);

    useEffect(() => {
        // Your initialization logic here
    }, []);

    return (
        <AppContext.Provider value={{
            mode, setMode
        }}>
            {children}
        </AppContext.Provider>
    );
}

// Create a custom hook for using the context
export function useMainContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a MainContext provider');
    }
    return context;
}