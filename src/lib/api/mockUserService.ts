import type { Agent, Client, LogEntry } from "@/lib/api/types";

// Sample initial data
const agents: Agent[] = [
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
  };

// Fetch all agents
export const getAgents = async () => agents;

// Fetch all clients
export const getClients = async () => clients;

// Fetch all logs
export const getLogs = async () => logs;

// Add a new agent
export const addAgent = async (newAgent: Omit<Agent, "id">, agents: Agent[]) => {
  const agentId = `AG${String(agents.length + 1).padStart(3, "0")}`;
  const agent: Agent = {
    ...newAgent,
    id: agentId,
  };

  // Update mock data
  agents.push(agent);
  clients[agentId] = [];
  logs[agentId] = [];

  return agent;
};

// Delete an agent
export const deleteAgent = async (
  id: string,
  agents: Agent[],
  clients: Record<string, Client[]>,
  logs: Record<string, LogEntry[]>
) => {
  const updatedAgents = agents.filter((agent) => agent.id !== id);

  // Remove associated clients and logs
  delete clients[id];
  delete logs[id];

  return { updatedAgents, updatedClients: clients, updatedLogs: logs };
};

// Reset an agent's password
export const resetPassword = async (
  id: string,
  logs: Record<string, LogEntry[]>
) => {
  const now = new Date().toISOString();
  const newLogEntry: LogEntry = {
    id: `LOG${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    agentId: id,
    clientId: "",
    clientName: "",
    crudType: "RESET",
    dateTime: now,
    attributeName: "Password",
    afterValue: "Password was reset by admin",
  };

  logs[id] = [newLogEntry, ...(logs[id] || [])];
  return logs;
};

export const completeAgentCreation = async (
    newAgent: Omit<Agent, "id">,
    agents: Agent[],
    clients: Record<string, Client[]>,
    logs: Record<string, LogEntry[]>
  ) => {
    const agentId = `AG${String(agents.length + 1).padStart(3, "0")}`;
    const agent: Agent = {
      ...newAgent,
      id: agentId,
    };
  
    // Update mock data
    agents.push(agent);
    clients[agentId] = [];
    logs[agentId] = [];
  
    return { agent, updatedAgents: agents, updatedClients: clients, updatedLogs: logs };
  };

export const mockUserService = {
  getAgents,
  getClients,
  getLogs,
  addAgent,
  deleteAgent,
  resetPassword,
    completeAgentCreation,
};