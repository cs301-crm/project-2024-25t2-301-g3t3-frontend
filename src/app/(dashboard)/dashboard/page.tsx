"use client";

import { useUser } from "@/contexts/user-context";
// import { DashboardCard } from "@/components/dashboard/dashboard-card";
import RecentActivities from "@/components/recent-activities/RecentActivities";
import Communications from "@/components/communications/Communications";
import AdminLogs from "@/components/dashboard/AdminLogs";
import { Loader2 } from "lucide-react";

function AgentDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* <DashboardCard
        title="Dashboard Overview"
        className="col-span-2 border-l-4 border-l-slate-700"
      >
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-medium">Recent Activities Summary</h3>
            <div className="space-y-2">
             
            </div>
          </div>
        </div>
      </DashboardCard> */}

      <RecentActivities />
      <Communications />
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* <DashboardCard
        title="Dashboard Overview"
        className="col-span-2 border-l-4 border-l-slate-700"
      >
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-medium">Admin Dashboard Summary</h3>
            <div className="space-y-2">
            
            </div>
          </div>
        </div>
      </DashboardCard> */}

      <AdminLogs />
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-5 w-5 text-slate-500 mr-2"/>
        <p className="text-sm text-slate-500">Loading dashboard</p>
      </div>
    );
  }

  const heading = !isAdmin ? `Agent ${user.fullName}'s Dashboard` : "Admin Dashboard";
  const subtitle = !isAdmin
    ? `Welcome, Agent ${user.fullName}! Here's your Scrooge Bank CRM dashboard`
    : "Welcome to your Scrooge Bank CRM dashboard";

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
        <p className="text-slate-500">{subtitle}</p>
      </div>

      {!isAdmin ? <AgentDashboard /> : <AdminDashboard />}
    </div>
  );
}
