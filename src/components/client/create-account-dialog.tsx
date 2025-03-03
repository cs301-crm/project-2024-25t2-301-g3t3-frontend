"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAgent } from "@/contexts/agent-context";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/forms/form-dialog";
import { AccountFormFields } from "@/components/forms/account-form-fields";
import { accountFormSchema, AccountFormValues, defaultAccountValues } from "@/lib/schemas/account-schema";

interface CreateAccountDialogProps {
  clientId?: string;
  clientName?: string;
}

export function CreateAccountDialog({ clientId, clientName }: CreateAccountDialogProps = {}) {
  const { addAccount, loading, clients } = useAgent();
  const [selectedClientName, setSelectedClientName] = useState<string>(clientName ?? "");

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      ...defaultAccountValues,
      clientId: clientId ?? "",
    },
  });

  async function onSubmit(data: AccountFormValues) {
    await addAccount(data);
    form.reset({
      ...defaultAccountValues,
      clientId: clientId ?? "",
    });
    if (!clientId) {
      setSelectedClientName("");
    }
  }

  // Handle client selection change
  const handleClientChange = (clientId: string) => {
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

  const description = selectedClientName
    ? `Create a new account for ${selectedClientName}`
    : "Select a client and create a new account";

  return (
    <FormDialog
      title="Create New Account"
      description={description}
      trigger={<Button {...buttonProps}>{buttonContent}</Button>}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitLabel="Create Account"
      disableSubmit={!clientId && !form.getValues("clientId")}
    >
      <AccountFormFields
        form={form}
        showClientSelection={!clientId}
        clients={clients}
        onClientChange={handleClientChange}
      />
    </FormDialog>
  );
}
