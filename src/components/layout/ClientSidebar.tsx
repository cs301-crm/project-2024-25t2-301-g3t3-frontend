"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { useClient } from "@/contexts/client-context";
import { useUser } from "@/contexts/user-context";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { ArrowLeft, CreditCard, Users, ChevronsUpDown, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import clientService from "@/lib/api/mockClientService";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function ClientSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams(); 
  const { client } = useClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300); 
  const [selectedClient, setSelectedClient] = useState<{ clientId: string; name: string } | null>(null);
  const [lastItem, setLastItem] = useState<HTMLElement | null>(null);
  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (node) setLastItem(node);
  }, []);
  const pageSize = 10;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["sidebar-clients", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await clientService.getClientsByAgentId(
        user.id,
        debouncedSearch,
        pageParam,
        pageSize
      );
      return result.map(c => ({
        clientId: c.clientId || '',
        name: `${c.firstName} ${c.lastName}`,
      }));
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
});

  const clients = data?.pages.flat() || [];

  // Infinite scroll effect
  useEffect(() => {
    if (!lastItem) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5  }
    );
  
    observer.observe(lastItem);
  
    return () => {
      observer.unobserve(lastItem);
    };
  }, [lastItem, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.clientId === clientId);
    if (client) {
      setSelectedClient(client);
      setOpen(false);
      router.push(`/client/${client.clientId}`); 
    }
  };

  useEffect(() => {
    if (client) {
      setSelectedClient({
        clientId: client.clientId || '', 
        name: `${client.firstName || ''} ${client.lastName || ''}`.trim() 
      });
    }
  }, [client]);

  const clientNav: NavItem[] = [
    { href: `/client/${id}`, label: "Overview", icon: <Users className="h-4 w-4" /> },
    { href: `/client/${id}/accounts`, label: "Accounts", icon: <CreditCard className="h-4 w-4" /> },
    { href: `/client/${id}/transactions`, label: "Transactions", icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <aside className="hidden w-64 border-r bg-white md:block">
      <div className="flex flex-col gap-6 p-4">
        <div className="space-y-2">
          <Link
            href="/client"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Main Menu
          </Link>

          <hr />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button className="w-full justify-between" variant="outline" role="combobox" aria-expanded={open}>
                {selectedClient?.name || "Search for a client..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
              side="bottom"
              avoidCollisions={false}
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search client..."
                  value={searchTerm}
                  onValueChange={handleSearch}
                />
                <CommandList className="max-h-[300px] overflow-y-auto">
                  {isFetching && !isFetchingNextPage ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : clients.length > 0 ? (
                    <>
                      {clients.map((client) => (
                        <CommandItem
                          key={client.clientId}
                          value={client.name}
                          onSelect={() => handleClientSelect(client.clientId)}
                          ref={lastItemRef}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClient?.clientId === client.clientId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {client.name}
                        </CommandItem>
                      ))}
                      {isFetchingNextPage && (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <CommandEmpty>
                      {searchTerm ? "No clients found" : "Start typing to search"}
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <nav className="space-y-1">
            {clientNav.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}