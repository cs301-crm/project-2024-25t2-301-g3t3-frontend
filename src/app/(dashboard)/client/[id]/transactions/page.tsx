"use client";

import { useClient } from '@/contexts/client-context';
import { ClientNotFound } from "@/components/client/clientNotFound";
import { ClientLoading } from "@/components/client/clientLoading";
import Transactions from "@/components/transactions/Transactions";

export default function TransactionsPage() {
  const { 
    client,
    loadingClient,
    loadClientError
  } = useClient();

  if (loadingClient) {
    return <ClientLoading />;
  }
    
  if (!client && !loadClientError) {
    return <ClientNotFound />;
  }

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{client && client.firstName} {client && client.lastName}</h1>
        <p className="text-slate-500">{client?.clientId}</p>
      </div>
      <Transactions clientId={client?.clientId}/>
    </div>
  );
}