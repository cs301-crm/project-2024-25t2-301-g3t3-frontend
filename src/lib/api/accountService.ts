import api from './config';
import { AccountDTO } from './types';
import { handleApiError } from './error-handler';

/**
 * Account API Service
 * Provides methods to interact with the account endpoints
 */
export const accountService = {
  /**
   * Get all accounts
   * @returns Promise with array of accounts
   * 
   * Note: The backend doesn't have a GET /accounts endpoint for all accounts.
   * This is a placeholder that will be replaced with a more specific implementation.
   */
  getAllAccounts: async (): Promise<AccountDTO[]> => {
    console.log('Warning: GET /accounts endpoint is not supported by the backend');
    // Return an empty array as a fallback
    return [];
  },

  /**
   * Get an account by ID
   * @param accountId - The ID of the account to retrieve
   * @returns Promise with account data
   */
  getAccountById: async (accountId: string): Promise<AccountDTO> => {
    const response = await api.get(`/accounts/${accountId}`);
    return response.data;
  },

  /**
   * Create a new account
   * @param accountData - The account data to create
   * @returns Promise with the created account
   */
  createAccount: async (accountData: AccountDTO): Promise<AccountDTO> => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  /**
   * Update an existing account
   * @param accountId - The ID of the account to update
   * @param accountData - The updated account data
   * @returns Promise with the updated account
   */
  updateAccount: async (accountId: string, accountData: AccountDTO): Promise<AccountDTO> => {
    const response = await api.put(`/accounts/${accountId}`, accountData);
    return response.data;
  },

  /**
   * Delete an account
   * @param accountId - The ID of the account to delete
   * @returns Promise with the deletion result
   */
  deleteAccount: async (accountId: string): Promise<void> => {
    await api.delete(`/accounts/${accountId}`);
  },

  /**
   * Get accounts by client ID
   * @param clientId - The ID of the client
   * @returns Promise with array of accounts
   */
  getAccountsByClientId: async (clientId: string): Promise<AccountDTO[]> => {
    try {
      // Using the endpoint from the Java controller: @GetMapping("/client/{clientId}")
      const response = await api.get(`/accounts/client/${clientId}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to retrieve accounts for client');
      return []; // Return empty array on error
    }
  },
  
  /**
   * Get accounts for known clients
   * @returns Promise with array of accounts
   */
  getAccountsForKnownClients: async (): Promise<AccountDTO[]> => {
    // Known client IDs in the database
    const knownClientIds = [
      "c1000000-0000-0000-0000-000000000001",
      "c2000000-0000-0000-0000-000000000002",
      "c3000000-0000-0000-0000-000000000003"
    ];
    
    try {
      // Fetch accounts for each known client
      const accountPromises = knownClientIds.map(clientId => 
        accountService.getAccountsByClientId(clientId)
      );
      
      // Wait for all promises to resolve
      const accountsArrays = await Promise.all(accountPromises);
      
      // Log the results for debugging
      accountsArrays.forEach((accounts, index) => {
        console.log(`Client ${knownClientIds[index]} has ${accounts.length} accounts`);
      });
      
      // Flatten the array of arrays into a single array
      const allAccounts = accountsArrays.flat();
      console.log(`Total accounts fetched: ${allAccounts.length}`);
      
      return allAccounts;
    } catch (error) {
      console.error('Error fetching accounts for known clients:', error);
      handleApiError(error, 'Failed to fetch accounts for known clients');
      return []; // Return empty array on error
    }
  }
};

export default accountService;
