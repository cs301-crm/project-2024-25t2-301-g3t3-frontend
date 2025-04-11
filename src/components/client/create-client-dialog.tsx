"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/forms/form-dialog";
import { ClientFormFields } from "@/components/forms/client-form-fields";
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
import { cn } from "@/lib/utils";
import { ClientDTO, Agent } from "@/lib/api/types";
import { clientFormSchema, ClientFormValues, defaultClientValues } from "@/lib/schemas/client-schema";
import clientService from "@/lib/api/clientService";
import { toast } from "../ui/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { userService } from "@/lib/api/userService";


interface CreateClientDialogProps {
  compact?: boolean;
}

export function CreateClientDialog({ compact = false }: CreateClientDialogProps) {
  const { user, isAdmin } = useUser();
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Partial<Agent> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agents, setAgents] = useState<Partial<Agent>[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadAgentError, setLoadAgentError] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 200);
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultClientValues,
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoadAgentError("");
        setLoadingAgents(true);
        const result = await userService.getAgentList();
        setAgents(result.message);
      } catch (err) {
        setLoadAgentError("Failed to load Agents.")
        console.log(err);
      } finally {
        setLoadingAgents(false);
      }
    };

    if (isAdmin && open) {
      fetchAgents();
    }
  }, [isAdmin, open]);

  const filteredAgents = agents.filter((agent) => {
    const fullName = `${agent.firstName ?? ""} ${agent.lastName ?? ""}`.toLowerCase();
    return (
      fullName.includes(debouncedSearch.toLowerCase()) ||
      (agent.firstName?.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (agent.lastName?.toLowerCase().includes(debouncedSearch.toLowerCase()))
    );
  });

  const addClient = async (clientData: Omit<ClientDTO, "clientId">, agentId: string) => {
    try {
      const clientWithAgent = { ...clientData, agentId };
      await clientService.createClient(clientWithAgent as ClientDTO);
      toast({
        title: "Client created",
        description: `Client ${clientData.firstName} ${clientData.lastName} created successfully.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
      console.error(err);
      throw err;
    }
  };

  async function onSubmit(data: ClientFormValues) {
    if (!user) return;
    const agentId = isAdmin ? selectedAgent?.id : user.userId;
    if (!agentId) {
      toast({
        title: "Agent not selected",
        description: "Please select an agent before creating a client.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addClient(data, agentId);
      form.reset(defaultClientValues);
      setSelectedAgent(null);
    } catch {
      // Do nothing extra; error toast is already shown
    } finally {
      setIsSubmitting(false);
    }
  }

  const trigger = compact ? (
    <Button variant="outline" size="sm">
      <UserPlus className="mr-1 h-4 w-4" />
      Create Client
    </Button>
  ) : (
    <Button className="w-full justify-start" variant="outline" disabled={isSubmitting}>
      <UserPlus className="mr-2 h-4 w-4" />
      Create Client Profile
    </Button>
  );

  return (
    <FormDialog
      title="Create Client Profile"
      description={isAdmin && selectedAgent ? `Creating Client for Agent ${selectedAgent.firstName} ${selectedAgent.lastName}` : "Enter client details"}
      trigger={trigger}
      form={form}
      onSubmit={onSubmit}
      loading={isSubmitting}
      submitLabel={isSubmitting ? "Creating..." : "Create Client"}
      disableSubmit={isAdmin && !selectedAgent}
      maxWidth="600px"
    >
      <div className="space-y-4">
         {isAdmin && (
          <div className="mb-4 p-3 border rounded-md">
            <label className="block text-sm font-medium mb-2">Agent</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={isSubmitting}
                >
                  {selectedAgent?.firstName
                    ? `${selectedAgent.firstName} ${selectedAgent.lastName}`
                    : "Select agent"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
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
                            value={`${agent.firstName} ${agent.lastName}`}
                            onSelect={() => {
                              setSelectedAgent(agent);
                              setOpen(false);
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
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        <ClientFormFields form={form} />
      </div>
    </FormDialog>
  );
}
