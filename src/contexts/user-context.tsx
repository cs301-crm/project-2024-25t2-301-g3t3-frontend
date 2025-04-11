"use client";

import { userService } from "@/lib/api/userService";
import { UserContextDTO } from "@/lib/api/types";
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";


// Define the context type
interface UserContextType {
  user: UserContextDTO;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: UserContextDTO) => void;
  logoutUser: () => void;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  // const defaultUser = {
  //   userId: "",
  //   role: "",
  //   fullName: ""
  // }

  const testUser = {
    userId: "agent001",
    role: "ROLE_ADMIN",
    fullName: "John Champion"
  }
  const router = useRouter();
  const [user, setUser] = useState<UserContextDTO>(testUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 


  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  
    try {
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
  
        const isValid =
          typeof parsedUser.userId === "string" &&
          parsedUser.userId.trim() !== "" &&
          typeof parsedUser.role === "string" &&
          parsedUser.role.trim() !== "" &&
          typeof parsedUser.fullName === "string" &&
          parsedUser.fullName.trim() !== "";
  
        if (isValid) {
          setUser(parsedUser);
        } else {
          console.warn("Invalid or empty user data in localStorage. Clearing it.");
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error("Error parsing stored user:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.userId && user.role && user.fullName) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    setIsAdmin(user?.role === "ROLE_ADMIN");
  }, [user]);

  const logoutUser = async () => {
    try {
      await userService.logout();
      toast({
        title: "Success",
        description: `Logged out successfully`,
      });
      router.push("/login");
      setUser({ userId: "", role: "", fullName: "" });
      localStorage.removeItem("user");
      setIsAdmin(false);
    } catch (err) {
      console.error("Logout failed", err);
      toast({
        title: "Error",
        description: `Failed to logout, please try again`,
        variant: "destructive"
      });
    }
  };

  const contextValue = useMemo(() => ({
    user,
    loading,
    isAdmin,
    setUser,
    logoutUser
  }), [user, loading, isAdmin]);
  
  return (
    <UserContext.Provider value={contextValue}>
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