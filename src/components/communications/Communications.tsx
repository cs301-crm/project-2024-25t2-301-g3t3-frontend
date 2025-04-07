"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RefreshCw, Search, Mails, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardCard } from "../dashboard/dashboard-card";
import { useUser } from "@/contexts/user-context";
import { useDebounce } from "@/hooks/use-debounce";
import clientService from "@/lib/api/mockClientService";

export default function Communications() {
  const { user } = useUser();
  const [commSearchQuery, setCommSearchQuery] = useState("");
  const [commError, setCommError] = useState("");
  const debouncedCommQuery = useDebounce(commSearchQuery, 300);
  const lastCommRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["communications", user.id, debouncedCommQuery],
    queryFn: async ({ pageParam = 1 }) => {
      setCommError("");
      try {
        return await clientService.getCommunicationsByAgentId(
          user.id,
          debouncedCommQuery,
          pageParam,
          10
        );
      } catch (err) {
        setCommError("Failed to load communications");
        throw err;
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const communications = data?.pages.flat() || [];

  useEffect(() => {
    const last = lastCommRef.current;
    if (!last || !hasNextPage || isFetchingNextPage) return;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 0.1 }
    );
    observerRef.current = observer;
    observer.observe(last);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, communications.length]);

  const handleRefresh = useCallback(() => {
    setCommError("");
    refetch();
  }, [refetch]);

  return (
    <DashboardCard title="Communications" className="border-l-4 border-l-slate-700">
      <div className="flex flex-col space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Error Display */}
        {commError && !isFetching && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-600">{commError}</p>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search communications..."
              className="pl-10"
              value={commSearchQuery}
              onChange={(e) => setCommSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setCommSearchQuery("");
              refetch();
            }}
            disabled={!commSearchQuery}
          >
            Clear
          </Button>
        </div>

        {/* Communication List */}
        {isFetching && !isFetchingNextPage && !isRefetching ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
            <p className="text-sm text-slate-500">Loading communications...</p>
          </div>
        ) : communications.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {communications.map((log, index) => {
              const isLast = index === communications.length - 1;
              return (
                <div
                  key={index}
                  ref={isLast ? lastCommRef : null}
                  className="rounded-md border p-3 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{log.subject}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        log.status === "SENT"
                          ? "bg-green-100 text-green-800"
                          : log.status === "SENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          
            {/* Loader when fetching next page */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            )}
          </div>        
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <Mails className="h-12 w-12 text-slate-300" />
            <p className="text-sm text-slate-500">
              {commSearchQuery
                ? "No matching communications found"
                : "No communications available"}
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
