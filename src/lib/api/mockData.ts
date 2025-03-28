// Mock transactions
export const mockTransactions = [
    {
      id: "1001",
      clientId: "c1000000-0000-0000-0000-000000000001",
      amount: 500,
      status: "completed",
      date: "2023-03-15",
      description: "Deposit",
    },
    {
      id: "1002",
      clientId: "c1000000-0000-0000-0000-000000000001",
      amount: 750,
      status: "pending",
      date: "2023-03-18",
      description: "Transfer",
    },
    {
      id: "1003",
      clientId: "c2000000-0000-0000-0000-000000000002",
      amount: 200,
      status: "failed",
      date: "2023-03-20",
      description: "Withdrawal",
    },
    {
      id: "1004",
      clientId: "c2000000-0000-0000-0000-000000000002",
      amount: 1200,
      status: "completed",
      date: "2023-03-21",
      description: "Loan payment",
    }
  ];
  
  // Mock activities
  export const mockActivities = [
    {
      type: "created" as const,
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      timestamp: "2023-01-15",
    },
    {
      type: "updated" as const,
      clientId: "c2000000-0000-0000-0000-000000000002",
      clientName: "Jane Smith",
      timestamp: "2023-03-15",
    },
    {
      type: "updated" as const,
      clientId: "c1000000-0000-0000-0000-000000000001",
      clientName: "John Doe",
      timestamp: "2023-03-20",
    }
  ];
  