"use client";

import { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { CreditCard, Search, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateAccountDialog } from "@/components/client/create-account-dialog";
import { useClient } from '@/contexts/client-context'
import DeleteAccountButton from "@/components/client/delete-acount-dialog";
import { ClientNotFound } from "@/components/client/clientNotFound";
import { ClientLoading } from "@/components/client/clientLoading";

export default function AccountsPage() {
  const { client, loadingClient, accounts, loadingAccounts, loadClientError, fetchClientAccounts } = useClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string | null>(null);
  const [accountStatusFilter, setAccountStatusFilter] = useState<string | null>(null);

  const loadClientAccounts = async () => {
    try{
      await fetchClientAccounts();
    } catch (err) {
      console.log(err);
      setError("Failed to load accounts");
    }
  }

  const handleRefresh = () => {
    loadClientAccounts();
  }

  useEffect(() => {
    loadClientAccounts();
  }, []); 

  if (loadingClient) {
    return <ClientLoading />;
  }
    
  if (!client && !loadClientError) {
    return <ClientNotFound />;
  }

  // Filter accounts based on search query and filters
  const filteredAccounts = accounts && accounts.length > 0 
  ? accounts.filter((account) => {

      if (!client) return false;
      const clientName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      // Apply search filter
      const matchesSearch = 
        clientName.includes(searchLower) ||
        account.accountType.toLowerCase().includes(searchLower) ||
        account.accountStatus.toLowerCase().includes(searchLower) ||
        (account.accountId && account.accountId.toLowerCase().includes(searchLower));

      // Apply account type filter
      const matchesType = accountTypeFilter
        ? account.accountType === accountTypeFilter
        : true;

      // Apply account status filter
      const matchesStatus = accountStatusFilter
        ? account.accountStatus === accountStatusFilter
        : true;

      return matchesSearch && matchesType && matchesStatus;
    }) 
  : [];


  // Get unique account types and statuses for filters
  const accountTypes = [
    ...new Set(accounts && accounts.length > 0 ? accounts.map((account) => account.accountType) : []),
  ];
  const accountStatuses = [
    ...new Set(accounts && accounts.length > 0 ? accounts.map((account) => account.accountStatus) : []),
  ];

  // Get client name 
  const getClientName = () => {
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };

  return (
    <div className="flex flex-col space-y-4 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {getClientName() === "Unknown Client" ? "" : getClientName()}
        </h1>
        <p className="text-slate-500">{client?.clientId}</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
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
              <CreateAccountDialog clientId={client?.clientId} clientName={getClientName()}/>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRefresh()}
                disabled={loadingAccounts}
              >
                <RefreshCw
                  className={`mr-1 h-4 w-4 ${loadingAccounts ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
            </div>

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
                  onChange={(e) =>
                    setAccountStatusFilter(e.target.value || null)
                  }
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

            {loadingAccounts ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading accounts...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {filteredAccounts.length > 0 ? (
                   <div className="space-y-3">
                   <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-100 rounded-md text-xs font-medium">
                     <div className="col-span-3">Account</div> 
                     <div className="col-span-2">Type</div> 
                     <div className="col-span-1">Branch</div> 
                     <div className="col-span-1">Status</div>
                     <div className="col-span-2">Opened</div> 
                     <div className="col-span-2">Initial Deposit</div>  
                     <div className="col-span-1">Actions</div>
                   </div>
                   <div className="max-h-[300px] flex flex-col gap-2 overflow-y-auto">
                   {filteredAccounts.map((account) => (
                     <div
                       key={account.accountId}
                       className="grid grid-cols-12 gap-2 rounded-md border p-3 hover:bg-slate-50 text-sm items-center"
                     >
                       <div className="col-span-3">
                         <p className="font-medium">
                           {account.accountType} Account 
                         </p>
                         <p className="text-xs text-slate-500">
                           ID: {account.accountId} 
                         </p>
                       </div>
                       <div className="col-span-2">{account.accountType}</div>
                       <div className="col-span-1">{account.branchId}</div>
                       <div className="col-span-1">
                         <span
                           className={`text-xs px-2 py-1 rounded-full ${
                             account.accountStatus === "ACTIVE"
                               ? "bg-green-100 text-green-800"
                               : account.accountStatus === "INACTIVE"
                               ? "bg-yellow-100 text-yellow-800"
                               : "bg-red-100 text-red-800"
                           }`}
                         >
                           {account.accountStatus}
                         </span>
                       </div>
                       <div className="col-span-2">{account.openingDate}</div>
                       <div className="col-span-2">
                         {account.initialDeposit} {account.currency}
                       </div>
                       <div className="col-span-1 flex space-x-1">
                         <DeleteAccountButton accountId={account.accountId} clientId={account.clientId} clientName={account.clientName}/>
                       </div>
                     </div>
                   ))}
                   </div>
                 </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <CreditCard className="h-12 w-12 text-slate-300" />
                    <p className="text-sm text-slate-500">No accounts found</p>
                    <CreateAccountDialog clientId={client?.clientId} clientName={getClientName()}/>
                  </div>
                )}
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
