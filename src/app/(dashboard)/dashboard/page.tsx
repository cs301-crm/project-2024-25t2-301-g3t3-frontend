"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Users, CreditCard, Link as LinkIcon, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { handleApiError, LogEntry } from "@/lib/api";
import clientService from "@/lib/api/mockClientService";
// Agent Dashboard Component
function AgentDashboard() {
  const { user } = useUser();
  //const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string>("");
  const [recentActivities, setRecentActivities ] = useState<LogEntry[]>();
  const [loadingActivities, setLoadingActivities] = useState<boolean>(true);
  // const fetchClients = async () => {

  //   setLoading(true);
  //   try{
  //     const fetchedClients = await clientService.getClientsByAgentId(user.id);

  //     setClients(fetchedClients);
      
  //   } catch (err){
  //     handleApiError(err);
  //     setError("Unable to fetch clients");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  useEffect(() => {
    // Fetch recent activities from the API
    
    const fetchRecentActivities = async () => {
      if (user) {
        try {
          setLoadingActivities(true);
          const response = await clientService.getLogsByAgentId(user.id);
          setRecentActivities(response);
        } catch (error) {
          setError("Failed to fetch recent activities");
          handleApiError(error);
        } finally {
          setLoadingActivities(false);
        }
      }
    };

    fetchRecentActivities();
  }, [user]);


  // useEffect(() => {
  //   fetchClients();
  //   fetchRecentActivities();
  // }, []);

  const generateSimplifiedMessage = (log: LogEntry): { message: string; clientName: string; clientId: string } => {
    let isAccountLog = false;
  
    if (
      (log.beforeValue && (log.beforeValue.includes("accountId") || log.beforeValue.includes("accountType"))) ||
      (log.afterValue && (log.afterValue.includes("accountId") || log.afterValue.includes("accountType")))
    ) {
      isAccountLog = true;
    }
  
    const entityType = isAccountLog ? "account" : "profile";
    let message = '';
  
    switch (log.crudType) {
      case "CREATE":
        message = `Created ${entityType} for `;
        break;
      case "READ":
        message = `Retrieved ${entityType} for `;
        break;
      case "UPDATE":
        if (log.attributeName && log.attributeName.includes("verificationStatus")) {
          message = `Verified ${entityType} for `;
        } else if (log.attributeName && log.attributeName.trim() !== "") {
          message = `Updated ${log.attributeName.replace("|", ", ")} for `;
        } else {
          message = `Updated ${entityType} for `;
        }
        break;
      case "DELETE":
        message = `Deleted ${entityType} for `;
        break;
      default:
        message = `Operation on ${entityType} for `;
    }
  
    return {
      message,
      clientName: log.clientName,
      clientId: log.clientId
    };
  };

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
                {/* {!loading && (
                  <>
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Clients:</span>
                    <span className="font-medium">{clients?.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Recent Updates:</span>
                    <span className="font-medium">{recentActivities?.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Activity:</span>
                    <span className="font-medium">
                      {recentActivities && recentActivities[0]?.timestamp || "N/A"}
                    </span>
                  </div>
                  </>
                )} */}
                {/* {loading && (
                  <>
                  <div className="flex items-center justify-between text-sm">
                    <span>Loading Summary:</span>
                  </div>
                  </>
                )} */}
             
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Quick Actions"
          className="border-l-4 border-l-slate-700"
        >
          <div className="flex flex-col space-y-3">
            <Link href="/client" className="w-full">
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
           {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          <div className="max-h-60 overflow-y-auto pr-2">
            {loadingActivities ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-slate-500">Loading activities...</span>
              </div>
            ) : recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((log, index) => {
                  const { message, clientName, clientId } = generateSimplifiedMessage(log);
                  return (
                    <div
                      key={index}
                      className="rounded-md border p-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {message}
                            <Link
                              href={`/client/${clientId}`}
                              className="text-blue-600 font-medium hover:underline"
                            >
                              {clientName}
                            </Link>
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.dateTime).toLocaleString()}
                          </p>
                        </div>
                        <LinkIcon className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent activities</p>
            )}
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
  const { role } = useUser();
  // const role = "admin"; // Testing conditionally rendering the dashboard based on the role
  // console.log(role);
  const { user } = useUser();

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {role === "agent" ? `Agent ${user.id}'s Dashboard` : "Dashboard"}
        </h1>
        <p className="text-slate-500">
          {role === "agent"
            ? `Welcome, Agent ${user.id}! Here's your Scrooge Bank CRM dashboard`
            : "Welcome to your Scrooge Bank CRM dashboard"}
        </p>
      </div>

      {role === "agent" ? <AgentDashboard /> : <DefaultDashboard />}
    </div>
  );
}
