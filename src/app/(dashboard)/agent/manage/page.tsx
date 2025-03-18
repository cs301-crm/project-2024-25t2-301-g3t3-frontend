"use client";

import { useState } from "react";
import { AgentTable } from "@/components/agent-management/agent-table";
import { AddAgentModal } from "@/components/agent-management/add-agent-modal";
import { EditAgentModal } from "@/components/agent-management/edit-agent-modal";
import { ViewClientsModal } from "@/components/agent-management/view-clients-modal";
import { ViewLogsModal } from "@/components/agent-management/view-logs-modal";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
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

export default function AgentManagementPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [clients, setClients] =
    useState<Record<string, Client[]>>(initialClients);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>(initialLogs);

  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingClientsAgent, setViewingClientsAgent] = useState<Agent | null>(
    null
  );
  const [viewingLogsAgent, setViewingLogsAgent] = useState<Agent | null>(null);

  const handleAddAgent = (newAgent: Omit<Agent, "id">) => {
    const agentId = `AG${String(agents.length + 1).padStart(3, "0")}`;
    const agent: Agent = {
      ...newAgent,
      id: agentId,
    };
    setAgents([...agents, agent]);
    setClients({ ...clients, [agentId]: [] });
    setLogs({ ...logs, [agentId]: [] });
    setIsAddAgentOpen(false);
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
    setAgents(agents.filter((agent) => agent.id !== id));

    // In a real application, you might want to handle associated clients and logs differently
    const newClients = { ...clients };
    delete newClients[id];
    setClients(newClients);

    const newLogs = { ...logs };
    delete newLogs[id];
    setLogs(newLogs);
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        <Button onClick={() => setIsAddAgentOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Agent
        </Button>
      </div>

      <AgentTable
        agents={agents}
        onEdit={setEditingAgent}
        onDelete={handleDeleteAgent}
        onToggleStatus={handleToggleStatus}
        onViewClients={setViewingClientsAgent}
        onViewLogs={setViewingLogsAgent}
      />

      <AddAgentModal
        open={isAddAgentOpen}
        onOpenChange={setIsAddAgentOpen}
        onAddAgent={handleAddAgent}
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
