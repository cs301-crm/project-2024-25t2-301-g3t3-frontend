"use client";

import type { User, LogEntry } from "@/lib/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RecentActivitiesByAgent from "../recent-activities/RecentActivitiesByAgent";

interface ViewLogsModalProps {
  agent: User;
  logs: LogEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLogsModal({
  agent,
  open,
  onOpenChange,
}: ViewLogsModalProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            Activity Logs for {agent.firstName} {agent.lastName}
          </DialogTitle>
          <DialogDescription>
            Viewing all activity logs for this agent.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[300px]">
           <RecentActivitiesByAgent agentId={agent.id}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
