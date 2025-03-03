import api from './config';
import { ClientDTO } from './types';

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
  getClientsByAgentId: async (agentId: string): Promise<ClientDTO[]> => {
    console.log(`Fetching clients for agent: ${agentId}`);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate with known client IDs for agent001
      if (agentId === "agent001") {
        // Known client IDs for agent001
        const agentClientIds = [
          "c1000000-0000-0000-0000-000000000001",
          "c2000000-0000-0000-0000-000000000002"
        ];
        
        // Fetch each client by ID
        const clientPromises = agentClientIds.map(id => clientService.getClientById(id));
        const clients = await Promise.all(clientPromises);
        
        // Add the agentId to each client
        const clientsWithAgentId = clients.map(client => ({
          ...client,
          agentId
        }));
        
        console.log('Successfully fetched clients for agent:', clientsWithAgentId);
        return clientsWithAgentId;
      } else {
        console.log('No clients found for this agent');
        return [];
      }
    } catch (error) {
      console.error(`Error fetching clients for agent ${agentId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all clients
   * @returns Promise with array of clients
   * 
   * Note: The backend doesn't support a GET /clients endpoint for all clients.
   * Instead, we fetch specific clients by ID that we know exist in the database.
   */
  getAllClients: async (): Promise<ClientDTO[]> => {
    console.log('Fetching known clients from API');
    
    // Known client IDs in the database
    const knownClientIds = [
      "c1000000-0000-0000-0000-000000000001",
      "c2000000-0000-0000-0000-000000000002",
      "c3000000-0000-0000-0000-000000000003"
    ];
    
    try {
      // Fetch each client by ID
      const clientPromises = knownClientIds.map(id => clientService.getClientById(id));
      const clients = await Promise.all(clientPromises);
      
      console.log('Successfully fetched clients:', clients);
      return clients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Re-throw the error
      throw error;
    }
  },

  /**
   * Get a client by ID
   * @param clientId - The ID of the client to retrieve
   * @returns Promise with client data
   */
  getClientById: async (clientId: string): Promise<ClientDTO> => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },

  /**
   * Create a new client
   * @param clientData - The client data to create
   * @returns Promise with the created client
   */
  createClient: async (clientData: ClientDTO): Promise<ClientDTO> => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  /**
   * Update an existing client
   * @param clientId - The ID of the client to update
   * @param clientData - The updated client data
   * @returns Promise with the updated client
   */
  updateClient: async (clientId: string, clientData: ClientDTO): Promise<ClientDTO> => {
    const response = await api.put(`/clients/${clientId}`, clientData);
    return response.data;
  },

  /**
   * Delete a client
   * @param clientId - The ID of the client to delete
   * @returns Promise with the deletion result
   */
  deleteClient: async (clientId: string): Promise<void> => {
    await api.delete(`/clients/${clientId}`);
  },

  /**
   * Verify a client
   * @param clientId - The ID of the client to verify
   * @param nric - The NRIC to verify against
   * @returns Promise with the verification result
   */
  verifyClient: async (clientId: string, nric: string): Promise<{ verified: boolean }> => {
    const response = await api.post(`/clients/${clientId}/verify`, { nric });
    return response.data;
  }
};

export default clientService;
