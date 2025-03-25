// "use client";

// import type React from "react";
// import { useState, useEffect, Suspense } from "react";
// import { DashboardCard } from "@/components/dashboard/dashboard-card";
// import {
//   Users,
//   Search,
//   Trash2,
//   RefreshCw,
//   ChevronDown,
//   ChevronUp,
//   UserPlus,
//   FileText,
//   Edit,
//   ToggleLeft,
//   ToggleRight,
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { AddAgentModal } from "@/components/agent-management/add-agent-modal";
// import { EditAgentModal } from "@/components/agent-management/edit-agent-modal";
// import { ViewClientsModal } from "@/components/agent-management/view-clients-modal";
// import { ViewLogsModal } from "@/components/agent-management/view-logs-modal";
// import type { Agent, Client, LogEntry } from "@/lib/api/types";

"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  Users,
  Search,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  UserPlus,
  FileText,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddAgentModal } from "@/components/agent-management/add-agent-modal";
import { OtpVerificationModal } from "@/components/agent-management/otp-verification-modal";
import { EditAgentModal } from "@/components/agent-management/edit-agent-modal";
import { ViewClientsModal } from "@/components/agent-management/view-clients-modal";
import { ViewLogsModal } from "@/components/agent-management/view-logs-modal";
import { useToast } from "@/components/ui/use-toast";
import type { Agent, Client, LogEntry } from "@/lib/api/types";

// Sample initial data
const initialAgents: Agent[] = [
  {
    id: "AG001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    status: "active",
  },
  {
    id: "AG002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    status: "active",
  },
  {
    id: "AG003",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    status: "disabled",
  },
  {
    id: "AG004",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@example.com",
    status: "active",
  },
  {
    id: "AG005",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@example.com",
    status: "active",
  },
];

// Sample clients data
const initialClients: Record<string, Client[]> = {
  AG001: [
    {
      id: "CL001",
      name: "Acme Corp",
      email: "contact@acmecorp.com",
      status: "active",
    },
    {
      id: "CL002",
      name: "Globex Inc",
      email: "info@globex.com",
      status: "active",
    },
    {
      id: "CL003",
      name: "Stark Industries",
      email: "hello@stark.com",
      status: "inactive",
    },
  ],
  AG002: [
    {
      id: "CL004",
      name: "Wayne Enterprises",
      email: "info@wayne.com",
      status: "active",
    },
    {
      id: "CL005",
      name: "Oscorp",
      email: "contact@oscorp.com",
      status: "active",
    },
  ],
  AG003: [
    {
      id: "CL006",
      name: "Umbrella Corp",
      email: "info@umbrella.com",
      status: "inactive",
    },
  ],
  AG004: [
    {
      id: "CL007",
      name: "Cyberdyne Systems",
      email: "info@cyberdyne.com",
      status: "active",
    },
    {
      id: "CL008",
      name: "Soylent Corp",
      email: "contact@soylent.com",
      status: "active",
    },
    {
      id: "CL009",
      name: "Initech",
      email: "info@initech.com",
      status: "active",
    },
  ],
  AG005: [
    {
      id: "CL010",
      name: "Massive Dynamic",
      email: "info@massivedynamic.com",
      status: "active",
    },
    {
      id: "CL011",
      name: "Tyrell Corp",
      email: "contact@tyrell.com",
      status: "inactive",
    },
  ],
};

// Sample logs data
const initialLogs: Record<string, LogEntry[]> = {
  AG001: [
    {
      timestamp: "2023-07-15T10:30:00Z",
      action: "Create Client",
      details: "Created client Acme Corp",
    },
    {
      timestamp: "2023-07-16T14:45:00Z",
      action: "Update Info",
      details: "Updated contact information for Globex Inc",
    },
    {
      timestamp: "2023-07-18T09:15:00Z",
      action: "Create Client",
      details: "Created client Stark Industries",
    },
  ],
  AG002: [
    {
      timestamp: "2023-07-10T11:20:00Z",
      action: "Create Client",
      details: "Created client Wayne Enterprises",
    },
    {
      timestamp: "2023-07-12T16:30:00Z",
      action: "Create Client",
      details: "Created client Oscorp",
    },
    {
      timestamp: "2023-07-14T13:45:00Z",
      action: "Login",
      details: "Agent logged in",
    },
  ],
  AG003: [
    {
      timestamp: "2023-07-05T10:15:00Z",
      action: "Create Client",
      details: "Created client Umbrella Corp",
    },
    {
      timestamp: "2023-07-08T09:30:00Z",
      action: "Login",
      details: "Agent logged in",
    },
  ],
  AG004: [
    {
      timestamp: "2023-07-01T14:20:00Z",
      action: "Create Client",
      details: "Created client Cyberdyne Systems",
    },
    {
      timestamp: "2023-07-03T11:45:00Z",
      action: "Create Client",
      details: "Created client Soylent Corp",
    },
    {
      timestamp: "2023-07-05T16:30:00Z",
      action: "Create Client",
      details: "Created client Initech",
    },
    {
      timestamp: "2023-07-07T10:15:00Z",
      action: "Update Info",
      details: "Updated contact information for Cyberdyne Systems",
    },
  ],
  AG005: [
    {
      timestamp: "2023-07-02T09:30:00Z",
      action: "Create Client",
      details: "Created client Massive Dynamic",
    },
    {
      timestamp: "2023-07-04T15:45:00Z",
      action: "Create Client",
      details: "Created client Tyrell Corp",
    },
    {
      timestamp: "2023-07-06T11:20:00Z",
      action: "Login",
      details: "Agent logged in",
    },
  ],
};

