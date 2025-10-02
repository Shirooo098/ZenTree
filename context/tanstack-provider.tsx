  "use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { UserProvider } from "./user-context";
import { User } from "@/app/types/definition";

interface TanstackProviderProps {
  children: React.ReactNode
  user?: User
}

export const TanstackProvider = ({ children, user } : TanstackProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {user ? 
      (
        <UserProvider user={user}>
        {children}
      </UserProvider>
      ) : (
        children
      )}
    </QueryClientProvider>
  )
}