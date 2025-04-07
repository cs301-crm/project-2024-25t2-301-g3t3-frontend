import { Account, AccountDTO, Transaction } from './types';

// Mock data for accounts
const mockAccounts: Account[] = [
  // John Doe's accounts
  {
    accountId: "a1000000-0000-0000-0000-000000000001",
    clientId: "c1000000-0000-0000-0000-000000000001",
    clientName: "John Doe",
    accountType: "SAVINGS",
    accountStatus: "ACTIVE",
    openingDate: "2020-01-15",
    initialDeposit: 1000,
    currency: "USD",
    branchId: "b1001"
  },
  {
    accountId: "a1000000-0000-0000-0000-000000000002",
    clientId: "c1000000-0000-0000-0000-000000000001",
    clientName: "John Doe",
    accountType: "CHECKING",
    accountStatus: "ACTIVE",
    openingDate: "2021-03-22",
    initialDeposit: 2500,
    currency: "USD",
    branchId: "b1001"
  },

  // Jane Smith's accounts
  {
    accountId: "a2000000-0000-0000-0000-000000000001",
    clientId: "c2000000-0000-0000-0000-000000000002",
    clientName: "Jane Smith",
    accountType: "SAVINGS",
    accountStatus: "ACTIVE",
    openingDate: "2019-05-10",
    initialDeposit: 5000,
    currency: "USD",
    branchId: "b1002"
  },
  {
    accountId: "a2000000-0000-0000-0000-000000000002",
    clientId: "c2000000-0000-0000-0000-000000000002",
    clientName: "Jane Smith",
    accountType: "BUSINESS",
    accountStatus: "ACTIVE",
    openingDate: "2022-07-18",
    initialDeposit: 10000,
    currency: "USD",
    branchId: "b1002"
  },

  // Alice Johnson's accounts
  {
    accountId: "a3000000-0000-0000-0000-000000000001",
    clientId: "c3000000-0000-0000-0000-000000000003",
    clientName: "Alice Johnson",
    accountType: "SAVINGS",
    accountStatus: "PENDING",
    openingDate: "2023-02-05",
    initialDeposit: 2000,
    currency: "USD",
    branchId: "b1003"
  },
  {
    accountId: "a3000000-0000-0000-0000-000000000002",
    clientId: "c3000000-0000-0000-0000-000000000003",
    clientName: "Alice Johnson",
    accountType: "CHECKING",
    accountStatus: "ACTIVE",
    openingDate: "2023-02-05",
    initialDeposit: 1500,
    currency: "USD",
    branchId: "b1003"
  },

  // Robert Chen's accounts
  {
    accountId: "a4000000-0000-0000-0000-000000000001",
    clientId: "c4000000-0000-0000-0000-000000000004",
    clientName: "Robert Chen",
    accountType: "BUSINESS",
    accountStatus: "ACTIVE",
    openingDate: "2021-11-30",
    initialDeposit: 20000,
    currency: "USD",
    branchId: "b1004"
  },
  {
    accountId: "a4000000-0000-0000-0000-000000000002",
    clientId: "c4000000-0000-0000-0000-000000000004",
    clientName: "Robert Chen",
    accountType: "CHECKING",
    accountStatus: "CLOSED",
    openingDate: "2018-09-14",
    initialDeposit: 5000,
    currency: "USD",
    branchId: "b1004"
  },

  // Priya Patel's accounts
  {
    accountId: "a5000000-0000-0000-0000-000000000001",
    clientId: "c5000000-0000-0000-0000-000000000005",
    clientName: "Priya Patel",
    accountType: "SAVINGS",
    accountStatus: "INACTIVE",
    openingDate: "2022-04-01",
    initialDeposit: 7500,
    currency: "USD",
    branchId: "b1005"
  },
  {
    accountId: "a5000000-0000-0000-0000-000000000002",
    clientId: "c5000000-0000-0000-0000-000000000005",
    clientName: "Priya Patel",
    accountType: "BUSINESS",
    accountStatus: "ACTIVE",
    openingDate: "2023-01-15",
    initialDeposit: 15000,
    currency: "USD",
    branchId: "b1005"
  },

  // Michael Brown's accounts
  {
    accountId: "a6000000-0000-0000-0000-000000000001",
    clientId: "c6000000-0000-0000-0000-000000000006",
    clientName: "Michael Brown",
    accountType: "SAVINGS",
    accountStatus: "ACTIVE",
    openingDate: "2020-08-10",
    initialDeposit: 3000,
    currency: "USD",
    branchId: "b1006"
  },
  {
    accountId: "a6000000-0000-0000-0000-000000000002",
    clientId: "c6000000-0000-0000-0000-000000000006",
    clientName: "Michael Brown",
    accountType: "RETIREMENT",
    accountStatus: "ACTIVE",
    openingDate: "2021-11-25",
    initialDeposit: 10000,
    currency: "USD",
    branchId: "b1006"
  },

  // Sophia Garcia's accounts
  {
    accountId: "a7000000-0000-0000-0000-000000000001",
    clientId: "c7000000-0000-0000-0000-000000000007",
    clientName: "Sophia Garcia",
    accountType: "CHECKING",
    accountStatus: "ACTIVE",
    openingDate: "2022-03-15",
    initialDeposit: 4500,
    currency: "USD",
    branchId: "b1007"
  },
  {
    accountId: "a7000000-0000-0000-0000-000000000002",
    clientId: "c7000000-0000-0000-0000-000000000007",
    clientName: "Sophia Garcia",
    accountType: "SAVINGS",
    accountStatus: "ACTIVE",
    openingDate: "2022-03-15",
    initialDeposit: 8000,
    currency: "USD",
    branchId: "b1007"
  },

  // David Kim's accounts
  {
    accountId: "a8000000-0000-0000-0000-000000000001",
    clientId: "c8000000-0000-0000-0000-000000000008",
    clientName: "David Kim",
    accountType: "BUSINESS",
    accountStatus: "ACTIVE",
    openingDate: "2019-07-22",
    initialDeposit: 25000,
    currency: "USD",
    branchId: "b1008"
  },
  {
    accountId: "a8000000-0000-0000-0000-000000000002",
    clientId: "c8000000-0000-0000-0000-000000000008",
    clientName: "David Kim",
    accountType: "CHECKING",
    accountStatus: "ACTIVE",
    openingDate: "2020-02-18",
    initialDeposit: 6000,
    currency: "USD",
    branchId: "b1008"
  },

  // Emma Wilson's accounts
  {
    accountId: "a9000000-0000-0000-0000-000000000001",
    clientId: "c9000000-0000-0000-0000-000000000009",
    clientName: "Emma Wilson",
    accountType: "SAVINGS",
    accountStatus: "ACTIVE",
    openingDate: "2021-05-30",
    initialDeposit: 7000,
    currency: "USD",
    branchId: "b1009"
  },
  {
    accountId: "a9000000-0000-0000-0000-000000000002",
    clientId: "c9000000-0000-0000-0000-000000000009",
    clientName: "Emma Wilson",
    accountType: "STUDENT",
    accountStatus: "ACTIVE",
    openingDate: "2021-05-30",
    initialDeposit: 500,
    currency: "USD",
    branchId: "b1009"
  },

  // James Taylor's accounts
  {
    accountId: "a1000000-0000-0000-0000-000000000010",
    clientId: "c1000000-0000-0000-0000-000000000010",
    clientName: "James Taylor",
    accountType: "CHECKING",
    accountStatus: "ACTIVE",
    openingDate: "2018-12-05",
    initialDeposit: 8500,
    currency: "USD",
    branchId: "b1010"
  },
  {
    accountId: "a1000000-0000-0000-0000-000000000011",
    clientId: "c1000000-0000-0000-0000-000000000010",
    clientName: "James Taylor",
    accountType: "INVESTMENT",
    accountStatus: "ACTIVE",
    openingDate: "2020-04-20",
    initialDeposit: 20000,
    currency: "USD",
    branchId: "b1010"
  }
];

