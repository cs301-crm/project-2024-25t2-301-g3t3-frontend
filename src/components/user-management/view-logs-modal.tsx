"use client";

import type { User, LogEntry } from "@/lib/api/types";
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
  agent: User;
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
      log.crudType.toLowerCase().includes(searchLower) ||
      (log.clientName && log.clientName.toLowerCase().includes(searchLower)) ||
      (log.attributeName &&
        log.attributeName.toLowerCase().includes(searchLower)) ||
      (log.afterValue && log.afterValue.toLowerCase().includes(searchLower)) ||
      (log.beforeValue && log.beforeValue.toLowerCase().includes(searchLower))
    );
  });

  // Sort logs by dateTime (newest first)
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  // Format dateTime to a more readable format
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
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
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Attribute</TableHead>
                  <TableHead>Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {logs.length === 0
                        ? "No activity logs for this agent"
                        : "No logs found matching your search"}
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDateTime(log.dateTime)}
                      </TableCell>
                      <TableCell>
                        {log.clientName || (
                          <span className="text-muted-foreground italic">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.crudType}</span>
                      </TableCell>
                      <TableCell>{log.attributeName || "-"}</TableCell>
                      <TableCell>
                        {log.beforeValue ? (
                          <span>
                            <span className="text-red-500 line-through mr-2">
                              {log.beforeValue}
                            </span>
                            <span className="text-green-500">
                              {log.afterValue}
                            </span>
                          </span>
                        ) : (
                          <span>{log.afterValue || "-"}</span>
                        )}
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
