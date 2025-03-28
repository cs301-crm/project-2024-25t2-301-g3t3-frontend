"use client";

import React, { useState, useEffect, Suspense, useRef, useCallback } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useRouter } from "next/navigation";
import { Users, Search, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateClientDialog } from "@/components/client/create-client-dialog";
import clientService from '@/lib/api/mockClientService'
import { useUser } from '@/contexts/user-context'
import { handleApiError } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce"; 
import { useInfiniteQuery } from "react-query";

function ClientsPageInner() {
  
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300); 
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastClientRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);
  

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery(
    ["clients-page", debouncedSearchQuery],
    async ({ pageParam = 1 }) => {
      try {
        setError("");
        const result = await clientService.getClientsByAgentId(
          user.id, 
          debouncedSearchQuery, 
          pageParam
        );
        return result;
      } catch (err) {
        handleApiError(err);
        setError("Unable to fetch clients");
        throw err; 
      }
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
      refetchOnWindowFocus: true,
      staleTime: 60 * 1000, 
      keepPreviousData: false
    }
  );

  // Flatten paginated results
  const clients = data?.pages.flat() || [];

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isInitialMount.current) {
        refetch({ refetchPage: (_, index) => index === 0 });
      }
      isInitialMount.current = false;
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch({ refetchPage: () => true }); 
  }, [refetch]);


  useEffect(() => {
    const lastElement = lastClientRef.current;
    if (!lastElement || !hasNextPage || isFetchingNextPage) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { 
        root: null,
        rootMargin: "20px", 
        threshold: 0.1
      }
    );
    observerRef.current = observer;
    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, clients.length]);

  const handleClientClick = (clientId: string) => {
    if (clientId) {
      router.push(`/client/${clientId}`);
    }
  };

  return (
    <>
      <DashboardCard
        title="Client List"
        className="border-l-4 border-l-slate-700 col-span-2"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <CreateClientDialog compact={true} />
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear
            </Button>
          </div>

          {isFetching && !isFetchingNextPage && !isRefetching ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
              <p className="text-sm text-slate-500">Loading clients...</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {clients.length > 0 ? (
                <div className="space-y-3">
                  {clients.map((client, index) => (
                    <div
                      key={client.clientId}
                      ref={index === clients.length - 1 ? lastClientRef : null}
                      className="rounded-md border p-3 hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleClientClick(client.clientId || "")}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{client.clientId}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3 py-8">
                  <Users className="h-12 w-12 text-slate-300" />
                  <p className="text-sm text-slate-500">No clients found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardCard>
    </>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div>Loading Clients...</div>}>
      <div className="flex flex-col space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-500">Create and manage your client profiles</p>
        </div>
        <div className="grid gap-6">
          <ClientsPageInner />
        </div>
      </div>
    </Suspense>
  );
}