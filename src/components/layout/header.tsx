"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, Bell, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Branding } from "@/components/branding";
import { useUser } from "@/contexts/user-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

        <div className="flex items-center gap-2 flex-row">
          <span className="text-sm text-slate-500 inline-block">
            {!isAdmin ? `Agent ${user.fullName}` : `Admin ${user.fullName}`}
          </span>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer" size="icon" aria-label="User menu">
                <User className="h-5 w-5" />
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/resetpassword`} className="w-full cursor-pointer text-slate-700">Reset Password</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-slate-700"
                  disabled={isLoggingOut}
                  onSelect={(e) => {
                    e.preventDefault(); 
                    handleLogout();     
                  }}
                >
                  {isLoggingOut ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                  )}
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      </div>
    </header>
  );
}
