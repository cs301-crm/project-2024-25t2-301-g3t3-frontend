"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAgent } from "@/contexts/agent-context";
import { AccountDTO, AccountStatus, AccountType } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreditCard, Plus } from "lucide-react";

// Define the form schema
const accountFormSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  accountType: z.string().min(1, "Account type is required"),
  accountStatus: z.string().min(1, "Account status is required"),
  openingDate: z.string().min(1, "Opening date is required"),
  initialDeposit: z.coerce.number().min(0, "Initial deposit must be a positive number"),
  currency: z.string().min(1, "Currency is required"),
  branchId: z.string().min(1, "Branch ID is required"),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Optional props interface for when creating an account for a specific client
interface CreateAccountDialogProps {
  clientId?: string;
  clientName?: string;
}

export function CreateAccountDialog({ clientId, clientName }: CreateAccountDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const { addAccount, loading, clients } = useAgent();
  const [selectedClientName, setSelectedClientName] = useState<string>(clientName || "");

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      clientId: clientId || "",
      accountType: AccountType.SAVINGS,
      accountStatus: AccountStatus.ACTIVE,
      openingDate: new Date().toISOString().split('T')[0],
      initialDeposit: 0,
      currency: "SGD",
      branchId: "SG001",
    },
  });

  // Update the selected client name when the clientId changes
  useEffect(() => {
    const currentClientId = form.getValues("clientId");
    if (currentClientId) {
      const client = clients.find(c => c.id === currentClientId);
      if (client) {
        setSelectedClientName(`${client.firstName} ${client.lastName}`);
      }
    }
  }, [form, clients]);

  async function onSubmit(data: AccountFormValues) {
    await addAccount(data);
    form.reset({
      clientId: clientId || "",
      accountType: AccountType.SAVINGS,
      accountStatus: AccountStatus.ACTIVE,
      openingDate: new Date().toISOString().split('T')[0],
      initialDeposit: 0,
      currency: "SGD",
      branchId: "SG001",
    });
    if (!clientId) {
      setSelectedClientName("");
    }
    setOpen(false);
  }

  // Handle client selection change
  const handleClientChange = (clientId: string) => {
    form.setValue("clientId", clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClientName(`${client.firstName} ${client.lastName}`);
    } else {
      setSelectedClientName("");
    }
  };

  // Determine button style based on whether it's used in client management or accounts page
  const buttonContent = clientId ? (
    <>
      <CreditCard className="mr-2 h-4 w-4" />
      Create New Account
    </>
  ) : (
    <>
      <Plus className="mr-1 h-4 w-4" />
      Create Account
    </>
  );

  const buttonProps = clientId ? {
    className: "w-full justify-start",
    variant: "outline" as const
  } : {
    size: "sm" as const,
    variant: "outline" as const
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...buttonProps}>
          {buttonContent}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Create New Account</DialogTitle>
          <DialogDescription className="text-center">
            {selectedClientName 
              ? `Create a new account for ${selectedClientName}` 
              : "Select a client and create a new account"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {!clientId && (
                <div className="rounded-md border p-4">
                  <h3 className="mb-3 text-sm font-medium">Client Selection</h3>
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Client</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              handleClientChange(e.target.value);
                            }}
                          >
                            <option value="">-- Select a client --</option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.firstName} {client.lastName} ({client.email})
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="rounded-md border p-4">
                <h3 className="mb-3 text-sm font-medium">Account Information</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value={AccountType.SAVINGS}>Savings</option>
                            <option value={AccountType.CHECKING}>Checking</option>
                            <option value={AccountType.BUSINESS}>Business</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value={AccountStatus.ACTIVE}>Active</option>
                            <option value={AccountStatus.INACTIVE}>Inactive</option>
                            <option value={AccountStatus.CLOSED}>Closed</option>
                            <option value={AccountStatus.SUSPENDED}>Suspended</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="openingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="initialDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Deposit</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="SGD">SGD - Singapore Dollar</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="SG001">Singapore - Main Branch</option>
                            <option value="SG002">Singapore - Orchard Road</option>
                            <option value="SG003">Singapore - Changi</option>
                            <option value="MY001">Malaysia - Kuala Lumpur</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || (!clientId && !form.getValues("clientId"))}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
