"use client";

import Transactions from "@/components/transactions/Transactions";

export default function TransactionsPage() {


  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">View Transactions</h1>
          <p className="text-slate-500">View and manage client transactions</p>
      </div>
      <Transactions/>
    </div>
  );
}