import { Transaction } from "@/lib/api/types";

/**
 * Gets the full client name from a transaction
 * @param transaction - Transaction object containing client names
 * @returns Formatted "FirstName LastName" string
 */
export function getClientName(transaction: Transaction): string {
  return `${transaction.clientFirstName} ${transaction.clientLastName}`.trim();
}

/**
 * Filters transactions based on search query (searches all text fields including client names)
 * @param transactions - Array of transactions to filter
 * @param searchQuery - Search string to filter by
 * @returns Filtered array of transactions
 */
export function filterTransactions(
  transactions: Transaction[],
  searchQuery: string
): Transaction[] {
  // Return all transactions if search query is empty
  if (!searchQuery.trim()) return transactions;
  
  const searchLower = searchQuery.toLowerCase();
  
  return transactions.filter(transaction => {
    // Get full client name once for reuse
    const clientFullName = getClientName(transaction).toLowerCase();
    
    // Prepare all searchable fields
    const searchableFields = [
      transaction.id,
      transaction.amount.toString(),
      transaction.status,
      transaction.date,
      transaction.description || '',
      transaction.clientFirstName.toLowerCase(),
      transaction.clientLastName.toLowerCase(),
      clientFullName
    ];

    // Check if any field contains the search query
    return searchableFields.some(field => field.includes(searchLower));
  });
}