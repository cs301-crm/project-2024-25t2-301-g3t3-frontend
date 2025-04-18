"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  // BarChart3,
  // Settings,
  // TrendingUp,
  // BellRing,
  // HelpCircle,
  CreditCard,
  UserCog,
  BadgeDollarSign,
} from "lucide-react";
import { useUser } from "@/contexts/user-context";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function MainSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useUser();

  // Agent-specific navigation items
  const agentNavItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      href: "/client",
      label: "Client Management",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/accounts",
      label: "Account Management",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      href: "/transactions",
      label: "View Transactions",
      icon: <BadgeDollarSign className="h-4 w-4" />,
    },
  ];

  // Default navigation items for other roles
  const mainNavItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      href: "/client",
      label: "Client Management",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/accounts",
      label: "Account Management",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      href: "/transactions",
      label: "View Transactions",
      icon: <BadgeDollarSign className="h-4 w-4" />,
    },
    {
      href: "/agent/manage",
      label: "User Management",
      icon: <UserCog className="h-4 w-4" />,
    },
  ];

  // const reportingNavItems: NavItem[] = [
  //   {
  //     href: "/analytics",
  //     label: "Analytics",
  //     icon: <BarChart3 className="h-4 w-4" />,
  //   },
  //   {
  //     href: "/performance",
  //     label: "Performance",
  //     icon: <TrendingUp className="h-4 w-4" />,
  //   },
  // ];

  // const systemNavItems: NavItem[] = [
  //   {
  //     href: "/notifications",
  //     label: "Notifications",
  //     icon: <BellRing className="h-4 w-4" />,
  //   },
  //   {
  //     href: "/settings",
  //     label: "Settings",
  //     icon: <Settings className="h-4 w-4" />,
  //   },
  //   {
  //     href: "/help",
  //     label: "Help & Support",
  //     icon: <HelpCircle className="h-4 w-4" />,
  //   },
  // ];

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "bg-slate-100 text-slate-900"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      );
    });
  };

  return (
    <aside className="hidden w-64 border-r bg-white md:block">
      <div className="flex flex-col gap-6 p-4">
        <div className="space-y-2">
          {!isAdmin
            ? renderNavItems(agentNavItems)
            : renderNavItems(mainNavItems)}
        </div>

        {/* {role !== "agent" && (
          <>
            <div>
              <h3 className="mb-1 px-3 text-xs font-semibold uppercase text-slate-500">
                Reporting
              </h3>
              <div className="space-y-1">
                {renderNavItems(reportingNavItems)}
              </div>
            </div>

            <div>
              <h3 className="mb-1 px-3 text-xs font-semibold uppercase text-slate-500">
                System
              </h3>
              <div className="space-y-1">{renderNavItems(systemNavItems)}</div>
            </div>
          </>
        )} */}
      </div>
    </aside>
  );
}
