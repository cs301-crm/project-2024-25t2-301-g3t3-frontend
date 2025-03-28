"use client";

import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useClient } from '@/contexts/client-context';
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
import { filterTransactions } from "@/lib/utils/transaction-filters";
import { Transaction } from "@/lib/api/types";
import { RefreshCw, CreditCard } from "lucide-react";
import { ClientNotFound } from "@/components/client/clientNotFound";
import { ClientLoading } from "@/components/client/clientLoading";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  const { 
    transactions, 
    loadingTransactions,
    getClientTransactions,
    client,
    loadingClient,
    loadClientError
  } = useClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState<string>("");

  const loadTransactions = async () => {
    try {
      await getClientTransactions();
    } catch (err) {
      console.log(err);
      setError("Failed to load transactions");
    }
  };

  const handleRefresh = () => {
    loadTransactions();
  };

  useEffect(() => {
    loadTransactions();
  }, [client?.clientId]);

  if (loadingClient) {
    return <ClientLoading />;
  }
    
  if (!client && !loadClientError) {
    return <ClientNotFound />;
  }

  // Filter transactions using the simplified filter function
  const filteredTransactions = filterTransactions(transactions || [], searchQuery);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const getTransactionClientName = (transaction: Transaction) => {
    return `${transaction.clientFirstName} ${transaction.clientLastName}`;
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{client && client.firstName} {client && client.lastName}</h1>
        <p className="text-slate-500">{client?.clientId}</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        <DashboardCard 
          title="Transactions Overview" 
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <TransactionSummary transactions={transactions || []} />
          </div>
        </DashboardCard>

        <DashboardCard title="Transaction List" className="border-l-4 border-l-slate-700 col-span-2">
          <div className="flex flex-col space-y-4">
          <div className="flex justify-start">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={loadingTransactions}
              >
                <RefreshCw
                  className={`mr-1 h-4 w-4 ${loadingTransactions ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
            </div>
            <TransactionSearch 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClear={handleClearSearch}
            />
            
            {loadingTransactions ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading transactions...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {filteredTransactions.length > 0 ? (
                  <TransactionList 
                    transactions={filteredTransactions}
                    onViewDetails={handleViewDetails}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <CreditCard className="h-12 w-12 text-slate-300" />
                    <p className="text-sm text-slate-500">
                      {searchQuery ? "No matching transactions found" : "No transactions available"}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleClearSearch}
                      disabled={!searchQuery}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DashboardCard>
      </div>

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
              clientName={getTransactionClientName(selectedTransaction)}
              onClose={handleCloseDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}