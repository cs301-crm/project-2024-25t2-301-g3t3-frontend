"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the available roles
export type UserRole = "agent" | "admin";

// Define the context type
interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

// Create the context with a default value
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Create a provider component
export function RoleProvider({ children, initialRole = "agent" }: { children: ReactNode; initialRole?: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

// Create a hook to use the role context
export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
