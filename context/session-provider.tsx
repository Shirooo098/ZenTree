"use client";

import { createContext, useContext } from "react";

export const SessionContext = createContext<any>(null);

export const SessionProvider = ({ value, children }: { value: any, children: React.ReactNode }) => {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  return useContext(SessionContext);
};
