"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useUser } from "@/contexts/user-context";
import { CreditCard, Search, RefreshCw, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateAccountDialog } from "@/components/client/create-account-dialog";
import { Account, AccountStatus, AccountType } from "@/lib/api/types";
import { handleApiError } from "@/lib/api";
import accountService from "@/lib/api/accountService";
import DeleteAccountButton from "@/components/client/delete-acount-dialog";
import { InfiniteData, keepPreviousData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce"


export default function AccountsPage() {

  const { user, isAdmin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [accountTypeFilter, setAccountTypeFilter] = useState<string | null>(null);
  const [accountStatusFilter, setAccountStatusFilter] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastAccountRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string>("");
  const queryClient = useQueryClient();
    
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({queryKey: 
    [
      "accounts",
      user.userId,
      debouncedSearchQuery,
      accountTypeFilter,
      accountStatusFilter,
      isAdmin
    ],
    queryFn: async ({ pageParam = 1 }) => {
      setError("");

      try {
        if (!user.userId) {
          return [];
        }
        const response = isAdmin
          ? await accountService.getAllAccounts(
              debouncedSearchQuery,
              accountTypeFilter,
              accountStatusFilter,
              pageParam,
              10
            )
          : await accountService.getAccountsByAgentId(
              user.userId,
              debouncedSearchQuery,
              accountTypeFilter,
              accountStatusFilter,
              pageParam,
              10
            )
        return response;
      } catch (err) {
        handleApiError(err);
        setError("Error loading accounts");
        throw err;
      }
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 10 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
  });

  const accounts = data?.pages.flat() || [];

  // Infinite scroll observer
  useEffect(() => {
    const lastElement = lastAccountRef.current;
    if (!lastElement || !hasNextPage || isFetchingNextPage) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, accounts.length]);

  const accountTypes = Object.values(AccountType);
  const accountStatuses = Object.values(AccountStatus);

  const handleRefresh = useCallback(() => {
    setError("");
    refetch();
  }, [refetch]);

  const handleDeleteSuccess = useCallback((deletedAccountId: string) => {
    // Optimistically remove from cache
    queryClient.setQueryData<InfiniteData<Account[]>>(
      ["accounts", user.userId, debouncedSearchQuery, accountTypeFilter, accountStatusFilter, isAdmin],
      (old?: InfiniteData<Account[]>) => {
        if (!old) {
          // Return empty infinite data structure if no existing data
          return {
            pages: [[]], // Array with one empty page
            pageParams: [undefined] // Corresponding page params
          };
        }
        return {
          ...old,
          pages: old.pages.map(page =>
            page.map(account =>
              account.accountId === deletedAccountId
                ? { ...account, accountStatus: "CLOSED" }
                : account
            )
          )
        };
      }
    );
  }, [queryClient, user.userId, debouncedSearchQuery, accountTypeFilter, accountStatusFilter]);

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Account Management
        </h1>
        <p className="text-slate-500">View and manage client accounts</p>
      </div>

      <div className="grid gap-6">
        <DashboardCard
          title="Account Overview"
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">Account Summary</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Accounts:</span>
                    <span className="font-medium">{accounts ? accounts.length : 0}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Accounts:</span>
                    <span className="font-medium">
                      {
                        accounts ? accounts.filter((a) => a.accountStatus === "ACTIVE")
                          .length : 0
                      }
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Inactive/Closed Accounts:</span>
                    <span className="font-medium">
                      {
                        accounts ? accounts.filter((a) => a.accountStatus !== "ACTIVE")
                          .length : 0
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">Account Types</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {accountTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{type}:</span>
                    <span className="font-medium">
                      {accounts ? accounts.filter((a) => a.accountType === type).length : 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Account List"
          className="border-l-4 border-l-slate-700 col-span-2"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <CreateAccountDialog />
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

            {error && !isFetching && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            )}

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search accounts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-500 mr-2">Filters:</span>
                </div>

                <select
                  className="text-sm rounded-md border border-input px-3 py-1"
                  value={accountTypeFilter || ""}
                  onChange={(e) => setAccountTypeFilter(e.target.value || null)}
                >
                  <option value="">All Account Types</option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  className="text-sm rounded-md border border-input px-3 py-1"
                  value={accountStatusFilter || ""}
                  onChange={(e) => setAccountStatusFilter(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  {accountStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAccountTypeFilter(null);
                    setAccountStatusFilter(null);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {isFetching && !isFetchingNextPage && !isRefetching? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading accounts...</p>
              </div>
            ) : accounts.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-100 rounded-md text-xs font-medium">
                  <div className="col-span-3">Client</div>
                  <div className="col-span-3">Account Type</div>
                  <div className="col-span-1">Branch ID</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Opening Date</div>
                  <div className="col-span-2 flex justify-center"><p>Initial Deposit</p></div>
                  <div className="col-span-1">Actions</div>
                </div>
                <div className="max-h-[300px] flex flex-col gap-2 overflow-y-auto">
                  {accounts.map((account, index) => (
                    <div
                      key={account.accountId}
                      ref={index === accounts.length - 1 ? lastAccountRef : null}
                      className="grid grid-cols-12 gap-2 rounded-md border p-3 hover:bg-slate-50 text-sm items-center"
                    >
                      <div className="col-span-3">
                        <p className="font-medium">{account.clientName}</p>
                        <p className="text-xs text-slate-500">
                          ID: {account.clientId}
                        </p>
                      </div>
                     <div className="col-span-3">
                         <p className="font-medium">
                           {account.accountType} Account 
                         </p>
                         <p className="text-xs text-slate-500">
                           ID: {account.accountId} 
                         </p>
                       </div>
                      <div className="col-span-1">{account.branchId}</div>
                      <div className="col-span-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            account.accountStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : account.accountStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.accountStatus}
                        </span>
                      </div>
                      <div className="col-span-1">{account.openingDate}</div>
                      <div className="col-span-2 flex justify-center">
                        <p>
                        {account.initialDeposit} {account.currency}
                        </p>
                      </div>
                      <div className="col-span-1 flex space-x-1">
                      {(account.accountStatus === "PENDING" || account.accountStatus === "ACTIVE") && (
                        <DeleteAccountButton 
                          accountId={account.accountId} 
                          clientId={account.clientId} 
                          clientName={account.clientName}
                          onSuccess={() => handleDeleteSuccess(account.accountId)}
                        />
                      )}
                      </div>
                    </div>
                  ))}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3 py-8">
                <CreditCard className="h-12 w-12 text-slate-300" />
                <p className="text-sm text-slate-500">No accounts found</p>
                <CreateAccountDialog />
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
