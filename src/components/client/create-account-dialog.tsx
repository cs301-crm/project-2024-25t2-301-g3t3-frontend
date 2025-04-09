"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useClient } from "@/contexts/client-context";
import { useUser } from "@/contexts/user-context";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/forms/form-dialog";
import clientService from "@/lib/api/mockClientService";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { accountFormSchema, AccountFormValues, defaultAccountValues } from "@/lib/schemas/account-schema";
import { AccountFormFields } from "../forms/account-form-fields";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/components/ui/use-toast";


interface CreateAccountDialogProps {
  clientId?: string;
  clientName?: string;
}

export function CreateAccountDialog({ clientId, clientName }: CreateAccountDialogProps = {}) {
  const { user } = useUser();
  const { addAccount, loadingAction } = useClient();
  const [selectedClient, setSelectedClient] = useState<{ clientId: string; name: string } | null>(
    clientId && clientName ? { clientId: clientId, name: clientName } : null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      ...defaultAccountValues,
      clientId: clientId ?? "",
    },
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['create-account-clients', debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await clientService.getClientsByAgentId(
        user.userid,
        debouncedSearch,
        pageParam
      );
      return result.map(c => ({
        clientId: c.clientId || '',
        name: `${c.firstName} ${c.lastName}`,
      }));
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  
  const clients = data?.pages.flat() || [];

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, clients.length, isFetching]);

  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  async function onSubmit(data: AccountFormValues) {
    try {
      setIsSubmitting(true);
      const response = await addAccount(data);
      toast({
        title: "Account created",
        description: `${response.accountType} account for ${response.clientName} created successfully.`,
      });
      form.reset({
        ...defaultAccountValues,
        clientId: clientId ?? ""
      });
      if (!clientId) {
        setSelectedClient(null);
      }
     // setSelectedClient(null);
    } catch (error) {
      console.error("Failed to create account:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.clientId === clientId);
    if (client) {
      setSelectedClient(client);
      form.setValue("clientId", client.clientId);
      form.clearErrors("clientId");
      setOpen(false);
    }
  };

  return (
    <FormDialog
      title="Create New Account"
      description={selectedClient ? `Creating account for ${selectedClient.name}` : "Select a client to create a new account"}
      trigger={
        <Button size="sm" variant="outline" disabled={loadingAction}>
          {loadingAction ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-1 h-4 w-4" />
          )}
          Create Account
        </Button>
      }
      form={form}
      onSubmit={onSubmit}
      loading={isSubmitting || loadingAction}
      submitLabel={isSubmitting ? "Creating..." : "Create Account"}
      disableSubmit={!selectedClient || isSubmitting}
    >
      <div className="space-y-4">
        {!clientId && (
          <div className="mb-4 p-3 border rounded-md">
            <label className="block text-sm font-medium mb-2">Client</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  className="w-full justify-between" 
                  variant="outline" 
                  role="combobox" 
                  aria-expanded={open}
                  disabled={loadingAction}
                >
                  {selectedClient?.name || "Search for a client..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search client..." 
                    value={searchTerm} 
                    onValueChange={handleSearch} 
                  />
                  <CommandList 
                    ref={scrollContainerRef}
                    className="max-h-[300px] overflow-y-auto"
                  >
                    {isFetching && !isFetchingNextPage ? (
                      <div className="flex items-center justify-center p-4 h-full">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : clients.length > 0 ? (
                      <>
                        {clients.map((client, index) => (
                          <CommandItem
                            key={client.clientId}
                            value={client.name}
                            onSelect={() => handleClientSelect(client.clientId)}
                            ref={index === clients.length - 1 ? lastItemRef : null}
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
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        )}
                      </>
                    ) : (
                      <CommandEmpty>No clients found</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <AccountFormFields form={form} />
      </div>
    </FormDialog>
  );
}