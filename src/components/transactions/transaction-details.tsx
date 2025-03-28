import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Transaction } from "@/lib/api/types";
import { DialogFooter } from "@/components/ui/dialog";
import { getStatusColor, getStatusIcon, TRANSACTION_STATUS } from "@/lib/utils/transaction-utils";

interface TransactionDetailsProps {
  transaction: Transaction;
  clientName: string;
  onClose: () => void;
}

export function TransactionDetails({ transaction, clientName, onClose }: Readonly<TransactionDetailsProps>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Transaction #{transaction.id}</h3>
          <div className={`flex items-center ${getStatusColor(transaction.status)}`}>
            {getStatusIcon(transaction.status)}
            <span className="ml-1 capitalize">{transaction.status}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Amount:</span>
            <span className="font-medium">${transaction.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Date:</span>
            <span>{transaction.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-500">Client:</span>
            <span>{clientName}</span>
          </div>
          {transaction.description && (
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Description:</span>
              <span>{transaction.description}</span>
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter>
        {transaction.status === TRANSACTION_STATUS.FAILED && (
          <Button className="mr-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Transaction
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
}
