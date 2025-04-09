import type {
  User,
  Client,
  LogEntry,
  CreateUserRequestDTO,
  AdminLogEntry,
  Agent,
} from "./types";

// -----------------------------------------------------------------------------
// Admin logs section
// -----------------------------------------------------------------------------

// Mock admin logs data
const mockAdminLogs: AdminLogEntry[] = [
  {
    log_id: "log-001",
    actor: "admin001",
    transaction_type: "POST",
    action: "Created new client record",
    timestamp: "2024-03-01T10:00:00Z",
  },
  {
    log_id: "log-002",
    actor: "admin002",
    transaction_type: "PUT",
    action: "Updated client profile",
    timestamp: "2024-03-02T12:30:00Z",
  },
  {
    log_id: "log-003",
    actor: "admin001",
    transaction_type: "DELETE",
    action: "Removed account",
    timestamp: "2024-03-03T09:15:00Z",
  },
  {
    log_id: "log-004",
    actor: "admin003",
    transaction_type: "GET",
    action: "Fetched transaction list",
    timestamp: "2024-03-04T16:20:00Z",
  },
  {
    log_id: "log-005",
    actor: "admin001",
    transaction_type: "POST",
    action: "Created admin user",
    timestamp: "2024-03-05T11:00:00Z",
  },
  {
    log_id: "log-006",
    actor: "admin002",
    transaction_type: "PUT",
    action: "Updated password policy",
    timestamp: "2024-03-06T14:45:00Z",
  },
  {
    log_id: "log-007",
    actor: "admin001",
    transaction_type: "DELETE",
    action: "Deleted inactive users",
    timestamp: "2024-03-07T08:10:00Z",
  },
  {
    log_id: "log-008",
    actor: "admin003",
    transaction_type: "POST",
    action: "Created new role",
    timestamp: "2024-03-08T15:00:00Z",
  },
  {
    log_id: "log-009",
    actor: "admin001",
    transaction_type: "PUT",
    action: "Modified system settings",
    timestamp: "2024-03-09T13:25:00Z",
  },
  {
    log_id: "log-010",
    actor: "admin002",
    transaction_type: "GET",
    action: "Viewed audit logs",
    timestamp: "2024-03-10T17:55:00Z",
  },
];

// Simulate API delay
const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 300));

/**
 * Fetch paginated and searchable admin logs
 */
export const getAdminLogs = async (
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
};

// -----------------------------------------------------------------------------
// Users, Clients, and Logs section
// -----------------------------------------------------------------------------

// Extend the existing agents data to include role
const users: User[] = [
  {
    id: "AG001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    status: "active",
    role: "agent",
  },
  {
    id: "AG002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com",
    status: "active",
    role: "agent",
  },
  {
    id: "AG003",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    status: "disabled",
    role: "agent",
  },
  {
    id: "AG004",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@example.com",
    status: "active",
    role: "agent",
  },
  {
    id: "AG005",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@example.com",
    status: "active",
    role: "agent",
  },
  // Add some admin users
  {
    id: "AD001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    status: "active",
    role: "admin",
  },
  {
    id: "AD002",
    firstName: "System",
    lastName: "Administrator",
    email: "sysadmin@example.com",
    status: "active",
    role: "admin",
  },
];

