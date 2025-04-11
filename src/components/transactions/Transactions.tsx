"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  RefreshCw,
  BadgeDollarSign,
  Eye,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useUser } from "@/contexts/user-context";
import { useDebounce } from "@/hooks/use-debounce";
import accountService from "@/lib/api/accountService";
import { Transaction } from "@/lib/api/types";
import { TransactionSummary } from "./transaction-summary";
import { TransactionSearch } from "./transaction-search";
import { TransactionDetails } from "./transaction-details";
import { getStatusColor, getStatusIcon } from "@/lib/utils/transaction-utils";


interface TransactionsPageProps {
  clientId?: string;
}

export default function Transactions({ clientId }: TransactionsPageProps) {
  const { user, isAdmin } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [error, setError] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastTransactionRef = useRef<HTMLDivElement | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async ({ pageParam = 1 }) => {
    setError("");
    try {
      if (clientId) {
        return await accountService.getTransactionsByClientId(
          clientId,
          debouncedSearchQuery,
          pageParam,
          10
        );
      } else {
        if(isAdmin){
          return await accountService.getAllTransactions(
            debouncedSearchQuery,
            pageParam,
            10
          );
        } else {
          return await accountService.getTransactionsByAgentId(
            user.userId,
            debouncedSearchQuery,
            pageParam,
            10
          );
        }
       
      }
    } catch (err) {
      setError("Failed to load transactions");
      throw err;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["transactions", clientId ?? user.userId, debouncedSearchQuery],
    queryFn: fetchTransactions,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const transactions = data?.pages.flat() || [];

  useEffect(() => {
    const last = lastTransactionRef.current;
    if (!last || !hasNextPage || isFetchingNextPage) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    observer.observe(last);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, transactions.length]);

  const handleRefresh = useCallback(() => {
    setError("");
    refetch();
  }, [refetch]);

  const handleSearchChange = (value: string) => setSearchQuery(value);
  const handleClearSearch = () => setSearchQuery("");

  const handleViewDetails = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedTransaction(null);
  };

  const getClientName = (tx: Transaction) => `${tx.clientFirstName} ${tx.clientLastName}`;

  return (
    <>
      {error && !isFetching &&(
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
            <TransactionSummary transactions={transactions} />
          </div>
        </DashboardCard>

        <DashboardCard
          title="Transaction List"
          className="border-l-4 border-l-slate-700 col-span-2"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-start">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
            </div>

            <TransactionSearch
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClear={handleClearSearch}
            />

            {isFetching && !isFetchingNextPage && !isRefetching ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading transactions...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {transactions.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                  {transactions.map((transaction, index) => {
                    const isLast = index === transactions.length - 1;
                    return (
                      <div
                        key={transaction.id}
                        ref={isLast ? lastTransactionRef : null}
                        className="rounded-md border p-3 hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              {getStatusIcon(transaction.status)}
                              <p className="ml-1 text-sm font-medium">
                                Transaction #{transaction.id}
                              </p>
                            </div>
                            <p className="text-xs text-slate-500">
                              Client: {getClientName(transaction)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                              ${transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(transaction.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                    {isFetchingNextPage && (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    )}
                </div>
                
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <BadgeDollarSign className="h-12 w-12 text-slate-300" />
                    <p className="text-sm text-slate-500">
                      {searchQuery
                        ? "No matching transactions found"
                        : "No transactions available"}
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
              clientName={getClientName(selectedTransaction)}
              onClose={handleCloseDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
