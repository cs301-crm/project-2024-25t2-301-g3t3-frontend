"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useAgent } from "@/contexts/agent-context";
import { 
  Users, 
  Search, 
  Trash2,
  RefreshCw,
  Database,
  Server,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateClientDialog } from "@/components/client/create-client-dialog";
import { CreateAccountDialog } from "@/components/client/create-account-dialog";
import { EditAccountDialog } from "@/components/client/edit-account-dialog";
import { EditClientDialog } from "@/components/client/edit-client-dialog";

export default function ClientsPage() {
  const { 
    clients, 
    loading, 
    error, 
    useMockData, 
    setUseMockData, 
    refreshData,
    deleteClient,
    deleteAccount,
    getClientAccounts,
    fetchClientAccounts
  } = useAgent();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // Refresh data when the component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  // Check if we're coming from the Account Management tab
  useEffect(() => {
    // Create a flag to track if the component is mounted
    let isMounted = true;
    
    const tab = searchParams.get('tab');
    if (tab === 'accounts' && clients.length > 0) {
      const firstClientId = clients[0]?.id;
      if (firstClientId) {
        // Expand the first client to show accounts
        setExpandedClient(firstClientId);
        
        // Fetch accounts for the first client if using API data
        if (!useMockData && isMounted) {
          // Skip mock client IDs (which start with "client")
          if (firstClientId.startsWith("client")) {
            console.log(`Skipping API fetch for mock client ID: ${firstClientId}`);
          } else {
            const fetchAccounts = async () => {
              try {
                await fetchClientAccounts(firstClientId);
              } catch (error) {
                console.error("Error fetching client accounts:", error);
              }
            };
            
            fetchAccounts();
          }
        }
      }
    }
    
    // Cleanup function to set mounted flag to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, [searchParams, clients, useMockData, fetchClientAccounts]);

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await deleteClient(clientId);
    }
  };

  // Use a ref to track if we're currently fetching accounts
  const isFetchingRef = useRef(false);
  
  const toggleClientExpand = async (clientId: string) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
    } else {
      setExpandedClient(clientId);
      
      // Fetch accounts for this client when expanded
      if (!useMockData && !isFetchingRef.current) {
        // Skip mock client IDs (which start with "client")
        if (clientId.startsWith("client")) {
          console.log(`Skipping API fetch for mock client ID: ${clientId}`);
        } else {
          isFetchingRef.current = true;
          try {
            await fetchClientAccounts(clientId);
          } catch (error) {
            console.error("Error fetching client accounts:", error);
          } finally {
            isFetchingRef.current = false;
          }
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, clientId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleClientExpand(clientId);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
        <p className="text-slate-500">Create and manage your client profiles</p>
      </div>

      <div className="grid gap-6">
        <DashboardCard 
          title="Client Overview" 
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">Client Summary</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Clients:</span>
                    <span className="font-medium">{clients.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Recently Added:</span>
                    <span className="font-medium">
                      {clients.filter(c => {
                        const date = new Date(c.dateCreated);
                        const now = new Date();
                        const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                        return diffDays <= 7;
                      }).length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Recently Updated:</span>
                    <span className="font-medium">
                      {clients.filter(c => {
                        const date = new Date(c.lastUpdated);
                        const now = new Date();
                        const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                        return diffDays <= 7;
                      }).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Client List" className="border-l-4 border-l-slate-700 col-span-2">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <CreateClientDialog compact={true} />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => refreshData()}
                disabled={loading}
              >
                <RefreshCw className={`mr-1 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button 
                size="sm" 
                variant={useMockData ? "outline" : "default"} 
                onClick={() => setUseMockData(false)}
                disabled={!useMockData || loading}
              >
                <Server className="mr-1 h-4 w-4" />
                Use API Data
              </Button>
              <Button 
                size="sm" 
                variant={useMockData ? "default" : "outline"} 
                onClick={() => setUseMockData(true)}
                disabled={useMockData || loading}
              >
                <Database className="mr-1 h-4 w-4" />
                Use Mock Data
              </Button>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading clients...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {filteredClients.length > 0 ? (
                  <div className="space-y-3">
                    {filteredClients.map((client) => (
                      <div 
                        key={client.id} 
                        className="rounded-md border p-3 hover:bg-slate-50"
                      >
                        <div 
                          role="button"
                          tabIndex={0}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleClientExpand(client.id)}
                          onKeyDown={(e) => handleKeyDown(e, client.id)}
                          aria-expanded={expandedClient === client.id}
                          aria-controls={`client-details-${client.id}`}
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-xs text-slate-500">{client.email}</p>
                            {client.phoneNumber && (
                              <p className="text-xs text-slate-500">{client.phoneNumber}</p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-2">
                              <p className="text-xs text-slate-400">Created: {client.dateCreated}</p>
                              <p className="text-xs text-slate-400">Updated: {client.lastUpdated}</p>
                            </div>
                            {expandedClient === client.id ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedClient === client.id && (
                          <div 
                            id={`client-details-${client.id}`}
                            className="mt-3 border-t pt-3"
                          >
                            <div className="mb-2 flex justify-between items-center">
                              <h4 className="text-sm font-medium">Account Management</h4>
                              <CreateAccountDialog 
                                clientId={client.id} 
                                clientName={`${client.firstName} ${client.lastName}`} 
                              />
                            </div>
                            
                            {getClientAccounts(client.id).length > 0 ? (
                              <div className="space-y-2">
                                {getClientAccounts(client.id).map((account) => (
                                  <div key={account.id} className="rounded-md bg-slate-50 p-2 text-xs">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">{account.accountType}</span>
                                      <div className="flex items-center space-x-1">
                                        <span className={`${
                                          account.accountStatus === 'ACTIVE' 
                                            ? 'text-green-600' 
                                            : account.accountStatus === 'INACTIVE' 
                                            ? 'text-yellow-600' 
                                            : 'text-red-600'
                                        }`}>
                                          {account.accountStatus}
                                        </span>
                                        <EditAccountDialog 
                                          account={account} 
                                          clientName={`${client.firstName} ${client.lastName}`} 
                                        />
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-7 w-7"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Are you sure you want to delete this account?")) {
                                              deleteAccount(account.id);
                                            }
                                          }}
                                        >
                                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <span>Initial Deposit: {account.initialDeposit} {account.currency}</span>
                                      <span>Opened: {account.openingDate}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 italic">No accounts found for this client</p>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-2 flex justify-end space-x-2">
                          <EditClientDialog client={client} />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <Users className="h-12 w-12 text-slate-300" />
                    <p className="text-sm text-slate-500">No clients found</p>
                    <CreateClientDialog />
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