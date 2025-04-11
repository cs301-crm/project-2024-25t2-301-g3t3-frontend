"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/lib/api/types";
import { userService } from "@/lib/api/userService";
import { toast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { useClient } from "@/contexts/client-context";

interface ReassignAgentProps {
  agentId: string;
  onReassign?: (newAgentId: string) => void;
  trigger?: React.ReactNode;
}

export function ReassignAgent({
  agentId,
  onReassign,
  trigger,
}: ReassignAgentProps) {
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Partial<Agent> | null>(null);
  const [agents, setAgents] = useState<Partial<Agent>[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAgent, setCurrentAgent] =  useState<Partial<Agent> | null>(null);
  const [loadAgentError, setLoadAgentError] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 200);
  const { reassignAgent } = useClient();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoadAgentError("");
        setLoadingAgents(true);
        const result = await userService.getAgentList();
        setAgents(result.message);
        const current = result.message.find((a) => a.id === agentId) || null;
        setCurrentAgent(current);
        setSelectedAgent(current);
      } catch (err) {
        setLoadAgentError("Failed to load Agents.");
        console.log(err);
      } finally {
        setLoadingAgents(false);
      }
    };
    if (open) {
      fetchAgents();
    }
  }, [agentId, open]);

  const filteredAgents = agents.filter((agent) => {
    const fullName = `${agent.firstName ?? ""} ${agent.lastName ?? ""}`.toLowerCase();
    return fullName.includes(debouncedSearch.toLowerCase());
  });

  const handleReassign = async () => {
    if (!selectedAgent || !selectedAgent.id || selectedAgent.id === agentId) return;
    
    try {
      setIsSubmitting(true);
      await reassignAgent(selectedAgent.id);
      toast({
        title: "Client reassigned",
        description: `Client successfully reassigned to ${selectedAgent.firstName} ${selectedAgent.lastName}`,
      });
      if (onReassign) onReassign(selectedAgent.id);
      setOpen(false);
      setSearchTerm("");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reassign client. Please try again.",
        variant: "destructive",
      });
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" disabled={isSubmitting}>
      Reassign Agent
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
      <Command shouldFilter={false}>
          <div className="p-2 border-b">
            <p className="text-sm font-medium">Current Agent:</p>
            <p className="text-sm text-muted-foreground">
              {currentAgent
                ? `${currentAgent.firstName} ${currentAgent.lastName}`
                : "Unknown agent"}
            </p>
          </div>
          <CommandInput
            placeholder="Search agent..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {loadingAgents ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : filteredAgents.length > 0 ? (
              <CommandGroup>
                {filteredAgents.map((agent) => (
                  <CommandItem
                    key={agent.id}
                    className="cursor-pointer"
                    value={`${agent.firstName} ${agent.lastName}`}
                    onSelect={() => {
                      setSelectedAgent(agent);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedAgent?.id === agent.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {agent.firstName} {agent.lastName}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <>
              {loadAgentError ? (
                <CommandEmpty>{loadAgentError}</CommandEmpty>
              ):(
                <CommandEmpty>No agents found</CommandEmpty>
              )}
              </>
            )}
          </CommandList>
          <div className="p-2 border-t flex justify-end">
            <Button
              size="sm"
              onClick={handleReassign}
              className="cursor-pointer"
              disabled={!selectedAgent || selectedAgent.id === agentId || isSubmitting}
            >
              {isSubmitting ? (
                <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Confirm Reassign"
              )}
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
