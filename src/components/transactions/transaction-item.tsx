import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Transaction } from "@/lib/api/types";
import { getStatusColor, getStatusIcon } from "@/lib/utils/transaction-utils";

interface TransactionItemProps {
  transaction: Transaction;
  clientName: string;
  onViewDetails: () => void;
}

export function TransactionItem({ transaction, clientName, onViewDetails }: Readonly<TransactionItemProps>) {
  return (
    <div className="rounded-md border p-3 hover:bg-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            {getStatusIcon(transaction.status)}
            <p className="ml-1 text-sm font-medium">
              Transaction #{transaction.id}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Client: {clientName}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
            ${transaction.amount}
          </p>
          <p className="text-xs text-slate-400">{transaction.date}</p>
        </div>
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onViewDetails}
        >
          <Eye className="mr-1 h-3 w-3" />
          View Details
        </Button>
      </div>
    </div>
  );
}
