"use client";

import { useUser } from "@/contexts/user-context";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import RecentActivities from "@/components/recent-activities/RecentActivities";
import Communications from "@/components/communications/Communications";
import AdminLogs from "@/components/dashboard/AdminLogs";

function AgentDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DashboardCard
        title="Dashboard Overview"
        className="col-span-2 border-l-4 border-l-slate-700"
      >
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-medium">Recent Activities Summary</h3>
            <div className="space-y-2">
              {/* Add actual summary stats here when ready */}
            </div>
          </div>
        </div>
      </DashboardCard>

      <RecentActivities />
      <Communications />
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <DashboardCard
        title="Dashboard Overview"
        className="col-span-2 border-l-4 border-l-slate-700"
      >
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="mb-2 text-sm font-medium">Admin Dashboard Summary</h3>
            <div className="space-y-2">
              {/* Add admin-specific summary here */}
            </div>
          </div>
        </div>
      </DashboardCard>

      <AdminLogs />
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useUser();
  const heading = !isAdmin ? `Agent ${user.userid}'s Dashboard` : "Admin Dashboard";
  const subtitle = !isAdmin
    ? `Welcome, Agent ${user.userid}! Here's your Scrooge Bank CRM dashboard`
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
