"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the available roles
export type UserRole = "agent" | "admin";

interface User {
  id: string
}

// Define the context type
interface UserContextType {
  role: UserRole;
  user: User
  isAdmin: boolean;
  setRole: (role: UserRole) => void;
  setUser: (user: User) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export function UserProvider({
  children,
  initialRole = "admin",
}: {
  children: ReactNode;
  initialRole?: UserRole;
}) {
  const testUser = {
    id: "agent001"
  }
  const [role, setRole] = useState<UserRole>(initialRole);
  const [user, setUser] = useState<User>(testUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if(role && role === "admin"){
      setIsAdmin(true);
    }
  }, [role]);
  
  return (
    <UserContext.Provider value={{ role, user, isAdmin, setRole, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Create a hook to use the role context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
