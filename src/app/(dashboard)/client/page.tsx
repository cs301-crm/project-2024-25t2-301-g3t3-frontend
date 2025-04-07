"use client";

import ClientsPageInner from "@/components/client/ClientsPageInner";
import React, { Suspense } from "react";
import { useUser } from '@/contexts/user-context'

export default function ClientsPage() {
  const { user, isAdmin } = useUser();

  return (
    <Suspense fallback={<div>Loading Clients...</div>}>
      <div className="flex flex-col space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-500">Create and manage {isAdmin ? "all" : "your"} client profiles</p>
        </div>
        <div className="grid gap-6">
          <ClientsPageInner agentId={user.id}/>
        </div>
      </div>
    </Suspense>
  );
}