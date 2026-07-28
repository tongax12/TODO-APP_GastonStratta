import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../../services/firebase";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isLoading: true })

export function useAuth() {
    return useContext(AuthContext)
}

interface AuthenticatorProps {
    children: ReactNode;
}

export function Authenticator({ children }: AuthenticatorProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setIsLoading(false);
        });

        return unsubscribe;
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}