const clients: Record<string, Client[]> = {
  AG001: [
    {
      clientId: "CL001",
      firstName: "John",
      lastName: "Doe",
      emailAddress: "john.doe@acmecorp.com",
      phoneNumber: "+1-555-123-4567",
      address: "123 Main St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94105",
      agentId: "AG001",
      verificationStatus: "verified",
    },
    {
      clientId: "CL002",
      firstName: "Jane",
      lastName: "Smith",
      emailAddress: "jane.smith@globex.com",
      dateOfBirth: "1985-06-15",
      gender: "Female",
      phoneNumber: "+1-555-987-6543",
      address: "456 Market St",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94103",
      agentId: "AG001",
      verificationStatus: "verified",
    },
    {
      clientId: "CL003",
      firstName: "Tony",
      lastName: "Stark",
      emailAddress: "tony@stark.com",
      phoneNumber: "+1-555-467-8901",
      address: "10880 Malibu Point",
      city: "Malibu",
      state: "CA",
      country: "USA",
      postalCode: "90265",
      agentId: "AG001",
      verificationStatus: "pending",
    },
  ],
  AG002: [
    {
      clientId: "CL004",
      firstName: "Bruce",
      lastName: "Wayne",
      emailAddress: "bruce@wayne.com",
      phoneNumber: "+1-555-234-5678",
      address: "1007 Mountain Drive",
      city: "Gotham",
      state: "NJ",
      country: "USA",
      postalCode: "07001",
      agentId: "AG002",
      verificationStatus: "verified",
    },
    {
      clientId: "CL005",
      firstName: "Norman",
      lastName: "Osborn",
      emailAddress: "norman@oscorp.com",
      phoneNumber: "+1-555-345-6789",
      address: "5th Avenue",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
      agentId: "AG002",
      verificationStatus: "verified",
    },
  ],
  AG003: [
    {
      clientId: "CL006",
      firstName: "Albert",
      lastName: "Wesker",
      emailAddress: "wesker@umbrella.com",
      phoneNumber: "+1-555-456-7890",
      address: "123 Raccoon St",
      city: "Raccoon City",
      state: "MI",
      country: "USA",
      postalCode: "48201",
      agentId: "AG003",
      verificationStatus: "rejected",
    },
  ],
  AG004: [
    {
      clientId: "CL007",
      firstName: "Miles",
      lastName: "Dyson",
      emailAddress: "miles@cyberdyne.com",
      phoneNumber: "+1-555-567-8901",
      address: "18144 El Camino Real",
      city: "Sunnyvale",
      state: "CA",
      country: "USA",
      postalCode: "94087",
      agentId: "AG004",
      verificationStatus: "verified",
    },
    {
      clientId: "CL008",
      firstName: "Richard",
      lastName: "Wilkins",
      emailAddress: "richard@soylent.com",
      phoneNumber: "+1-555-678-9012",
      address: "789 Green St",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10002",
      agentId: "AG004",
      verificationStatus: "verified",
    },
    {
      clientId: "CL009",
      firstName: "Peter",
      lastName: "Gibbons",
      emailAddress: "peter@initech.com",
      phoneNumber: "+1-555-789-0123",
      address: "456 Office Space Ln",
      city: "Austin",
      state: "TX",
      country: "USA",
      postalCode: "73301",
      agentId: "AG004",
      verificationStatus: "verified",
    },
  ],
  AG005: [
    {
      clientId: "CL010",
      firstName: "Walter",
      lastName: "Bishop",
      emailAddress: "walter@massivedynamic.com",
      phoneNumber: "+1-555-890-1234",
      address: "1 Massive Dynamic Way",
      city: "Boston",
      state: "MA",
      country: "USA",
      postalCode: "02108",
      agentId: "AG005",
      verificationStatus: "verified",
    },
    {
      clientId: "CL011",
      firstName: "Eldon",
      lastName: "Tyrell",
      emailAddress: "eldon@tyrell.com",
      phoneNumber: "+1-555-901-2345",
      address: "Tyrell Building",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      postalCode: "90001",
      agentId: "AG005",
      verificationStatus: "pending",
    },
  ],
};

