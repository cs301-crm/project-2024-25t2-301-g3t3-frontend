"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  RefreshCw,
  Search,
  ChartNoAxesGantt,
  Loader2,
} from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { DashboardCard } from "../dashboard/dashboard-card";
import { userService } from "@/lib/api/userService"
import { AdminLogEntry } from "@/lib/api/types";

export default function AdminLogs() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [error, setError] = useState("");
  const lastRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchLogs = async ({ pageParam = 1 }) => {
    setError("");
    try {
      if (!user.userId) {
        return {
          success: true,
          message: [],
          timestamp: new Date().toISOString(),
        };
      }
      return await userService.getAdminLogs(debouncedSearch, pageParam, 10);
    } catch (err) {
      setError("Error loading admin logs");
      throw err;
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["adminLogs", debouncedSearch],
    queryFn: fetchLogs,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.message.length === 10 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const logs: AdminLogEntry[] = data?.pages.flatMap((page) => page.message) || [];
  
  useEffect(() => {
    const last = lastRef.current;
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, logs.length]);

  const handleRefresh = useCallback(() => {
    setError("");
    refetch();
  }, [refetch]);

  return (
    <DashboardCard
      title="Admin Logs"
      className="col-span-1 border-l-4 border-l-slate-700"
    >
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

        {error && !isFetching && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search admin logs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              refetch();
            }}
            disabled={!searchQuery}
          >
            Clear
          </Button>
        </div>

        {/* Logs List */}
        {isFetching && !isFetchingNextPage && !isRefetching ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
            <p className="text-sm text-slate-500">Loading admin logs...</p>
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {logs.map((log, index) => {
              const isLast = index === logs.length - 1;
              return (
                <div
                  key={log.logId}
                  ref={isLast ? lastRef : null}
                  className="rounded-md border p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        [{log.transactionType}] {log.action} by{" "}
                        <span className="text-blue-600 font-semibold">
                          {log.actor}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <ChartNoAxesGantt className="h-12 w-12 text-slate-300" />
            <p className="text-sm text-slate-500">
              {searchQuery ? "No matching logs found" : "No admin logs available"}
            </p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
