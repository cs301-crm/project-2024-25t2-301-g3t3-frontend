"use client";

import { useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Users, CreditCard, Link as LinkIcon } from "lucide-react";
import { useRole } from "@/contexts/role-context";
import { useAgent } from "@/contexts/agent-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Agent Dashboard Component
function AgentDashboard() {
  const { recentActivities, clients } = useAgent();

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard
          title={`Dashboard Overview`}
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">
                Recent Activities Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Clients:</span>
                  <span className="font-medium">{clients.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Recent Updates:</span>
                  <span className="font-medium">{recentActivities.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last Activity:</span>
                  <span className="font-medium">
                    {recentActivities[0]?.timestamp || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Quick Actions"
          className="border-l-4 border-l-slate-700"
        >
          <div className="flex flex-col space-y-3">
            <Link href="/client/manage" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Client Management
              </Button>
            </Link>
            <Link href="/accounts" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Account Management
              </Button>
            </Link>
            <Link href="/transactions" className="w-full">
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                View Transactions
              </Button>
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard
          title="My Recent Activities"
          className="border-l-4 border-l-slate-700"
        >
          <div className="max-h-60 overflow-y-auto pr-2">
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="rounded-md border p-3 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {activity.type === "created" ? "Created" : "Updated"}{" "}
                          profile for{" "}
                          <Link
                            href={`/client/${activity.clientId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {activity.clientName}
                          </Link>
                        </p>
                        <p className="text-xs text-slate-500">
                          {activity.timestamp}
                        </p>
                      </div>
                      <LinkIcon className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent activities</p>
            )}
          </div>
          <div className="mt-3 text-center">
            <Button variant="link" size="sm" className="text-blue-600">
              View All Activities
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

// Default Dashboard Component
function DefaultDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard
        title="Recent Contacts"
        className="border-l-4 border-l-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              You have no recent contacts
            </p>
            <p className="mt-2 text-xs text-slate-400">Last updated: Today</p>
          </div>
          <Users className="h-8 w-8 text-slate-300" />
        </div>
      </DashboardCard>

      {/* Other default dashboard cards */}
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useRole();
  // const role = "admin"; // Testing conditionally rendering the dashboard based on the role
  // console.log(role);
  const { agentId, refreshData } = useAgent();

  // Refresh data when the component mounts
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {role === "agent" ? `Agent ${agentId}'s Dashboard` : "Dashboard"}
        </h1>
        <p className="text-slate-500">
          {role === "agent"
            ? `Welcome, Agent ${agentId}! Here's your Scrooge Bank CRM dashboard`
            : "Welcome to your Scrooge Bank CRM dashboard"}
        </p>
      </div>

      {role === "agent" ? <AgentDashboard /> : <DefaultDashboard />}
    </div>
  );
}