function AgentManagementInner() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [clients, setClients] =
    useState<Record<string, Client[]>>(initialClients);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingClientsAgent, setViewingClientsAgent] = useState<Agent | null>(
    null
  );
  const [viewingLogsAgent, setViewingLogsAgent] = useState<Agent | null>(null);

  // OTP verification states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingAgent, setPendingAgent] = useState<Omit<Agent, "id"> | null>(
    null
  );
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Refresh data when the component mounts
  useEffect(() => {
    const handleInitialLoad = async () => {
      await refreshData();
    };

    handleInitialLoad();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would fetch data from an API here
      // For now, we'll just use the initial data
      setAgents(initialAgents);
      setClients(initialClients);
      setLogs(initialLogs);
    } catch (err) {
      setError("Failed to load agent data. Please try again.");
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter((agent) => {
    const searchLower = searchQuery.trim().toLowerCase();

    // If search is empty after trimming, show all agents
    if (searchLower === "") return true;

    return (
      agent.firstName.toLowerCase().includes(searchLower) ||
      agent.lastName.toLowerCase().includes(searchLower) ||
      `${agent.firstName.toLowerCase()} ${agent.lastName.toLowerCase()}`.includes(
        searchLower
      ) ||
      agent.email.toLowerCase().includes(searchLower) ||
      agent.id.toLowerCase().includes(searchLower)
    );
  });

  const handleAddAgent = (
    newAgent: Omit<Agent, "id">,
    showOtpVerification: boolean
  ) => {
    if (showOtpVerification) {
      // Store the agent data and show OTP verification modal
      setPendingAgent(newAgent);
      setIsOtpModalOpen(true);
      setIsAddAgentOpen(false);

      // In a real app, you would send an OTP to the admin's email or phone here
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email.",
      });
    } else {
      // Direct creation without OTP (not used in current flow)
      completeAgentCreation(newAgent);
    }
  };

  const handleVerifyOtp = (otp: string) => {
    if (!pendingAgent) return;

    setIsVerifyingOtp(true);
    setOtpError(null);

    // Simulate OTP verification with a delay
    setTimeout(() => {
      // For demo purposes, we'll consider "123456" as the correct OTP
      if (otp === "123456") {
        completeAgentCreation(pendingAgent);
        setIsOtpModalOpen(false);
        setPendingAgent(null);
        toast({
          title: "Agent Created",
          description: "The agent has been created successfully.",
        });
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
      setIsVerifyingOtp(false);
    }, 1500);
  };

  const handleResendOtp = () => {
    // In a real app, you would resend the OTP here
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your email.",
    });
  };

  const completeAgentCreation = (newAgent: Omit<Agent, "id">) => {
    const agentId = `AG${String(agents.length + 1).padStart(3, "0")}`;
    const agent: Agent = {
      ...newAgent,
      id: agentId,
    };
    setAgents([...agents, agent]);
    setClients({ ...clients, [agentId]: [] });
    setLogs({ ...logs, [agentId]: [] });
  };

  const handleUpdateAgent = (updatedAgent: Agent) => {
    setAgents(
      agents.map((agent) =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      )
    );
    setEditingAgent(null);
  };

  const handleDeleteAgent = (id: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      setAgents(agents.filter((agent) => agent.id !== id));

      // Handle associated clients and logs
      const newClients = { ...clients };
      delete newClients[id];
      setClients(newClients);

      const newLogs = { ...logs };
      delete newLogs[id];
      setLogs(newLogs);
    }
  };

  const handleToggleStatus = (id: string) => {
    setAgents(
      agents.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              status: agent.status === "active" ? "disabled" : "active",
            }
          : agent
      )
    );
  };

  const handleResetPassword = (id: string) => {
    // In a real application, this would trigger a password reset flow
    console.log(`Password reset requested for agent ${id}`);

    // Add a log entry for the password reset
    const now = new Date().toISOString();
    setLogs((prevLogs) => ({
      ...prevLogs,
      [id]: [
        {
          timestamp: now,
          action: "Reset Password",
          details: "Password was reset by admin",
        },
        ...prevLogs[id],
      ],
    }));
  };

  const getAgentClients = (agentId: string) => {
    return clients[agentId] || [];
  };

  const toggleAgentExpand = (agentId: string) => {
    if (expandedAgent === agentId) {
      setExpandedAgent(null);
    } else {
      setExpandedAgent(agentId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, agentId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAgentExpand(agentId);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Agent Management</h1>
        <p className="text-slate-500">Create and manage your agent profiles</p>
      </div>

      <div className="grid gap-6">
        <DashboardCard
          title="Agent Overview"
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">Agent Summary</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Agents:</span>
                    <span className="font-medium">{agents.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Agents:</span>
                    <span className="font-medium">
                      {
                        agents.filter((agent) => agent.status === "active")
                          .length
                      }
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Disabled Agents:</span>
                    <span className="font-medium">
                      {
                        agents.filter((agent) => agent.status === "disabled")
                          .length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Agent List"
          className="border-l-4 border-l-slate-700 col-span-2"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button size="sm" onClick={() => setIsAddAgentOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Agent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refreshData()}
                disabled={loading}
              >
                <RefreshCw
                  className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search agents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading agents...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {filteredAgents.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="rounded-md border p-3 hover:bg-slate-50"
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleAgentExpand(agent.id)}
                          onKeyDown={(e) => handleKeyDown(e, agent.id)}
                          aria-expanded={expandedAgent === agent.id}
                          aria-controls={`agent-details-${agent.id}`}
                        >
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium">
                                {agent.firstName} {agent.lastName}
                              </p>
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                  agent.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {agent.status === "active"
                                  ? "Active"
                                  : "Disabled"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {agent.email}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {agent.id}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {expandedAgent === agent.id ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {expandedAgent === agent.id && (
                          <div
                            id={`agent-details-${agent.id}`}
                            className="mt-3 border-t pt-3"
                          >
                            <div className="mb-2">
                              <h4 className="text-sm font-medium">
                                Client Management
                              </h4>
                            </div>

                            {getAgentClients(agent.id).length > 0 ? (
                              <div className="space-y-2">
                                {getAgentClients(agent.id).map((client) => (
                                  <div
                                    key={client.id}
                                    className="rounded-md bg-slate-50 p-2 text-xs"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">
                                        {client.name}
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        <span
                                          className={`${
                                            client.status === "active"
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {client.status === "active"
                                            ? "Active"
                                            : "Inactive"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-1">
                                      <span>{client.email}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic">
                                No clients assigned to this agent
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-2 flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingClientsAgent(agent);
                            }}
                          >
                            <Users className="mr-1 h-3 w-3" />
                            View Clients
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingLogsAgent(agent);
                            }}
                          >
                            <FileText className="mr-1 h-3 w-3" />
                            View Logs
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAgent(agent);
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(agent.id);
                            }}
                          >
                            {agent.status === "active" ? (
                              <>
                                <ToggleRight className="mr-1 h-3 w-3" />
                                Disable
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-1 h-3 w-3" />
                                Enable
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAgent(agent.id);
                            }}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <Users className="h-12 w-12 text-slate-300" />
                    <p className="text-sm text-slate-500">No agents found</p>
                    <Button onClick={() => setIsAddAgentOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New Agent
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Add Agent Modal */}
      <AddAgentModal
        open={isAddAgentOpen}
        onOpenChange={setIsAddAgentOpen}
        onAddAgent={handleAddAgent}
      />

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        open={isOtpModalOpen}
        onOpenChange={(open) => {
          setIsOtpModalOpen(open);
          if (!open) {
            setPendingAgent(null);
            setOtpError(null);
          }
        }}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        isVerifying={isVerifyingOtp}
        error={otpError}
      />

      {editingAgent && (
        <EditAgentModal
          agent={editingAgent}
          open={!!editingAgent}
          onOpenChange={(open) => !open && setEditingAgent(null)}
          onUpdateAgent={handleUpdateAgent}
          onResetPassword={handleResetPassword}
        />
      )}

      {viewingClientsAgent && (
        <ViewClientsModal
          agent={viewingClientsAgent}
          clients={clients[viewingClientsAgent.id] || []}
          open={!!viewingClientsAgent}
          onOpenChange={(open) => !open && setViewingClientsAgent(null)}
        />
      )}

      {viewingLogsAgent && (
        <ViewLogsModal
          agent={viewingLogsAgent}
          logs={logs[viewingLogsAgent.id] || []}
          open={!!viewingLogsAgent}
          onOpenChange={(open) => !open && setViewingLogsAgent(null)}
        />
      )}
    </div>
  );
}

export default function AgentManagementPage() {
  return (
    <Suspense fallback={<div>Loading Agent Management Page...</div>}>
      <AgentManagementInner />
    </Suspense>
  );
}
