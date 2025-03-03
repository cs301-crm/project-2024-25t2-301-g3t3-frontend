import { CheckCircle, Clock, XCircle } from "lucide-react";
import React, { ReactNode } from "react";

// Transaction status constants
export const TRANSACTION_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

// Get status color based on transaction status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case TRANSACTION_STATUS.COMPLETED:
      return "text-green-500";
    case TRANSACTION_STATUS.PENDING:
      return "text-yellow-500";
    case TRANSACTION_STATUS.FAILED:
      return "text-red-500";
    default:
      return "text-slate-500";
  }
};

// Get status icon based on transaction status
export const getStatusIcon = (status: string): ReactNode => {
  switch (status) {
    case TRANSACTION_STATUS.COMPLETED:
      return React.createElement(CheckCircle, { className: "h-4 w-4 text-green-500" });
    case TRANSACTION_STATUS.PENDING:
      return React.createElement(Clock, { className: "h-4 w-4 text-yellow-500" });
    case TRANSACTION_STATUS.FAILED:
      return React.createElement(XCircle, { className: "h-4 w-4 text-red-500" });
    default:
      return null;
  }
};
