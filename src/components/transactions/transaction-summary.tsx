import React from "react";
import { Transaction } from "@/contexts/agent-context";
import { TRANSACTION_STATUS } from "@/lib/utils/transaction-utils";

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export function TransactionSummary({ transactions }: Readonly<TransactionSummaryProps>) {
  // Count transactions by status
  const completedCount = transactions.filter(t => t.status === TRANSACTION_STATUS.COMPLETED).length;
  const pendingCount = transactions.filter(t => t.status === TRANSACTION_STATUS.PENDING).length;
  const failedCount = transactions.filter(t => t.status === TRANSACTION_STATUS.FAILED).length;

  return (
    <div className="rounded-md border p-4">
      <h3 className="mb-2 text-sm font-medium">Transaction Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border border-green-100 bg-green-50 p-3 text-center">
          <div className="text-sm text-slate-600">Completed</div>
          <div className="text-xl font-semibold text-green-600">
            {completedCount}
          </div>
        </div>
        <div className="rounded-md border border-yellow-100 bg-yellow-50 p-3 text-center">
          <div className="text-sm text-slate-600">Pending</div>
          <div className="text-xl font-semibold text-yellow-600">
            {pendingCount}
          </div>
        </div>
        <div className="rounded-md border border-red-100 bg-red-50 p-3 text-center">
          <div className="text-sm text-slate-600">Failed</div>
          <div className="text-xl font-semibold text-red-600">
            {failedCount}
          </div>
        </div>
      </div>
    </div>
  );
}