const logs: Record<string, LogEntry[]> = {
  AG001: [
    {
      id: "LOG001",
      agentId: "AG001",
      clientId: "CL001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2023-07-15T10:30:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG002",
      agentId: "AG001",
      clientId: "CL002",
      clientName: "Jane Smith",
      crudType: "UPDATE",
      dateTime: "2023-07-16T14:45:00Z",
      attributeName: "emailAddress",
      beforeValue: "jane@globex.com",
      afterValue: "jane.smith@globex.com",
    },
    {
      id: "LOG003",
      agentId: "AG001",
      clientId: "CL003",
      clientName: "Tony Stark",
      crudType: "CREATE",
      dateTime: "2023-07-18T09:15:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
  ],
  AG002: [
    {
      id: "LOG004",
      agentId: "AG002",
      clientId: "CL004",
      clientName: "Bruce Wayne",
      crudType: "CREATE",
      dateTime: "2023-07-10T11:20:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG005",
      agentId: "AG002",
      clientId: "CL005",
      clientName: "Norman Osborn",
      crudType: "CREATE",
      dateTime: "2023-07-12T16:30:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG006",
      agentId: "AG002",
      clientId: "",
      clientName: "",
      crudType: "LOGIN",
      dateTime: "2023-07-14T13:45:00Z",
      attributeName: "Session",
      afterValue: "Agent logged in",
    },
  ],
  AG003: [
    {
      id: "LOG007",
      agentId: "AG003",
      clientId: "CL006",
      clientName: "Albert Wesker",
      crudType: "CREATE",
      dateTime: "2023-07-05T10:15:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG008",
      agentId: "AG003",
      clientId: "",
      clientName: "",
      crudType: "LOGIN",
      dateTime: "2023-07-08T09:30:00Z",
      attributeName: "Session",
      afterValue: "Agent logged in",
    },
  ],
  AG004: [
    {
      id: "LOG009",
      agentId: "AG004",
      clientId: "CL007",
      clientName: "Miles Dyson",
      crudType: "CREATE",
      dateTime: "2023-07-01T14:20:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG010",
      agentId: "AG004",
      clientId: "CL008",
      clientName: "Richard Wilkins",
      crudType: "CREATE",
      dateTime: "2023-07-03T11:45:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG011",
      agentId: "AG004",
      clientId: "CL009",
      clientName: "Peter Gibbons",
      crudType: "CREATE",
      dateTime: "2023-07-05T16:30:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG012",
      agentId: "AG004",
      clientId: "CL007",
      clientName: "Miles Dyson",
      crudType: "UPDATE",
      dateTime: "2023-07-07T10:15:00Z",
      attributeName: "phoneNumber",
      beforeValue: "+1-555-567-0000",
      afterValue: "+1-555-567-8901",
    },
  ],
  AG005: [
    {
      id: "LOG013",
      agentId: "AG005",
      clientId: "CL010",
      clientName: "Walter Bishop",
      crudType: "CREATE",
      dateTime: "2023-07-02T09:30:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG014",
      agentId: "AG005",
      clientId: "CL011",
      clientName: "Eldon Tyrell",
      crudType: "CREATE",
      dateTime: "2023-07-04T15:45:00Z",
      attributeName: "Client",
      afterValue: "Created new client",
    },
    {
      id: "LOG015",
      agentId: "AG005",
      clientId: "",
      clientName: "",
      crudType: "LOGIN",
      dateTime: "2023-07-06T11:20:00Z",
      attributeName: "Session",
      afterValue: "Agent logged in",
    },
  ],
  // Logs for admin users
  AD001: [
    {
      id: "LOG016",
      agentId: "AD001",
      clientId: "", // Default value
      clientName: "", // Default value
      crudType: "ADMIN_ACTION",
      dateTime: "2023-07-01T09:30:00Z",
      attributeName: "System",
      afterValue: "System configuration updated",
    },
  ],
  AD002: [
    {
      id: "LOG017",
      agentId: "AD002",
      clientId: "", // Default value
      clientName: "", // Default value
      crudType: "ADMIN_ACTION",
      dateTime: "2023-07-02T14:45:00Z",
      attributeName: "User",
      afterValue: "Created new user account",
    },
  ],
};

// -----------------------------------------------------------------------------
// User Service Methods
// -----------------------------------------------------------------------------

// Fetch all users
export const getUsers = async () => users;

// Alias for backward compatibility
export const getAgents = async () => users;

// Fetch all clients
export const getClients = async () => clients;

// Fetch all logs (agent and admin logs are stored separately)
export const getLogs = async () => logs;

// Add a new user
export const addUser = async (
  newUser: Omit<User, "id">,
  existingUsers: User[]
): Promise<User> => {
  const prefix = newUser.role === "admin" ? "AD" : "AG";
  const roleUsers = existingUsers.filter((u) => u.role === newUser.role);
  const userId = `${prefix}${String(roleUsers.length + 1).padStart(3, "0")}`;

  const user: User = {
    ...newUser,
    id: userId,
  };

  // Update mock data
  users.push(user);

  // Only initialize clients for agents
  if (newUser.role === "agent") {
    clients[userId] = [];
  }

  logs[userId] = [];

  return user;
};

// Alias for backward compatibility
export const addAgent = async (
  newUser: Omit<User, "id">,
  existingUsers: User[]
) => {
  return addUser({ ...newUser, role: "agent" }, existingUsers);
};

// Delete a user
export const deleteUser = async (
  id: string,
  existingUsers: User[],
  existingClients: Record<string, Client[]>,
  existingLogs: Record<string, LogEntry[]>
) => {
  const updatedUsers = existingUsers.filter((user) => user.id !== id);

  // Remove associated clients and logs
  delete existingClients[id];
  delete existingLogs[id];

  return {
    updatedUsers,
    updatedClients: existingClients,
    updatedLogs: existingLogs,
  };
};

// Alias for backward compatibility
export const deleteAgent = async (
  id: string,
  existingUsers: User[],
  existingClients: Record<string, Client[]>,
  existingLogs: Record<string, LogEntry[]>
) => {
  return deleteUser(id, existingUsers, existingClients, existingLogs);
};

// Reset a user's password
export const resetPassword = async (
  id: string,
  existingLogs: Record<string, LogEntry[]>
) => {
  const now = new Date().toISOString();
  const newLogEntry: LogEntry = {
    id: `LOG${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    agentId: id,
    clientId: "",
    clientName: "",
    crudType: "RESET",
    dateTime: now,
    attributeName: "Password",
    afterValue: "Password was reset by admin",
  };

  existingLogs[id] = [newLogEntry, ...(existingLogs[id] || [])];
  return existingLogs;
};

export const completeUserCreation = async (
  newUser: Omit<User, "id">,
  existingUsers: User[],
  existingClients: Record<string, Client[]>,
  existingLogs: Record<string, LogEntry[]>
) => {
  const user = await addUser(newUser, existingUsers);

  return {
    user,
    updatedUsers: existingUsers,
    updatedClients: existingClients,
    updatedLogs: existingLogs,
  };
};

// Alias for backward compatibility
export const completeAgentCreation = async (
  newUser: Omit<User, "id">,
  existingUsers: User[],
  existingClients: Record<string, Client[]>,
  existingLogs: Record<string, LogEntry[]>
) => {
  return completeUserCreation({ ...newUser, role: "agent" }, existingUsers, existingClients, existingLogs);
};

// Create a user with the real service DTO format
export const createUser = async (
  userData: CreateUserRequestDTO
): Promise<User> => {
  const newUser: Omit<User, "id"> = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    status: "active",
    role: userData.role,
  };

  return addUser(newUser, users);
};

export const getAgentList = async (): Promise<Partial<Agent>[]> => {
  await simulateApiDelay();
  return users
    .filter((user) => user.role === "agent" && user.status === "active")
    .map(({ id, firstName, lastName }) => ({
      id,
      firstName,
      lastName,
    }));
};

// -----------------------------------------------------------------------------
// Combined Service
// -----------------------------------------------------------------------------

export const userService = {
  // Admin logs methods
  getAdminLogs,

  // User, client, and logs methods
  getUsers,
  getAgents,
  getClients,
  getLogs,
  addUser,
  addAgent,
  deleteUser,
  deleteAgent,
  resetPassword,
  completeUserCreation,
  completeAgentCreation,
  createUser,
  getAgentList
};

export default userService;
