import React, { useState, useEffect, useRef, useCallback } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { useRouter } from "next/navigation";
import { Users, Search, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateClientDialog } from "@/components/client/create-client-dialog";
import clientService from '@/lib/api/mockClientService'
import { useUser } from '@/contexts/user-context'
import { Client, handleApiError } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce"; 
import { useInfiniteQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";



interface ClientsPageInnerProps {
  agentId: string
}

interface InfiniteData<T> {
    pages: T[];
    pageParams: unknown[]; 
  }

interface ClientPage {
    clients: Partial<Client>[];
    nextCursor?: string;
}

export default function ClientsPageInner({ agentId }: ClientsPageInnerProps){
    const { user } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300); 
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastClientRef = useRef<HTMLDivElement | null>(null);
    const isInitialMount = useRef(true);
    const queryClient = useQueryClient();

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      refetch,
      isRefetching
    } = useInfiniteQuery({
      queryKey: ['clients-page', debouncedSearchQuery, agentId],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          setError("");
          const result = await clientService.getClientsByAgentId(
            agentId, 
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
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 10 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    });
  
    // Flatten paginated results
    const clients = data?.pages.flat() || [];
  
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && !isInitialMount.current) {
          resetCachedPages();
          refetch(); 
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
      resetCachedPages();
      refetch(); 
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

    const resetCachedPages = () => {
        queryClient.setQueryData(
            ['clients-page', debouncedSearchQuery, agentId],
            (data: InfiniteData<ClientPage>) => ({
              pages: data.pages.slice(0, 1),
              pageParams: data.pageParams.slice(0, 1)
            })
          );
    }
  
    const handleClientClick = (clientId: string) => {
      if (clientId) {
        router.push(`/client/${clientId}`);
      }
    };

    const content = (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {user.userid === agentId && (
                  <CreateClientDialog compact={true} />
                )}
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
    )
    return user.userid === agentId ? (
        <DashboardCard
          title="Client List"
          className="border-l-4 border-l-slate-700 col-span-2"
        >
          {content}
        </DashboardCard>
    ) : (
        content
    );
  }