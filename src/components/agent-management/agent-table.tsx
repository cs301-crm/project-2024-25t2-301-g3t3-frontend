"use client";

import type { Agent } from "@/lib/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  FileText,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AgentTableProps {
  agents: Agent[];
  onEdit: (agent: Agent) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onViewClients: (agent: Agent) => void;
  onViewLogs: (agent: Agent) => void;
}

export function AgentTable({
  agents,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewClients,
  onViewLogs,
}: AgentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);

  const filteredAgents = agents.filter((agent) => {
    const fullName = `${agent.firstName} ${agent.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower) ||
      agent.id.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = () => {
    if (deletingAgentId) {
      onDelete(deletingAgentId);
      setDeletingAgentId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agent ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No agents found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.id}</TableCell>
                  <TableCell>{agent.firstName}</TableCell>
                  <TableCell>{agent.lastName}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        agent.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {agent.status === "active" ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewClients(agent)}
                        title="View Clients"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewLogs(agent)}
                        title="View Logs"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(agent)}
                        title="Edit Agent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          agent.status === "active" ? "outline" : "default"
                        }
                        size="sm"
                        onClick={() => onToggleStatus(agent.id)}
                        title={
                          agent.status === "active"
                            ? "Disable Agent"
                            : "Enable Agent"
                        }
                      >
                        {agent.status === "active" ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingAgentId(agent.id)}
                        title="Delete Agent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deletingAgentId}
        onOpenChange={(open) => !open && setDeletingAgentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              agent and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
