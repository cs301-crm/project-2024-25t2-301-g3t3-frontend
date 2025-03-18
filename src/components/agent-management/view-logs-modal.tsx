"use client";

import type { Agent, LogEntry } from "@/lib/api/types";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface ViewLogsModalProps {
  agent: Agent;
  logs: LogEntry[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLogsModal({
  agent,
  logs,
  open,
  onOpenChange,
}: ViewLogsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase();

    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.details.toLowerCase().includes(searchLower)
    );
  });

  // Sort logs by timestamp (newest first)
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Format timestamp to a more readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

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
        <div className="space-y-4 py-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {logs.length === 0
                        ? "No activity logs for this agent"
                        : "No logs found matching your search"}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
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
