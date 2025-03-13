"use client";

import React from "react";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { RoleProvider } from "@/contexts/role-context";
import { AgentProvider } from "@/contexts/agent-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider initialRole="agent">
      <AgentProvider>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </AgentProvider>
    </RoleProvider>
  );
}