// Sample mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    clientId: "c1000000-0000-0000-0000-000000000001",
    amount: 1000,
    status: 'completed',
    date: '2023-10-15T10:30:00Z',
    description: 'Initial deposit',
    clientFirstName: "John",
    clientLastName: "Doe"
  },
  {
    id: 'txn-002',
    clientId: "c1000000-0000-0000-0000-000000000001",
    amount: -200,
    status: 'completed',
    date: '2023-10-16T14:45:00Z',
    description: 'ATM withdrawal',
    clientFirstName: "John",
    clientLastName: "Doe"
  },
  {
    id: 'txn-003',
    clientId: "c1000000-0000-0000-0000-000000000001",
    amount: 500,
    status: 'failed',
    date: '2023-10-17T09:15:00Z',
    description: 'Transfer from savings',
    clientFirstName: "John",
    clientLastName: "Doe"
  }
];


// Helper function to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const accountService = {
  /**
   * Get all accounts
   * @returns Promise with array of accounts
   */

  getAllAccounts: async (): Promise<Account[]> => {
    await simulateApiDelay();
    return [...mockAccounts];
  },

  /**
   * Get an account by ID
   * @param accountId - The ID of the account to retrieve
   * @returns Promise with account data
   */
  getAccountById: async (accountId: string): Promise<Account> => {
    await simulateApiDelay();
    const account = mockAccounts.find(a => a.accountId === accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return {...account};
  },

  /**
   * Create a new account
   * @param accountData - The account data to create
   * @returns Promise with the created account
   */
  createAccount: async (accountData: AccountDTO): Promise<Account> => {
    await simulateApiDelay();
    const newAccount = {
      ...accountData,
      accountId: `a${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}-0000-0000-0000-000000000000`.slice(0, 36),
      openingDate: new Date().toISOString().split('T')[0],
      clientName: "John Doe"
    };
    mockAccounts.push(newAccount as Account);
    return {...newAccount};
  },

  /**
   * Update an existing account
   * @param accountId - The ID of the account to update
   * @param accountData - The updated account data
   * @returns Promise with the updated account
   */
  updateAccount: async (accountId: string, accountData: Account): Promise<Account> => {
    await simulateApiDelay();
    const index = mockAccounts.findIndex(a => a.accountId === accountId);
    if (index === -1) {
      throw new Error('Account not found');
    }
    const updatedAccount = {
      ...mockAccounts[index],
      ...accountData,
      accountId // Ensure ID doesn't change
    };
    mockAccounts[index] = updatedAccount;
    return {...updatedAccount};
  },

  /**
   * Delete an account
   * @param accountId - The ID of the account to delete
   * @returns Promise with the deletion result
   */
  deleteAccount: async (accountId: string): Promise<void> => {
    await simulateApiDelay();
    const index = mockAccounts.findIndex(a => a.accountId === accountId);
    if (index === -1) {
      throw new Error('Account not found');
    }
    mockAccounts.splice(index, 1);
  },

  /**
   * Get accounts by client ID
   * @param clientId - The ID of the client
   * @returns Promise with array of accounts
   */
  getAccountsByClientId: async (clientId: string): Promise<Account[]> => {
    await simulateApiDelay();
    return mockAccounts
      .filter(a => a.clientId === clientId)
      .map(a => ({...a}));
  },

  getAccountsByAgentId: async ({
      agentId,
      searchQuery = "",
      type = null,
      status = null,
      page = 1,
      limit = 10
    }: {
      agentId: string;
      searchQuery?: string;
      type?: string | null;
      status?: string | null;
      page?: number;
      limit?: number;
    }): Promise<Account[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Fetching accounts for agent: ${agentId}, page: ${page}, search: "${searchQuery}"`);
      // Filter accounts based on parameters
      const filteredAccounts = mockAccounts.filter(account => {
        // In a real app, you would filter by agentId too
        // For mock purposes, we'll ignore agentId
        
        // Apply search filter (case insensitive)
        const matchesSearch = searchQuery 
          ? account.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.accountType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.accountStatus.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        // Apply type filter
        const matchesType = type 
          ? account.accountType === type
          : true;
        
        // Apply status filter
        const matchesStatus = status
          ? account.accountStatus === status
          : true;
        
        return matchesSearch && matchesType && matchesStatus;
      });
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);
      
      return paginatedAccounts;
    },
    
    getTransactionsByClientId: async (
      clientId: string,
      searchQuery: string = "",
      page: number = 1,
      limit: number = 10
    ): Promise<Transaction[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      const filtered = mockTransactions.filter(
        (txn) =>
          txn.clientId === clientId &&
          (
            txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${txn.clientFirstName} ${txn.clientLastName}`.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
  
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit);
    },
  
    getTransactionsByAgentId: async (
      agentId: string,
      searchQuery: string = "",
      page: number = 1,
      limit: number = 10
    ): Promise<Transaction[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      const filtered = mockTransactions.filter(
        (txn) => (
            txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${txn.clientFirstName} ${txn.clientLastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      ));
  
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit);
    }
};

export default accountService;