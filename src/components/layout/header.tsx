"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, Bell, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Branding } from "@/components/branding";
import { useUser } from "@/contexts/user-context";

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, isAdmin, logoutUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser(); 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="hidden md:flex md:items-center md:gap-2">
        <Link href="/dashboard" className="flex items-center">
          <Branding size="sm" showTagline={false} layout="horizontal" />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" className="cursor-pointer" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-slate-500 md:inline-block">
            {!isAdmin ? `Agent ${user.fullName}` : `Admin ${user.fullName}`}
          </span>
          <Button variant="ghost" className="cursor-pointer" size="icon" aria-label="User menu">
            <User className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative group">
          <Button
            variant="ghost"
            className="cursor-pointer"
            size="icon"
            aria-label="Log out"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
          </Button>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Logout
          </span>
        </div>
      </div>
    </header>
  );
}
