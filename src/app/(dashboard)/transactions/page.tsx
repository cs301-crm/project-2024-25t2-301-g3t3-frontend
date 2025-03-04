"use client";

import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useAgent } from "@/contexts/agent-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionSummary } from "@/components/transactions/transaction-summary";
import { TransactionSearch } from "@/components/transactions/transaction-search";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionDetails } from "@/components/transactions/transaction-details";
import { filterTransactions, getClientName } from "@/lib/utils/transaction-filters";

export default function TransactionsPage() {
  const { transactions, clients, refreshData } = useAgent();
  
  // Refresh data when the component mounts
  useEffect(() => {
    refreshData();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filter transactions based on search query
  const filteredTransactions = filterTransactions(transactions, clients, searchQuery);

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handle view transaction details
  const handleViewDetails = (transaction: typeof transactions[0]) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  // Handle close details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">View Transactions</h1>
        <p className="text-slate-500">View and manage client transactions</p>
      </div>

      <div className="grid gap-6">
        <DashboardCard 
          title="Transactions Overview" 
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <TransactionSummary transactions={transactions} />
          </div>
        </DashboardCard>

        <DashboardCard title="Search Transactions" className="border-l-4 border-l-slate-700">
          <div className="flex flex-col space-y-4">
            <TransactionSearch 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClear={handleClearSearch}
            />
          </div>
        </DashboardCard>

        <DashboardCard title="Transaction List" className="border-l-4 border-l-slate-700">
          <TransactionList 
            transactions={filteredTransactions}
            clients={clients}
            onViewDetails={handleViewDetails}
          />
        </DashboardCard>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about the transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <TransactionDetails 
              transaction={selectedTransaction}
              clientName={getClientName(selectedTransaction.clientId, clients)}
              onClose={handleCloseDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
