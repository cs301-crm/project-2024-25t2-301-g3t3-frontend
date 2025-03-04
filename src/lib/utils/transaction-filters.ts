import { Transaction, Client } from "@/contexts/agent-context";

/**
 * Filter transactions based on search query
 * @param transactions List of transactions to filter
 * @param clients List of clients for name lookup
 * @param searchQuery Search query string
 * @returns Filtered list of transactions
 */
export function filterTransactions(
  transactions: Transaction[],
  clients: Client[],
  searchQuery: string
): Transaction[] {
  if (!searchQuery.trim()) {
    return transactions;
  }
  
  const searchLower = searchQuery.toLowerCase();
  
  return transactions.filter((transaction) => {
    // Get client for this transaction
    const client = clients.find(client => client.id === transaction.clientId);
    
    // Check if any field matches the search query
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower) ||
      transaction.date.toLowerCase().includes(searchLower) ||
      (transaction.description?.toLowerCase().includes(searchLower) || false) ||
      client?.firstName.toLowerCase().includes(searchLower) ||
      client?.lastName.toLowerCase().includes(searchLower)
    );
  });
}

/**
 * Get client name from client ID
 * @param clientId Client ID
 * @param clients List of clients
 * @returns Client name or "Unknown Client" if not found
 */
export function getClientName(clientId: string, clients: Client[]): string {
  const client = clients.find(client => client.id === clientId);
  return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
}
