"use client";

import React from "react";
import { Header } from "../../components/layout/header";
import { DynamicSidebar } from "../../components/layout/DynamicSidebar";
import { ClientProvider } from "@/contexts/client-context"; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RouteGuard from "@/components/RouteGuard";

const queryClient = new QueryClient();
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RouteGuard>
      <QueryClientProvider client={queryClient}>
        <ClientProvider>
        <div className="flex flex-col h-screen bg-slate-50">
      <Header /> 
        <div className="flex flex-1 overflow-hidden">
          <DynamicSidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
        </ClientProvider>
      </QueryClientProvider>
      </RouteGuard>
  );
}
