"use client";

import type { Agent, Client } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface ViewClientsModalProps {
  agent: Agent;
  clients: Client[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewClientsModal({
  agent,
  clients,
  open,
  onOpenChange,
}: ViewClientsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            Clients for {agent.firstName} {agent.lastName}
          </DialogTitle>
          <DialogDescription>
            Viewing all clients assigned to this agent.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {clients.length === 0
                        ? "No clients assigned to this agent"
                        : "No clients found matching your search"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            client.status === "active"
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-red-500 hover:bg-red-600"
                          }
                        >
                          {client.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
