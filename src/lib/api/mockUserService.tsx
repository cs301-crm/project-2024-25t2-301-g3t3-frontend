import { AdminLogEntry } from "./types";

// Mock admin logs data
const mockAdminLogs: AdminLogEntry[] = [
  {
    log_id: "log-001",
    actor: "admin001",
    transaction_type: "POST",
    action: "Created new client record",
    timestamp: "2024-03-01T10:00:00Z"
  },
  {
    log_id: "log-002",
    actor: "admin002",
    transaction_type: "PUT",
    action: "Updated client profile",
    timestamp: "2024-03-02T12:30:00Z"
  },
  {
    log_id: "log-003",
    actor: "admin001",
    transaction_type: "DELETE",
    action: "Removed account",
    timestamp: "2024-03-03T09:15:00Z"
  },
  {
    log_id: "log-004",
    actor: "admin003",
    transaction_type: "GET",
    action: "Fetched transaction list",
    timestamp: "2024-03-04T16:20:00Z"
  },
  {
    log_id: "log-005",
    actor: "admin001",
    transaction_type: "POST",
    action: "Created admin user",
    timestamp: "2024-03-05T11:00:00Z"
  },
  {
    log_id: "log-006",
    actor: "admin002",
    transaction_type: "PUT",
    action: "Updated password policy",
    timestamp: "2024-03-06T14:45:00Z"
  },
  {
    log_id: "log-007",
    actor: "admin001",
    transaction_type: "DELETE",
    action: "Deleted inactive users",
    timestamp: "2024-03-07T08:10:00Z"
  },
  {
    log_id: "log-008",
    actor: "admin003",
    transaction_type: "POST",
    action: "Created new role",
    timestamp: "2024-03-08T15:00:00Z"
  },
  {
    log_id: "log-009",
    actor: "admin001",
    transaction_type: "PUT",
    action: "Modified system settings",
    timestamp: "2024-03-09T13:25:00Z"
  },
  {
    log_id: "log-010",
    actor: "admin002",
    transaction_type: "GET",
    action: "Viewed audit logs",
    timestamp: "2024-03-10T17:55:00Z"
  }
];

// Simulate API delay
const simulateApiDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

const userService = {
  /**
   * Fetch paginated and searchable admin logs
   */
  getAdminLogs: async (
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<AdminLogEntry[]> => {
    await simulateApiDelay();

    const filtered = mockAdminLogs.filter(
      (log) =>
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.transaction_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }
};

export default userService;
