"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from "react";
import { usePathname } from "next/navigation";
import clientService from "@/lib/api/clientService";
import accountService from "@/lib/api/accountService";
import { Client, Account, AccountDTO } from '@/lib/api/types';


// Context type definition
interface ClientContextType {
  client: Client | null;
  accounts: Account[] | null;
  loadingAction: boolean;
  loadingClient: boolean;
  loadingAccounts: boolean;
  loadClientError: string | null;
  setClient: (client: Client | null) => void; 
  fetchClient: () => Promise<void>;
  updateClient: (updates: Partial<Client>) => Promise<void>;
  reassignAgent: (newAgentId: string) => Promise<void>;
  deleteClient: () => Promise<void>;
  fetchClientAccounts: () => Promise<void>;
  addAccount: (addAccount: Omit<AccountDTO, "accountId">) => Promise<Account>;
  deleteAccount: (accountId: string, accountClientId: string) => Promise<void>;
}

// Create the context
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Provider component
export function ClientProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loadingClient, setLoadingClient] = useState<boolean>(false);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(false);
  const [loadingAction, setLoadingAction ] = useState<boolean>(false);
  const [loadClientError, setLoadClientError] = useState<string | null>(null);
  const pathname = usePathname();

  // Extract clientId from URL (e.g., /client/{id}/accounts → "id")
  const match = pathname.match(/^\/client\/([^/]+)/);
  const clientId = match ? match[1] : null;

 
  const fetchClient = useCallback(async () => {
    if (!clientId) return;

    setLoadingClient(true);
    setLoadClientError(null);

    try {
        const response = await clientService.getClientById(clientId);
        setClient(response);
        console.log("Fetched client:", response);
    } catch (err) {
      setLoadClientError("Failed to load client");
      console.log(err);
      throw new Error("Failed to fetch client"); 
    } finally {
        setLoadingClient(false);
    }
  }, [clientId]);


  const updateClient = useCallback(
      async (updates: Partial<Client>) => {
      if (!client || !clientId) return;
      setLoadingAction(true);
      try {
        const updateData: Client = {
            clientId,
            firstName: updates.firstName ?? client.firstName,
            lastName: updates.lastName ?? client.lastName,
            emailAddress: updates.emailAddress ?? client.emailAddress,
            dateOfBirth: updates.dateOfBirth ?? client.dateOfBirth ?? '',
            gender: updates.gender ?? client.gender ?? '',
            phoneNumber: updates.phoneNumber ?? client.phoneNumber ?? '',
            address: updates.address ?? client.address ?? '',
            city: updates.city ?? client.city ?? '',
            state: updates.state ?? client.state ?? '',
            country: updates.country ?? client.country ?? '',
            postalCode: updates.postalCode ?? client.postalCode ?? '',
            nric: updates.nric ?? client.nric ?? '',
            agentId: client.agentId,
          };
        await clientService.updateClient(clientId, updateData);
        setClient((prev) =>
          prev
            ? {
                ...prev,
                ...updates
              }
            : prev
        );
      } catch (err) {
        console.log(err);
        throw new Error("Failed to update client"); 
      } finally {
        setLoadingAction(false);
      }
    },
    [clientId, client] 
  );

  const deleteClient = useCallback(async () => {
    if(!clientId){return}
    if(accounts && accounts?.length > 0){
      await fetchClientAccounts();
      throw new Error("Client has existing account(s)."); 
    }
    try {
      await clientService.deleteClient(clientId);
    } catch (err) {
      console.log(err);
      throw new Error("Please try again later"); 
    } 
  }, [clientId, accounts]); 

  const deleteAccount = useCallback(async (accountId: string, accountClientId: string) => {
    if (!accountId) return;
    
    setLoadingAction(true);
    try {
      await accountService.deleteAccount(accountId);
      
      if(clientId === accountClientId){
        setAccounts(prevAccounts => {
          if (!prevAccounts) return prevAccounts;
          return prevAccounts.filter(account => account.accountId !== accountId);
        });
      }
  
    } catch (err) {
      console.log(err);
      throw new Error("Failed to delete account"); 
    } finally {
      setLoadingAction(false);
    }
  }, [clientId]); 
  
  const fetchClientAccounts = useCallback(async () => {
    if(!clientId){return}
    setLoadingAccounts(true);
    try {
      const fetchedAccounts = await accountService.getAccountsByClientId(clientId);
      setAccounts(fetchedAccounts);
      console.log(accounts);
    } catch (err) {
      console.log(err);
      throw new Error("Unable to load accounts"); 
    } finally {
      setLoadingAccounts(false);
    }
  }, [clientId]);

  const addAccount = async (accountData: Omit<AccountDTO, "accountId">) => {
      setLoadingAction(true);
      
      try {
          const createdAccount = await accountService.createAccount(accountData);
          
          if(client && clientId === createdAccount.clientId && accounts){
              setAccounts([...accounts, createdAccount]);
           }
          return createdAccount;
      } catch (err) {
        throw err;
      } finally {
        setLoadingAction(false);
      }
    };

    const reassignAgent = useCallback(
      async (newAgentId: string) => {
        if (!client || !clientId) return;
        setLoadingAction(true);
        try {
          const updateData: Client = {
            clientId,
            firstName: client.firstName,
            lastName: client.lastName,
            emailAddress: client.emailAddress,
            dateOfBirth: client.dateOfBirth ?? '',
            gender: client.gender ?? '',
            phoneNumber: client.phoneNumber ?? '',
            address: client.address ?? '',
            city: client.city ?? '',
            state: client.state ?? '',
            country: client.country ?? '',
            postalCode: client.postalCode ?? '',
            nric: client.nric ?? '',
            agentId: newAgentId,
          };
          await clientService.updateClient(clientId, updateData);
          setClient((prev) =>
            prev
              ? {
                  ...prev,
                  agentId: newAgentId,
                }
              : prev
          );
        } catch (err) {
          console.log(err);
          throw new Error("Failed to reassign agent");
        } finally {
          setLoadingAction(false);
        }
      },
      [clientId, client]
    );
    

    useEffect(() => {
      if (!clientId){
        setClient(null);
        return;
      }
       
      fetchClient();
      fetchClientAccounts();
    }, [clientId, fetchClient]);
    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
        client,
        loadingClient,
        loadingAccounts,
        loadingAction,
        loadClientError,
        accounts,
        reassignAgent,
        fetchClient,
        setClient,
        updateClient,
        fetchClientAccounts,
        addAccount,
        deleteClient,
        deleteAccount
        }),
        [client, loadingClient, accounts, loadingAccounts, loadingAction, loadClientError, reassignAgent, setClient, fetchClient, updateClient, fetchClientAccounts, addAccount, deleteAccount, deleteClient]
    );

  return <ClientContext.Provider value={contextValue}>{children}</ClientContext.Provider>;
}

// Hook for easy access
export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}
