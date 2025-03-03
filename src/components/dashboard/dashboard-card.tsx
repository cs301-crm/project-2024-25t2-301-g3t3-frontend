import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <div className={`rounded-lg border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}>
      <h3 className="mb-3 font-medium text-slate-800">{title}</h3>
      {children}
    </div>
  );
}
