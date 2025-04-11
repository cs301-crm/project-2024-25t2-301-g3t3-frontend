import { AxiosError } from 'axios';
import axiosClient from './axiosClient';
import { handleApiError } from './error-handler';
import { Client, ClientDTO, CommunicationsEntry, LogEntry } from './types';

/**
 * Client API Service
 * Provides methods to interact with the client endpoints
 */
export const clientService = {
  /**
   * Get clients by agent ID
   * @param agentId - The ID of the agent whose clients to retrieve
   * @returns Promise with array of clients
   */

  getAllClients: async (
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<Partial<Client>[]> => {
    try {
      // Create URLSearchParams object to handle query parameters
      const params = new URLSearchParams();

      // Only append searchQuery if it's not empty
      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
      
      // Always include pagination parameters
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await axiosClient.get(`/clients?${params.toString()}`);
      
      if (!response) {
        throw new Error('Error fetching clients');
      }
      
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getClientsByAgentId: async (
    agentId: string,
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<Partial<Client>[]> => {
    try {
      // Create URLSearchParams object to handle query parameters
      const params = new URLSearchParams();

      // Only append searchQuery if it's not empty
      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
      
      // Always include pagination parameters
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await axiosClient.get(`/clients/${agentId}?${params.toString()}`);
      
      if (!response) {
        throw new Error('Error fetching clients');
      }
      
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Get a client by ID
   * @param clientId - The ID of the client to retrieve
   * @returns Promise with client data
   */
  getClientById: async (clientId: string): Promise<Client> => {
    try {
      const response = await axiosClient.get(`/clients/${clientId}`);
      return response.data;

    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch client');
    }
  },

  /**
   * Create a new client
   * @param clientData - The client data to create
   * @returns Promise with the created client
   */
  createClient: async (clientData: ClientDTO): Promise<Client> => {
    try {
      const response = await axiosClient.post('/clients', clientData);
      console.log(response.data);
      return response.data;

    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to create client');
    }
  },

  /**
   * Update an existing client
   * @param clientId - The ID of the client to update
   * @param clientData - The updated client data
   * @returns Promise with the updated client
   */
  updateClient: async (clientId: string, clientData: Client): Promise<Client> => {
    try {
      const response = await axiosClient.put(`/clients/${clientId}`, clientData);
      return response.data;

    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to update client');
    }
  },

  /**
   * Delete a client
   * @param clientId - The ID of the client to delete
   * @returns Promise with the deletion result
   */
  deleteClient: async (clientId: string): Promise<void> => {
    try {
      await axiosClient.delete(`/clients/${clientId}`);

    } catch (error) {
      handleApiError(error);
      let errorMessage = 'Internal server error';
  
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
   
  },

  getLogsByClientId: async (
    clientId: string,
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<LogEntry[]> => {
    try {
      const params = new URLSearchParams();
      params.append('clientId', clientId);
  
      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
  
      params.append('page', page.toString());
      params.append('limit', limit.toString());
  
      const response = await axiosClient.get(`/client-logs/client?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch logs');
    }
  },
  

  getLogsByAgentId: async (
    agentId: string,
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<LogEntry[]> => {
    try {
      const params = new URLSearchParams();
      params.append('agentId', agentId);
  
      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
  
      params.append('page', page.toString());
      params.append('limit', limit.toString());
  
      const response = await axiosClient.get(`/client-logs/agent?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch logs');
    }
  },


  getCommunicationsByAgentId: async (
    agentId: string,
    searchQuery: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<CommunicationsEntry[]> => {
    try {
      const params = new URLSearchParams();

      if (searchQuery.trim() !== "") {
        params.append('searchQuery', searchQuery);
      }
  
      params.append('page', page.toString());
      params.append('limit', limit.toString());
  
      const response = await axiosClient.get(`/communications/${agentId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch communications');
    }
  },

  /**
   * Verify a client
   * @param clientId - The ID of the client to verify
   * @param nric - The NRIC to verify against
   * @returns Promise with the verification result
   */
  verifyClient: async (clientId: string, nric: string): Promise<{ verified: boolean }> => {
    const response = await axiosClient.post(`/clients/${clientId}/verify`, { nric });
    return response.data;
  }
};

export default clientService;
