"use client";

import { UserContextDTO } from "@/lib/api/types";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";


// Define the context type
interface UserContextType {
  user: UserContextDTO;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: UserContextDTO) => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  // const defaultUser = {
  //   userid: "",
  //   role: "",
  //   fullName: ""
  // }

  const testUser = {
    userId: "agent001",
    role: "ROLE_ADMIN",
    fullName: "John Champion"
  }

  const [user, setUser] = useState<UserContextDTO>(testUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 
  // Load user from localStorage on first render

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    setIsAdmin(user?.role === "ROLE_ADMIN");
  }, [user]);

  
  return (
    <UserContext.Provider value={{ user, loading, isAdmin, setUser }}>
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