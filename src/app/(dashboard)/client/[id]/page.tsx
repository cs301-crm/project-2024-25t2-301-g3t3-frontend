"use client";
import { useClient } from "@/contexts/client-context";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { EditClientDialog } from "@/components/client/edit-client-dialog";
import {  Pencil, UserRoundPen } from "lucide-react";
import DeleteClientButton from "@/components/client/delete-client-dialog";
import { ClientNotFound } from "@/components/client/clientNotFound";
import { ClientLoading } from "@/components/client/clientLoading";
import { useUser } from "@/contexts/user-context";
import RecentActivities from "@/components/recent-activities/RecentActivities";
import { ReassignAgent } from "@/components/client/ReassignAgent";
import { VerifyClientButton } from "@/components/client/VerifyClientButton";

export default function ClientOverviewPage() {
  const { client, setClient, loadingClient, loadClientError } = useClient();
  const { isAdmin } = useUser();

  if (loadingClient) {
    return <ClientLoading />;
  }

  if (!client) {
    return <ClientNotFound />;
  }

  return (
    <div className="flex flex-col space-y-4 p-8">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900 items-center">
            {client && client.firstName} {client && client.lastName}
          </h1>
          {client && (
            <div className="flex space-x-2">
              {isAdmin && 
              <ReassignAgent
              agentId={client.agentId}
              onReassign={(newAgentId) => {
                setClient({ ...client, agentId: newAgentId });
              }}
              trigger={
                <Button className="cursor-pointer" size="sm" variant="outline">
                  <UserRoundPen className="h-3 w-3" />
                  Reassign Agent
                </Button>
              }
            />
              }
               {!isAdmin && (
                <VerifyClientButton
                  clientId={client.clientId}
                  verificationStatus={client.verificationStatus}
                  verificationDocumentUploaded={client.verificationDocumentUploaded}
                />
              )}
              <EditClientDialog
                client={client}
                trigger={<Button className="cursor-pointer" size="sm" variant="outline"><Pencil className="h-3 w-3"/>Edit details</Button>}
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
                    client.verificationStatus === "VERIFIED"
                      ? "bg-green-100 text-green-800"
                      : client.verificationStatus === "PENDING"
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
        </div>
      </DashboardCard>
      {client && 
      <RecentActivities clientId={client?.clientId}/>
      }
    </div>
  );
}