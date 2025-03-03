import React from "react";
import { Transaction, Client } from "@/contexts/agent-context";
import { TransactionItem } from "./transaction-item";
import { getClientName } from "@/lib/utils/transaction-filters";

interface TransactionListProps {
  transactions: Transaction[];
  clients: Client[];
  onViewDetails: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, clients, onViewDetails }: Readonly<TransactionListProps>) {
  return (
    <div className="max-h-[400px] overflow-y-auto pr-2">
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              clientName={getClientName(transaction.clientId, clients)}
              onViewDetails={() => onViewDetails(transaction)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No transactions found</p>
      )}
    </div>
  );
}
