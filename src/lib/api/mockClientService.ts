
import { Client, ClientDTO, CommunicationsEntry, LogEntry } from './types';

const mockClients: Client[] = [
  {
    clientId: "c1000000-0000-0000-0000-000000000001",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-07-15",
    gender: "MALE",
    emailAddress: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    country: "USA",
    postalCode: "62701",
    nric: "S1234567A",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c2000000-0000-0000-0000-000000000002",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1985-04-10",
    gender: "FEMALE",
    emailAddress: "janesmith@example.com",
    phoneNumber: "987-654-3210",
    address: "456 Elm St",
    city: "Chicago",
    state: "IL",
    country: "USA",
    postalCode: "60601",
    nric: "S9876543B",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c3000000-0000-0000-0000-000000000003",
    firstName: "Alice",
    lastName: "Johnson",
    dateOfBirth: "1995-05-22",
    gender: "FEMALE",
    emailAddress: "alicejohnson@example.com",
    phoneNumber: "555-123-9876",
    address: "789 Oak St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90001",
    nric: "S5432167C",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c4000000-0000-0000-0000-000000000004",
    firstName: "Robert",
    lastName: "Chen",
    dateOfBirth: "1982-11-30",
    gender: "MALE",
    emailAddress: "robertchen@example.com",
    phoneNumber: "234-567-8901",
    address: "321 Pine St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94101",
    nric: "S7654321D",
    agentId: "agent002",
    verificationStatus: "Pending"
  },
  {
    clientId: "c5000000-0000-0000-0000-000000000005",
    firstName: "Priya",
    lastName: "Patel",
    dateOfBirth: "1988-03-18",
    gender: "FEMALE",
    emailAddress: "priyapatel@example.com",
    phoneNumber: "345-678-9012",
    address: "654 Maple St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    nric: "S8765432E",
    agentId: "agent002",
    verificationStatus: "Verified"
  },
  {
    clientId: "c6000000-0000-0000-0000-000000000006",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1975-09-05",
    gender: "MALE",
    emailAddress: "michaelbrown@example.com",
    phoneNumber: "456-789-0123",
    address: "987 Cedar St",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalCode: "02101",
    nric: "S9876543F",
    agentId: "agent003",
    verificationStatus: "Rejected"
  },
  {
    clientId: "c7000000-0000-0000-0000-000000000007",
    firstName: "Sophia",
    lastName: "Garcia",
    dateOfBirth: "1992-12-25",
    gender: "FEMALE",
    emailAddress: "sophiagarcia@example.com",
    phoneNumber: "567-890-1234",
    address: "159 Birch St",
    city: "Miami",
    state: "FL",
    country: "USA",
    postalCode: "33101",
    nric: "S1239876G",
    agentId: "agent003",
    verificationStatus: "Verified"
  },
  {
    clientId: "c8000000-0000-0000-0000-000000000008",
    firstName: "David",
    lastName: "Kim",
    dateOfBirth: "1980-06-12",
    gender: "MALE",
    emailAddress: "davidkim@example.com",
    phoneNumber: "678-901-2345",
    address: "753 Walnut St",
    city: "Seattle",
    state: "WA",
    country: "USA",
    postalCode: "98101",
    nric: "S4567891H",
    agentId: "agent004",
    verificationStatus: "Pending"
  },
  {
    clientId: "c9000000-0000-0000-0000-000000000009",
    firstName: "Emma",
    lastName: "Wilson",
    dateOfBirth: "1998-02-28",
    gender: "FEMALE",
    emailAddress: "emmawilson@example.com",
    phoneNumber: "789-012-3456",
    address: "357 Spruce St",
    city: "Austin",
    state: "TX",
    country: "USA",
    postalCode: "73301",
    nric: "S5678912I",
    agentId: "agent004",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-0000-0000-000000000010",
    firstName: "James",
    lastName: "Taylor",
    dateOfBirth: "1972-08-08",
    gender: "MALE",
    emailAddress: "jamestaylor@example.com",
    phoneNumber: "890-123-4567",
    address: "852 Redwood St",
    city: "Denver",
    state: "CO",
    country: "USA",
    postalCode: "80201",
    nric: "S6789123J",
    agentId: "agent005",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-1000-0000-000000000001",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-07-15",
    gender: "MALE",
    emailAddress: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    country: "USA",
    postalCode: "62701",
    nric: "S1234567A",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c2000000-0000-1000-0000-000000000002",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1985-04-10",
    gender: "FEMALE",
    emailAddress: "janesmith@example.com",
    phoneNumber: "987-654-3210",
    address: "456 Elm St",
    city: "Chicago",
    state: "IL",
    country: "USA",
    postalCode: "60601",
    nric: "S9876543B",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c3000000-0000-1000-0000-000000000003",
    firstName: "Alice",
    lastName: "Johnson",
    dateOfBirth: "1995-05-22",
    gender: "FEMALE",
    emailAddress: "alicejohnson@example.com",
    phoneNumber: "555-123-9876",
    address: "789 Oak St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90001",
    nric: "S5432167C",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c4000000-0000-1000-0000-000000000004",
    firstName: "Robert",
    lastName: "Chen",
    dateOfBirth: "1982-11-30",
    gender: "MALE",
    emailAddress: "robertchen@example.com",
    phoneNumber: "234-567-8901",
    address: "321 Pine St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94101",
    nric: "S7654321D",
    agentId: "agent002",
    verificationStatus: "Pending"
  },
  {
    clientId: "c5000000-0000-1000-0000-000000000005",
    firstName: "Priya",
    lastName: "Patel",
    dateOfBirth: "1988-03-18",
    gender: "FEMALE",
    emailAddress: "priyapatel@example.com",
    phoneNumber: "345-678-9012",
    address: "654 Maple St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    nric: "S8765432E",
    agentId: "agent002",
    verificationStatus: "Verified"
  },
  {
    clientId: "c6000000-0000-1000-0000-000000000006",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1975-09-05",
    gender: "MALE",
    emailAddress: "michaelbrown@example.com",
    phoneNumber: "456-789-0123",
    address: "987 Cedar St",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalCode: "02101",
    nric: "S9876543F",
    agentId: "agent003",
    verificationStatus: "Rejected"
  },
  {
    clientId: "c7000000-0000-1000-0000-000000000007",
    firstName: "Sophia",
    lastName: "Garcia",
    dateOfBirth: "1992-12-25",
    gender: "FEMALE",
    emailAddress: "sophiagarcia@example.com",
    phoneNumber: "567-890-1234",
    address: "159 Birch St",
    city: "Miami",
    state: "FL",
    country: "USA",
    postalCode: "33101",
    nric: "S1239876G",
    agentId: "agent003",
    verificationStatus: "Verified"
  },
  {
    clientId: "c8000000-0000-1000-0000-000000000008",
    firstName: "David",
    lastName: "Kim",
    dateOfBirth: "1980-06-12",
    gender: "MALE",
    emailAddress: "davidkim@example.com",
    phoneNumber: "678-901-2345",
    address: "753 Walnut St",
    city: "Seattle",
    state: "WA",
    country: "USA",
    postalCode: "98101",
    nric: "S4567891H",
    agentId: "agent004",
    verificationStatus: "Pending"
  },
  {
    clientId: "c9000000-0000-1000-0000-000000000009",
    firstName: "Emma",
    lastName: "Wilson",
    dateOfBirth: "1998-02-28",
    gender: "FEMALE",
    emailAddress: "emmawilson@example.com",
    phoneNumber: "789-012-3456",
    address: "357 Spruce St",
    city: "Austin",
    state: "TX",
    country: "USA",
    postalCode: "73301",
    nric: "S5678912I",
    agentId: "agent004",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-1000-0000-000000000010",
    firstName: "James",
    lastName: "Taylor",
    dateOfBirth: "1972-08-08",
    gender: "MALE",
    emailAddress: "jamestaylor@example.com",
    phoneNumber: "890-123-4567",
    address: "852 Redwood St",
    city: "Denver",
    state: "CO",
    country: "USA",
    postalCode: "80201",
    nric: "S6789123J",
    agentId: "agent005",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-0000-0000-100000000001",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-07-15",
    gender: "MALE",
    emailAddress: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    country: "USA",
    postalCode: "62701",
    nric: "S1234567A",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c2000000-0000-0000-0000-100000000002",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1985-04-10",
    gender: "FEMALE",
    emailAddress: "janesmith@example.com",
    phoneNumber: "987-654-3210",
    address: "456 Elm St",
    city: "Chicago",
    state: "IL",
    country: "USA",
    postalCode: "60601",
    nric: "S9876543B",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c3000000-0000-0000-0000-100000000003",
    firstName: "Alice",
    lastName: "Johnson",
    dateOfBirth: "1995-05-22",
    gender: "FEMALE",
    emailAddress: "alicejohnson@example.com",
    phoneNumber: "555-123-9876",
    address: "789 Oak St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90001",
    nric: "S5432167C",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c4000000-0000-0000-0000-100000000004",
    firstName: "Robert",
    lastName: "Chen",
    dateOfBirth: "1982-11-30",
    gender: "MALE",
    emailAddress: "robertchen@example.com",
    phoneNumber: "234-567-8901",
    address: "321 Pine St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94101",
    nric: "S7654321D",
    agentId: "agent002",
    verificationStatus: "Pending"
  },
  {
    clientId: "c5000000-0000-0000-0000-100000000005",
    firstName: "Priya",
    lastName: "Patel",
    dateOfBirth: "1988-03-18",
    gender: "FEMALE",
    emailAddress: "priyapatel@example.com",
    phoneNumber: "345-678-9012",
    address: "654 Maple St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    nric: "S8765432E",
    agentId: "agent002",
    verificationStatus: "Verified"
  },
  {
    clientId: "c6000000-0000-0000-0000-100000000006",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1975-09-05",
    gender: "MALE",
    emailAddress: "michaelbrown@example.com",
    phoneNumber: "456-789-0123",
    address: "987 Cedar St",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalCode: "02101",
    nric: "S9876543F",
    agentId: "agent003",
    verificationStatus: "Rejected"
  },
  {
    clientId: "c7000000-0000-0000-0000-100000000007",
    firstName: "Sophia",
    lastName: "Garcia",
    dateOfBirth: "1992-12-25",
    gender: "FEMALE",
    emailAddress: "sophiagarcia@example.com",
    phoneNumber: "567-890-1234",
    address: "159 Birch St",
    city: "Miami",
    state: "FL",
    country: "USA",
    postalCode: "33101",
    nric: "S1239876G",
    agentId: "agent003",
    verificationStatus: "Verified"
  },
  {
    clientId: "c8000000-0000-0000-0000-100000000008",
    firstName: "David",
    lastName: "Kim",
    dateOfBirth: "1980-06-12",
    gender: "MALE",
    emailAddress: "davidkim@example.com",
    phoneNumber: "678-901-2345",
    address: "753 Walnut St",
    city: "Seattle",
    state: "WA",
    country: "USA",
    postalCode: "98101",
    nric: "S4567891H",
    agentId: "agent004",
    verificationStatus: "Pending"
  },
  {
    clientId: "c9000000-0000-0000-0000-100000000009",
    firstName: "Emma",
    lastName: "Wilson",
    dateOfBirth: "1998-02-28",
    gender: "FEMALE",
    emailAddress: "emmawilson@example.com",
    phoneNumber: "789-012-3456",
    address: "357 Spruce St",
    city: "Austin",
    state: "TX",
    country: "USA",
    postalCode: "73301",
    nric: "S5678912I",
    agentId: "agent004",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-0000-0000-100000000010",
    firstName: "James",
    lastName: "Taylor",
    dateOfBirth: "1972-08-08",
    gender: "MALE",
    emailAddress: "jamestaylor@example.com",
    phoneNumber: "890-123-4567",
    address: "852 Redwood St",
    city: "Denver",
    state: "CO",
    country: "USA",
    postalCode: "80201",
    nric: "S6789123J",
    agentId: "agent005",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-1000-0000-100000000001",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-07-15",
    gender: "MALE",
    emailAddress: "johndoe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    country: "USA",
    postalCode: "62701",
    nric: "S1234567A",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c2000000-0000-1000-0000-100000000002",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1985-04-10",
    gender: "FEMALE",
    emailAddress: "janesmith@example.com",
    phoneNumber: "987-654-3210",
    address: "456 Elm St",
    city: "Chicago",
    state: "IL",
    country: "USA",
    postalCode: "60601",
    nric: "S9876543B",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c3000000-0000-1000-0000-100000000003",
    firstName: "Alice",
    lastName: "Johnson",
    dateOfBirth: "1995-05-22",
    gender: "FEMALE",
    emailAddress: "alicejohnson@example.com",
    phoneNumber: "555-123-9876",
    address: "789 Oak St",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90001",
    nric: "S5432167C",
    agentId: "agent001",
    verificationStatus: "Verified"
  },
  {
    clientId: "c4000000-0000-1000-0000-100000000004",
    firstName: "Robert",
    lastName: "Chen",
    dateOfBirth: "1982-11-30",
    gender: "MALE",
    emailAddress: "robertchen@example.com",
    phoneNumber: "234-567-8901",
    address: "321 Pine St",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    postalCode: "94101",
    nric: "S7654321D",
    agentId: "agent002",
    verificationStatus: "Pending"
  },
  {
    clientId: "c5000000-0000-1000-0000-100000000005",
    firstName: "Priya",
    lastName: "Patel",
    dateOfBirth: "1988-03-18",
    gender: "FEMALE",
    emailAddress: "priyapatel@example.com",
    phoneNumber: "345-678-9012",
    address: "654 Maple St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    nric: "S8765432E",
    agentId: "agent002",
    verificationStatus: "Verified"
  },
  {
    clientId: "c6000000-0000-1000-0000-100000000006",
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1975-09-05",
    gender: "MALE",
    emailAddress: "michaelbrown@example.com",
    phoneNumber: "456-789-0123",
    address: "987 Cedar St",
    city: "Boston",
    state: "MA",
    country: "USA",
    postalCode: "02101",
    nric: "S9876543F",
    agentId: "agent003",
    verificationStatus: "Rejected"
  },
  {
    clientId: "c7000000-0000-1000-0000-100000000007",
    firstName: "Sophia",
    lastName: "Garcia",
    dateOfBirth: "1992-12-25",
    gender: "FEMALE",
    emailAddress: "sophiagarcia@example.com",
    phoneNumber: "567-890-1234",
    address: "159 Birch St",
    city: "Miami",
    state: "FL",
    country: "USA",
    postalCode: "33101",
    nric: "S1239876G",
    agentId: "agent003",
    verificationStatus: "Verified"
  },
  {
    clientId: "c8000000-0000-1000-0000-100000000008",
    firstName: "David",
    lastName: "Kim",
    dateOfBirth: "1980-06-12",
    gender: "MALE",
    emailAddress: "davidkim@example.com",
    phoneNumber: "678-901-2345",
    address: "753 Walnut St",
    city: "Seattle",
    state: "WA",
    country: "USA",
    postalCode: "98101",
    nric: "S4567891H",
    agentId: "agent004",
    verificationStatus: "Pending"
  },
  {
    clientId: "c9000000-0000-1000-0000-100000000009",
    firstName: "Emma",
    lastName: "Wilson",
    dateOfBirth: "1998-02-28",
    gender: "FEMALE",
    emailAddress: "emmawilson@example.com",
    phoneNumber: "789-012-3456",
    address: "357 Spruce St",
    city: "Austin",
    state: "TX",
    country: "USA",
    postalCode: "73301",
    nric: "S5678912I",
    agentId: "agent004",
    verificationStatus: "Verified"
  },
  {
    clientId: "c1000000-0000-1000-0000-100000000010",
    firstName: "James",
    lastName: "Taylor",
    dateOfBirth: "1972-08-08",
    gender: "MALE",
    emailAddress: "jamestaylor@example.com",
    phoneNumber: "890-123-4567",
    address: "852 Redwood St",
    city: "Denver",
    state: "CO",
    country: "USA",
    postalCode: "80201",
    nric: "S6789123J",
    agentId: "agent005",
    verificationStatus: "Verified"
  }
];

  const mockLogs: LogEntry[] = [
    {
      id: "log-001",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-002",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-003",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-004",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-005",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-006",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-007",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-008",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-009",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-0010",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-011",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-012",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-007",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-008",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-009",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-010",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-011",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-012",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-013",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-014",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-015",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
    {
      id: "log-016",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "CREATE",
      dateTime: "2024-03-28T10:00:00Z",
    },
    {
      id: "log-017",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "UPDATE",
      dateTime: "2024-03-28T12:00:00Z",
      attributeName: "phoneNumber",
      beforeValue: "123-456-7890",
      afterValue: "987-654-3210",
    },
    {
      id: "log-018",
      agentId: "agent001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      crudType: "DELETE",
      dateTime: "2024-03-28T14:00:00Z",
    },
  ];
  
  const mockCommunicationsLogs: CommunicationsEntry[] = [
    {
      subject: "Welcome Email Sent",
      status: "SENT",
      timestamp: "2024-03-01T09:30:00Z",
    },
    {
      subject: "Verification Reminder",
      status: "SENT",
      timestamp: "2024-03-02T10:15:00Z",
    },
    {
      subject: "Profile Update Follow-up",
      status: "SENT",
      timestamp: "2024-03-03T14:45:00Z",
    },
    {
      subject: "Failed Delivery: Email Bounce",
      status: "FAILED",
      timestamp: "2024-03-04T16:10:00Z",
    },
    {
      subject: "Monthly Summary Sent",
      status: "SENT",
      timestamp: "2024-03-05T08:00:00Z",
    },
    {
      subject: "Security Alert Follow-up",
      status: "SENDING",
      timestamp: "2024-03-06T11:20:00Z",
    },
    {
      subject: "Manual Review Needed",
      status: "FAILED",
      timestamp: "2024-03-07T12:30:00Z",
    },
    {
      subject: "Policy Change Notification",
      status: "SENT",
      timestamp: "2024-03-08T15:00:00Z",
    },
    {
      subject: "Subscription Renewal Reminder",
      status: "SENT",
      timestamp: "2024-03-09T09:45:00Z",
    },
    {
      subject: "Feedback Request Sent",
      status: "SENT",
      timestamp: "2024-03-10T10:30:00Z",
    },
    {
      subject: "Welcome Email Sent",
      status: "SENT",
      timestamp: "2024-03-01T09:30:00Z",
    },
    {
      subject: "Verification Reminder",
      status: "SENT",
      timestamp: "2024-03-02T10:15:00Z",
    },
    {
      subject: "Profile Update Follow-up",
      status: "SENT",
      timestamp: "2024-03-03T14:45:00Z",
    },
    {
      subject: "Failed Delivery: Email Bounce",
      status: "FAILED",
      timestamp: "2024-03-04T16:10:00Z",
    },
    {
      subject: "Monthly Summary Sent",
      status: "SENT",
      timestamp: "2024-03-05T08:00:00Z",
    },
    {
      subject: "Security Alert Follow-up",
      status: "SENDING",
      timestamp: "2024-03-06T11:20:00Z",
    },
    {
      subject: "Manual Review Needed",
      status: "FAILED",
      timestamp: "2024-03-07T12:30:00Z",
    },
    {
      subject: "Policy Change Notification",
      status: "SENT",
      timestamp: "2024-03-08T15:00:00Z",
    },
    {
      subject: "Subscription Renewal Reminder",
      status: "SENT",
      timestamp: "2024-03-09T09:45:00Z",
    },
    {
      subject: "Feedback Request Sent",
      status: "SENT",
      timestamp: "2024-03-10T10:30:00Z",
    },
  ];


  const clientService = {
    
    getClientsByAgentId: async (
      agentId: string,
      searchQuery: string = "",
      page: number = 1,
      limit: number = 10
    ): Promise<Partial<Client>[]> => {
      console.log(`Fetching clients for agent: ${agentId}, page: ${page}, search: "${searchQuery}"`);
  
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        // Filter clients based on searchQuery
        const filteredClients = mockClients.filter(
          (client) =>
            (client.firstName && client.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (client.lastName && client.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (client.emailAddress && client.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()))
        );
  
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedClients = filteredClients.slice(startIndex, startIndex + limit);
  
        return paginatedClients;
      } catch (error) {
        console.error(`Error fetching clients for agent ${agentId}:`, error);
        throw error;
      }
    },
    
    getClientsByName: async (search: string): Promise<Client[]> => {
      if (!search.trim()) return [];
    
      return mockClients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(search.toLowerCase())
      );
    },

    getClientById: async (clientId: string): Promise<Client | null> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockClients.find(client => client.clientId === clientId) || null;
    },
  
    getAllClients: async (): Promise<Client[]> => {
      return mockClients;
    },
  
    createClient: async (clientData: ClientDTO): Promise<Client> => {
      const newClient = { ...clientData, clientId: `c${Date.now()}`, agentId: "agent001"};
      mockClients.push(newClient);
      return newClient;
    },
  
    updateClient: async (clientId: string, clientData: Client): Promise<Client | null> => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const clientIndex = mockClients.findIndex(client => client.clientId === clientId);
      if (clientIndex !== -1) {
        const updatedClient = { ...mockClients[clientIndex], ...clientData, lastUpdated: new Date().toISOString() };
        mockClients[clientIndex] = updatedClient;
        return updatedClient;
      }
      return null;
    },
  
    deleteClient: async (clientId: string): Promise<void> => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const clientIndex = mockClients.findIndex(client => client.clientId === clientId);
      if (clientIndex !== -1) {
        mockClients.splice(clientIndex, 1);
      }
    },
    

      getLogsByAgentId: async (
        agentId: string,
        searchQuery: string = "",
        page: number = 1,
        limit: number = 10
      ): Promise<LogEntry[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    
        const filtered = mockLogs.filter(
          (log) =>
            log.agentId === agentId &&
            (log.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.crudType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.attributeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.beforeValue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.afterValue?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    
        const start = (page - 1) * limit;
        return filtered.slice(start, start + limit);
      },
    
      getLogsByClientId: async (
        clientId: string,
        searchQuery: string = "",
        page: number = 1,
        limit: number = 10
      ): Promise<LogEntry[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
    
        const filtered = mockLogs.filter(
          (log) =>
            log.clientId === clientId &&
            (log.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.crudType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.attributeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.beforeValue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              log.afterValue?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    
        const start = (page - 1) * limit;
        return filtered.slice(start, start + limit);
      },
  
    getCommunicationsByAgentId: async (
      agentId: string,
      searchQuery: string = "",
      page: number = 1,
      limit: number = 10
    ): Promise<CommunicationsEntry[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      const filtered = mockCommunicationsLogs.filter(
        (entry : CommunicationsEntry) =>
          entry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.status.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit);
    },
    // verifyClient: async (clientId: string, nric: string): Promise<{ verified: boolean }> => {
    //   // In a real-world scenario, the verification logic will happen here
    //   return { verified: true };
    // }
  };
  
  export default clientService;
  