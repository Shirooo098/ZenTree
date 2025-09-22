"use client";

import React, { createContext, useContext } from "react";

type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  username?: string | null;
  role?: string | null;
  phoneNumber?: string | null;
};

type Session = {
  user: SessionUser;
} | null;

const UserContext = createContext<Session>(null);

export function UserProvider({ session, children }:
{ 
  session: Session;
  children: React.ReactNode
}){
  return <UserContext.Provider value={session}>{children}</UserContext.Provider>;
}

export function useUser() {
  const session = useContext(UserContext);
  return session;
}


