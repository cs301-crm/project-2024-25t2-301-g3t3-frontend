"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RefreshCw, Search, LinkIcon, ChartNoAxesGantt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clientService from "@/lib/api/clientService";
import { useDebounce } from "@/hooks/use-debounce";
import { LogEntry } from "@/lib/api";
import Link from "next/link";

interface AgentActivitiesProps {
  agentId: string;
}

export default function RecentActivitiesByAgent({ agentId }: AgentActivitiesProps) {
  const [error, setError] = useState("");
  const [activitySearchQuery, setActivitySearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(activitySearchQuery, 300);
  const lastActivityRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchLogs = async ({ pageParam = 1 }) => {
    setError("");
    try {
      return await clientService.getLogsByAgentId(agentId, debouncedSearchQuery, pageParam, 10);
    } catch (err) {
      setError("Error loading recent activities");
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
    queryKey: ["agentActivities", agentId, debouncedSearchQuery],
    queryFn: fetchLogs,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const recentActivities = data?.pages.flat() || [];

  useEffect(() => {
    const last = lastActivityRef.current;
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, recentActivities.length]);

  const handleRefresh = useCallback(() => {
    setError("");
    refetch();
  }, [refetch]);

  const generateSimplifiedMessage = (log: LogEntry) => {
    const isAccount = log.beforeValue?.includes("accountId") || log.afterValue?.includes("accountId");
    const entity = isAccount ? "account" : "profile";

    let message = "";
    switch (log.crudType) {
      case "CREATE": message = `Created ${entity} for `; break;
      case "READ": message = `Retrieved ${entity} for `; break;
      case "UPDATE":
        if (log.attributeName?.includes("verificationStatus")) {
          message = `Verified ${entity} for `;
        } else if (log.attributeName) {
          message = `Updated ${log.attributeName} for `;
        } else {
          message = `Updated ${entity} for `;
        }
        break;
      case "DELETE": message = `Deleted ${entity} for `; break;
      default: message = `Operation on ${entity} for `;
    }

    return { message, clientName: log.clientName, id: log.clientId };
  };

  return (
   
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
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
              placeholder="Search recent activities..."
              className="pl-10"
              value={activitySearchQuery}
              onChange={(e) => setActivitySearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setActivitySearchQuery("");
              refetch();
            }}
            disabled={!activitySearchQuery}
          >
            Clear
          </Button>
        </div>

        {isFetching && !isFetchingNextPage && !isRefetching ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
            <p className="text-sm text-slate-500">Loading recent activities...</p>
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {recentActivities.map((log, index) => {
              const { message, clientName, id } = generateSimplifiedMessage(log);
              const isLast = index === recentActivities.length - 1;
              return (
                <div
                  key={index}
                  ref={isLast ? lastActivityRef : null}
                  className="rounded-md border p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {message}
                        <Link href={`/client/${id}`} className="text-blue-600 hover:underline">
                          {clientName}
                        </Link>
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <LinkIcon className="h-4 w-4 text-slate-400" />
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
              {activitySearchQuery ? "No matching activities found" : "No recent activities"}
            </p>
          </div>
        )}
      </div>
  );
}
