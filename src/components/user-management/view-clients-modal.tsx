"use client";

import type { User, Client } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClientsPageInner from "../client/ClientsPageInner";

interface ViewClientsModalProps {
  agent: User;
  clients: Client[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewClientsModal({
  agent,
  open,
  onOpenChange,
}: ViewClientsModalProps) {
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
        <div className="min-h-[300px]">
          <ClientsPageInner agentId={agent.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
