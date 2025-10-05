import { authClient } from "../lib/auth-client";

export function User(){
    const {data: session, isPending, error, refetch } = authClient.useSession();

    return {
        session,
        user: session?.user ?? null,
        userId: session?.user?.id ?? null,
        isPending,
        isAuthenticated: !!session,
        error,
        refetch,
        signOut: () => authClient.signOut()
    }
}