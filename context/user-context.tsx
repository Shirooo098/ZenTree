"use client";

import { User } from "@/app/types/definition";
import React, { createContext, useContext } from "react";

interface UserContextType {
    user: User,
    userId: string,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode,
    user: User,
}

export function UserProvider({ children, user} : UserProviderProps) {
    return(
        <UserContext.Provider value = {{ user, userId: user.id}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = useContext(UserContext);
    if(context === undefined) throw new Error("useUser must be used within the UserProvider")

    return context;
}

export function useUserId(){
    const { userId } = useUser();
    return userId;
}