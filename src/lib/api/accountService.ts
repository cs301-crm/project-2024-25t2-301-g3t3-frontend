import axiosClient from './axiosClient';
import { Account, AccountDTO, Transaction } from './types';
import { handleApiError } from './error-handler';

/**
 * Account API Service
 * Provides methods to interact with the account endpoints
 */
export const accountService = {
  /**
   * Get an account by ID
   * @param accountId - The ID of the account to retrieve
   * @returns Promise with account data
   */
  getAccountById: async (accountId: string): Promise<Account> => {
    try {
      const response = await axiosClient.get(`/accounts/${accountId}`);
      return response.data;

    } catch (error) {
      handleApiError(error, 'Failed to get account');
      throw new Error('Failed to get account');
    }
    
  },

  /**
   * Create a new account
   * @param accountData - The account data to create
   * @returns Promise with the created account
   */
  createAccount: async (accountData: AccountDTO): Promise<Account> => {
    try {
      const response = await axiosClient.post('/accounts', accountData);
      return response.data;

    } catch (error) {
      handleApiError(error, 'Failed to create account');
      throw new Error('Failed to create account');
    }
  },


  /**
   * Delete an account
   * @param accountId - The ID of the account to delete
   * @returns Promise with the deletion result
   */
  deleteAccount: async (accountId: string): Promise<void> => {
    try {
      await axiosClient.delete(`/accounts/${accountId}`);

    } catch (error) {
      handleApiError(error, 'Failed to retrieve accounts for client');
      throw new Error('Failed to delete account');
    }
    
  },

  /**
   * Get accounts by client ID
   * @param clientId - The ID of the client
   * @returns Promise with array of accounts
   */
  getAccountsByClientId: async (clientId: string): Promise<Account[]> => {
    try {
      // Using the endpoint from the Java controller: @GetMapping("/client/{clientId}")
      const response = await axiosClient.get(`/accounts/client/${clientId}`);
      return response.data;

    } catch (error) {
      handleApiError(error, 'Failed to retrieve accounts for client');
      throw new Error('Failed to fetch accounts');
    }
  },

  getAccountsByAgentId: async (
    agentId: string,
    searchQuery: string = "",
    type: string | null = null,
    status: string | null = null,
    page: number = 1,
    limit: number = 10
  ): Promise<Account[]> => {
    try {
      // Create URLSearchParams object
      const params = new URLSearchParams();
      params.append('agentId', agentId);
      
      // Add optional parameters only if they have values
      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
      if (type) {
        params.append('type', type);
      }
      if (status) {
        params.append('status', status);
      }
      
      // Add pagination parameters
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await axiosClient.get(`/accounts?${params.toString()}`);
      
      if (!response) {
        throw new Error('Error fetching accounts');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  getTransactionsByClientId: async (
    clientId: string,
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<Transaction[]> => {
    try {
      const params = new URLSearchParams();
  
      if (searchQuery.trim() !== "") {
        params.append("searchQuery", searchQuery);
      }
  
      params.append("page", page.toString());
      params.append("limit", limit.toString());
  
      const response = await axiosClient.get(`/transactions/client/${clientId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Failed to fetch transactions by client");
    }
  },
  

  getTransactionsByAgentId: async (
    agentId: string,
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<Transaction[]> => {
    try {
      const params = new URLSearchParams();
  
      if (searchQuery.trim() !== "") {
        params.append("searchQuery", searchQuery);
      }
  
      params.append("page", page.toString());
      params.append("limit", limit.toString());
  
      const response = await axiosClient.get(`/transactions/agent/${agentId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error("Failed to fetch transactions by agent");
    }
  },
  

  
  
};

export default accountService;
