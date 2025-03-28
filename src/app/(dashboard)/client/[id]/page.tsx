"use client";
import { useClient } from "@/contexts/client-context";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { EditClientDialog } from "@/components/client/edit-client-dialog";
import { useEffect, useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import DeleteClientButton from "@/components/client/delete-client-dialog";
import clientService from "@/lib/api/mockClientService";
import { handleApiError, LogEntry } from "@/lib/api";
import { ClientNotFound } from "@/components/client/clientNotFound";
import { ClientLoading } from "@/components/client/clientLoading";
import { useUser } from "@/contexts/user-context";
export default function ClientOverviewPage() {
  const { client, loadingClient, loadClientError } = useClient();
  const [recentActivities, setRecentActivities] = useState<LogEntry[]>();
  const [loadingActivities, setLoadingActivities] = useState<boolean>();
  const [error, setError] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    // Fetch recent activities from the API
    setLoadingActivities(true);
    const fetchRecentActivities = async () => {
      setError("")
      if(client){
        try {
          const response = await clientService.getLogsByClientId(client?.clientId)
          setRecentActivities(response);

        } catch (error) {
          setError("Failed to fetch recent activities")
          handleApiError(error);
        } finally {
          setLoadingActivities(false);
        }
      } else {
        setError("Failed to fetch recent activities");
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
  }, [client]);

  if (loadingClient) {
    return <ClientLoading />;
  }

  if (!client && !loadClientError) {
    return <ClientNotFound />;
  }

  const generateSimplifiedMessage = (log: LogEntry): string => {
    let isAccountLog = false;
  
    if (
      (log.beforeValue && (log.beforeValue.includes("accountId") || log.beforeValue.includes("accountType"))) ||
      (log.afterValue && (log.afterValue.includes("accountId") || log.afterValue.includes("accountType")))
    ) {
      isAccountLog = true;
    }
  
    const entityType = isAccountLog ? "account" : "profile";
  
    switch (log.crudType) {
      case "CREATE":
        return `Created ${entityType} for ${log.clientName}`;
      case "READ":
        return `Retrieved ${entityType} for ${log.clientName}`;
      case "UPDATE":
        if (log.attributeName && log.attributeName.includes("verificationStatus")) {
          return `Verified ${entityType} for ${log.clientName}`;
        }
        if (log.attributeName && log.attributeName.trim() !== "") {
          return `Updated ${log.attributeName.replace("|", ", ")} for ${log.clientName}`;
        }
        return `Updated ${entityType} for ${log.clientName}`;
      case "DELETE":
        return `Deleted ${entityType} for ${log.clientName}`;
      default:
        return `Operation on ${entityType} for ${log.clientName}`;
    }
  };
  return (
    <div className="flex flex-col space-y-4 p-8">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 items-center">
            {client && client.firstName} {client && client.lastName}
          </h1>
          {client && (
            <div className="flex space-x-2">
              <EditClientDialog
                client={client}
                trigger={<Button className="cursor-pointer" size="sm" variant="outline"><Pencil className="h-3 w-3"/>Edit</Button>}
              />
              <DeleteClientButton/>
            </div>
          )}
        </div>
        <p className="text-slate-500">{client?.clientId}</p>
      </div>
      
      {loadClientError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600">{loadClientError}</p>
        </div>
      )}

      <DashboardCard title="" className="border-l-4 border-l-slate-700">
        <div className="flex justify-between items-top mb-4">
          <h3 className="text-lg font-semibold">Client Details</h3>
          <div className="flex flex-col space-x-4 text-md">
            {client && client.verificationStatus && (
              <div className="flex items-center">
                 <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    client.verificationStatus === "Verified"
                      ? "bg-green-100 text-green-800"
                      : client.verificationStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {client.verificationStatus}
                </span>              
              </div>
            )}
          </div>
        </div>
        <hr></hr>
        <br></br>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">First Name</p>
            <p className="font-medium">{client && client.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Last Name</p>
            <p className="font-medium">{client && client.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date of Birth</p>
            <p className="font-medium">{client && client.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Gender</p>
            <p className="font-medium">{client && client.gender}</p>
          </div>
          <div>
          <p className="text-sm text-slate-500">NRIC</p>
          <p className="font-medium">{client && client.nric}</p>
        </div>
        </div>
        <br></br>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium">{client && client.emailAddress}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium">{client && client.phoneNumber}</p>
          </div>
        </div>
        <br></br>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Address</p>
            <p className="font-medium">{client && client.address}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">City</p>
            <p className="font-medium">{client && client.city}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">State</p>
            <p className="font-medium">{client && client.state}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Country</p>
            <p className="font-medium">{client && client.country}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Postal Code</p>
            <p className="font-medium">{client && client.postalCode}</p>
          </div>
          {client?.agentId != user.id && (
            <div>
              <p className="text-sm text-slate-500">Agent</p>
              <p className="font-medium">{client && client.agentId}</p>
            </div>
          )}
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Activities" className="border-l-4 border-l-slate-700">
        <div className="space-y-2">
          {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          <div className="max-h-[200px] overflow-y-auto">
            
          {loadingActivities ? (
            <div className="flex items-center justify-center py-4 gap-2 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading recent activities...</p>
            </div>
          ) : recentActivities && recentActivities.length > 0 ? (
            recentActivities.map((log, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 px-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <p className="text-sm text-slate-600 font-medium">
                  {generateSimplifiedMessage(log)}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {new Date(log.dateTime).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <>
              {!error && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">No recent activities</p>
                </div>

              )}
            </>
          )}



          </div>
        </div>
    </DashboardCard>
    </div>
  );
}