"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clientService, accountService, ClientDTO, AccountDTO } from "@/lib/api";
import { handleApiError } from "@/lib/api/error-handler";

// Define client type (internal representation)
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateCreated: string;
  lastUpdated: string;
  // Additional fields from API
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  nric?: string;
}

// Define transaction type (this will be replaced with account data from API)
export interface Transaction {
  id: string;
  clientId: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description?: string;
}

// Define account type (from API)
export interface Account {
  id: string;
  clientId: string;
  accountType: string;
  accountStatus: string;
  openingDate: string;
  initialDeposit: number;
  currency: string;
  branchId: string;
}

// Define the context type
interface AgentContextType {
  agentId: string;
  clients: Client[];
  transactions: Transaction[];
  accounts: Account[];
  loading: boolean;
  error: string | null;
  recentActivities: {
    type: "created" | "updated";
    clientId: string;
    clientName: string;
    timestamp: string;
  }[];
  isClientOwner: (clientId: string) => boolean;
  addClient: (client: Omit<ClientDTO, "clientId">) => Promise<void>;
  updateClient: (clientId: string, updates: Partial<ClientDTO>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  getClientTransactions: (clientId: string) => Transaction[];
  getClientAccounts: (clientId: string) => Account[];
  fetchClientAccounts: (clientId: string) => Promise<Account[]>;
  addAccount: (account: Omit<AccountDTO, "accountId">) => Promise<void>;
  updateAccount: (accountId: string, updates: Partial<AccountDTO>) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  useMockData: boolean;
  setUseMockData: (useMock: boolean) => void;
  refreshData: () => Promise<void>;
}

// Create the context with a default value
const AgentContext = createContext<AgentContextType | undefined>(undefined);

// Mock data for demonstration - using the same client IDs as in clientService for agent001
const mockClients: Client[] = [
  {
    id: "c1000000-0000-0000-0000-000000000001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    dateCreated: "2023-01-15",
    lastUpdated: "2023-03-20",
  },
  {
    id: "c2000000-0000-0000-0000-000000000002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    dateCreated: "2023-02-10",
    lastUpdated: "2023-03-15",
  }
];

const mockTransactions: Transaction[] = [
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

const mockActivities = [
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

// Create a provider component
export function AgentProvider({ children }: { children: ReactNode }) {
  const [agentId] = useState("agent001");
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false); // Default to real API data

  // Function to fetch data from API
  const fetchData = async () => {
    if (useMockData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch clients for this agent
      console.log(`Fetching clients for agent: ${agentId}`);
      const apiClients = await clientService.getClientsByAgentId(agentId);
      console.log(`Fetched ${apiClients.length} clients for agent ${agentId}:`, apiClients);
      
      // Map API clients to our internal format
      const mappedClients: Client[] = apiClients.map(client => ({
        id: client.clientId || `client-${Math.random().toString(36).substr(2, 9)}`,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.emailAddress,
        // Use opening date as a proxy for creation date if available
        dateCreated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        dateOfBirth: client.dateOfBirth,
        gender: client.gender,
        phoneNumber: client.phoneNumber,
        address: client.address,
        city: client.city,
        state: client.state,
        country: client.country,
        postalCode: client.postalCode,
        nric: client.nric
      }));
      
      setClients(mappedClients);
      
      // Fetch accounts for known clients
      console.log("Fetching accounts for known clients...");
      const apiAccounts = await accountService.getAccountsForKnownClients();
      console.log("Fetched accounts:", apiAccounts);
      
      // Map API accounts to our internal format
      const mappedAccounts: Account[] = apiAccounts.map(account => ({
        id: account.accountId || `account-${Math.random().toString(36).substr(2, 9)}`,
        clientId: account.clientId,
        accountType: account.accountType,
        accountStatus: account.accountStatus,
        openingDate: account.openingDate,
        initialDeposit: account.initialDeposit,
        currency: account.currency,
        branchId: account.branchId
      }));
      
      setAccounts(mappedAccounts);
    } catch (err) {
      console.error("Error fetching data:", err);
      handleApiError(err, 'Failed to fetch data from API');
      setError('Failed to fetch data from API');
      // Fallback to mock data
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load or when useMockData changes
  useEffect(() => {
    if (!useMockData) {
      fetchData();
    } else {
      setClients(mockClients);
      setAccounts([]);
    }
  }, [useMockData]);

  const refreshData = async () => {
    if (!useMockData) {
      await fetchData();
    }
  };

  const isClientOwner = (clientId: string) => {
    return clients.some(client => client.id === clientId);
  };

  const addClient = async (clientData: Omit<ClientDTO, "clientId">) => {
    setLoading(true);
    setError(null);
    
    console.log('Adding client with data:', clientData);
    
    try {
      // Add the agentId to the client data
      const clientDataWithAgent = {
        ...clientData,
        agentId
      };
      
      if (useMockData) {
        console.log('Using mock data for client creation');
        // Mock implementation
        const newClient: Client = {
          id: `client${clients.length + 1}`,
          firstName: clientDataWithAgent.firstName,
          lastName: clientDataWithAgent.lastName,
          email: clientDataWithAgent.emailAddress,
          dateCreated: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          dateOfBirth: clientDataWithAgent.dateOfBirth,
          gender: clientDataWithAgent.gender,
          phoneNumber: clientDataWithAgent.phoneNumber,
          address: clientDataWithAgent.address,
          city: clientDataWithAgent.city,
          state: clientDataWithAgent.state,
          country: clientDataWithAgent.country,
          postalCode: clientDataWithAgent.postalCode,
          nric: clientDataWithAgent.nric
        };
        
        setClients([...clients, newClient]);
        console.log('Mock client created:', newClient);
      } else {
        console.log('Using API for client creation');
        // API implementation
        try {
          const createdClient = await clientService.createClient(clientDataWithAgent as ClientDTO);
          console.log('Client created successfully:', createdClient);
          
          // Add the new client to the state
          const newClient: Client = {
            id: createdClient.clientId || `client-${Math.random().toString(36).substr(2, 9)}`,
            firstName: createdClient.firstName,
            lastName: createdClient.lastName,
            email: createdClient.emailAddress,
            dateCreated: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            dateOfBirth: createdClient.dateOfBirth,
            gender: createdClient.gender,
            phoneNumber: createdClient.phoneNumber,
            address: createdClient.address,
            city: createdClient.city,
            state: createdClient.state,
            country: createdClient.country,
            postalCode: createdClient.postalCode,
            nric: createdClient.nric
          };
          
          setClients([...clients, newClient]);
        } catch (apiError) {
          console.error('Error in clientService.createClient:', apiError);
          throw apiError; // Re-throw to be caught by the outer catch block
        }
      }
    } catch (err) {
      console.error('Error in addClient:', err);
      handleApiError(err, 'Failed to add client');
      setError('Failed to add client');
      
      // Display a more detailed error message in the console
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (clientId: string, updates: Partial<ClientDTO>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Mock implementation
        setClients(
          clients.map(client => 
            client.id === clientId 
              ? { 
                  ...client, 
                  firstName: updates.firstName || client.firstName,
                  lastName: updates.lastName || client.lastName,
                  email: updates.emailAddress || client.email,
                  dateOfBirth: updates.dateOfBirth || client.dateOfBirth,
                  gender: updates.gender || client.gender,
                  phoneNumber: updates.phoneNumber || client.phoneNumber,
                  address: updates.address || client.address,
                  city: updates.city || client.city,
                  state: updates.state || client.state,
                  country: updates.country || client.country,
                  postalCode: updates.postalCode || client.postalCode,
                  nric: updates.nric || client.nric,
                  lastUpdated: new Date().toISOString().split('T')[0] 
                } 
              : client
          )
        );
      } else {
        // API implementation
        // First get the current client data
        const client = clients.find(c => c.id === clientId);
        if (!client) {
          throw new Error(`Client with ID ${clientId} not found`);
        }
        
        // Prepare the update data
        const updateData: ClientDTO = {
          clientId,
          firstName: updates.firstName || client.firstName,
          lastName: updates.lastName || client.lastName,
          emailAddress: updates.emailAddress || client.email,
          dateOfBirth: updates.dateOfBirth || client.dateOfBirth || '',
          gender: updates.gender || client.gender || '',
          phoneNumber: updates.phoneNumber || client.phoneNumber || '',
          address: updates.address || client.address || '',
          city: updates.city || client.city || '',
          state: updates.state || client.state || '',
          country: updates.country || client.country || '',
          postalCode: updates.postalCode || client.postalCode || '',
          nric: updates.nric || client.nric || '',
          agentId: agentId // Preserve the agent ID
        };
        
        // Update the client in the API
        await clientService.updateClient(clientId, updateData);
        
        // Update the client in the state
        setClients(
          clients.map(c => 
            c.id === clientId 
              ? { 
                  ...c, 
                  firstName: updates.firstName || c.firstName,
                  lastName: updates.lastName || c.lastName,
                  email: updates.emailAddress || c.email,
                  dateOfBirth: updates.dateOfBirth || c.dateOfBirth,
                  gender: updates.gender || c.gender,
                  phoneNumber: updates.phoneNumber || c.phoneNumber,
                  address: updates.address || c.address,
                  city: updates.city || c.city,
                  state: updates.state || c.state,
                  country: updates.country || c.country,
                  postalCode: updates.postalCode || c.postalCode,
                  nric: updates.nric || c.nric,
                  lastUpdated: new Date().toISOString().split('T')[0] 
                } 
              : c
          )
        );
      }
    } catch (err) {
      handleApiError(err, 'Failed to update client');
      setError('Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (clientId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Mock implementation
        setClients(clients.filter(client => client.id !== clientId));
      } else {
        // API implementation
        await clientService.deleteClient(clientId);
        
        // Remove the client from the state
        setClients(clients.filter(client => client.id !== clientId));
      }
    } catch (err) {
      handleApiError(err, 'Failed to delete client');
      setError('Failed to delete client');
    } finally {
      setLoading(false);
    }
  };

  const getClientTransactions = (clientId: string) => {
    return transactions.filter(transaction => transaction.clientId === clientId);
  };

  const getClientAccounts = (clientId: string) => {
    return accounts.filter(account => account.clientId === clientId);
  };

  const addAccount = async (accountData: Omit<AccountDTO, "accountId">) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Mock implementation
        const newAccount: Account = {
          id: `account${accounts.length + 1}`,
          clientId: accountData.clientId,
          accountType: accountData.accountType,
          accountStatus: accountData.accountStatus,
          openingDate: accountData.openingDate,
          initialDeposit: accountData.initialDeposit,
          currency: accountData.currency,
          branchId: accountData.branchId
        };
        
        setAccounts([...accounts, newAccount]);
      } else {
        // API implementation
        const createdAccount = await accountService.createAccount(accountData);
        
        // Add the new account to the state
        const newAccount: Account = {
          id: createdAccount.accountId || `account-${Math.random().toString(36).substr(2, 9)}`,
          clientId: createdAccount.clientId,
          accountType: createdAccount.accountType,
          accountStatus: createdAccount.accountStatus,
          openingDate: createdAccount.openingDate,
          initialDeposit: createdAccount.initialDeposit,
          currency: createdAccount.currency,
          branchId: createdAccount.branchId
        };
        
        setAccounts([...accounts, newAccount]);
      }
    } catch (err) {
      handleApiError(err, 'Failed to add account');
      setError('Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (accountId: string, updates: Partial<AccountDTO>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Mock implementation
        setAccounts(
          accounts.map(account => 
            account.id === accountId 
              ? { ...account, ...updates } 
              : account
          )
        );
      } else {
        // API implementation
        // First get the current account data
        const account = accounts.find(a => a.id === accountId);
        if (!account) {
          throw new Error(`Account with ID ${accountId} not found`);
        }
        
        // Prepare the update data
        const updateData: AccountDTO = {
          accountId,
          clientId: updates.clientId || account.clientId,
          accountType: updates.accountType || account.accountType,
          accountStatus: updates.accountStatus || account.accountStatus,
          openingDate: updates.openingDate || account.openingDate,
          initialDeposit: updates.initialDeposit !== undefined ? updates.initialDeposit : account.initialDeposit,
          currency: updates.currency || account.currency,
          branchId: updates.branchId || account.branchId
        };
        
        // Update the account in the API
        await accountService.updateAccount(accountId, updateData);
        
        // Update the account in the state
        setAccounts(
          accounts.map(a => 
            a.id === accountId 
              ? { ...a, ...updates } 
              : a
          )
        );
      }
    } catch (err) {
      handleApiError(err, 'Failed to update account');
      setError('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMockData) {
        // Mock implementation
        setAccounts(accounts.filter(account => account.id !== accountId));
      } else {
        // API implementation
        await accountService.deleteAccount(accountId);
        
        // Remove the account from the state
        setAccounts(accounts.filter(account => account.id !== accountId));
      }
    } catch (err) {
      handleApiError(err, 'Failed to delete account');
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAccounts = async (clientId: string): Promise<Account[]> => {
    if (useMockData) {
      // Return mock accounts for this client
      return accounts.filter(account => account.clientId === clientId);
    }
    
    // Skip fetching for mock client IDs (which start with "client")
    if (clientId.startsWith("client")) {
      console.log(`Skipping API fetch for mock client ID: ${clientId}`);
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch accounts for the client from the API
      const apiAccounts = await accountService.getAccountsByClientId(clientId);
      console.log(`Fetched ${apiAccounts.length} accounts for client ${clientId}`);
      
      // Map API accounts to our internal format
      const clientAccounts: Account[] = apiAccounts.map(account => ({
        id: account.accountId || `account-${Math.random().toString(36).substr(2, 9)}`,
        clientId: account.clientId,
        accountType: account.accountType,
        accountStatus: account.accountStatus,
        openingDate: account.openingDate,
        initialDeposit: account.initialDeposit,
        currency: account.currency,
        branchId: account.branchId
      }));
      
      // Update the accounts state with the new accounts
      // Use a function to update state to ensure we're working with the latest state
      setAccounts(prevAccounts => {
        // Remove any existing accounts for this client
        const filteredAccounts = prevAccounts.filter(account => account.clientId !== clientId);
        // Add the new accounts
        return [...filteredAccounts, ...clientAccounts];
      });
      
      return clientAccounts;
    } catch (err) {
      console.error("Error fetching client accounts:", err);
      handleApiError(err, 'Failed to fetch accounts for client');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentContext.Provider 
      value={{ 
        agentId, 
        clients, 
        transactions, 
        accounts,
        loading,
        error,
        recentActivities,
        isClientOwner, 
        addClient, 
        updateClient,
        deleteClient,
        getClientTransactions,
        getClientAccounts,
        fetchClientAccounts,
        addAccount,
        updateAccount,
        deleteAccount,
        useMockData,
        setUseMockData,
        refreshData
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

// Create a hook to use the agent context
export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
}
