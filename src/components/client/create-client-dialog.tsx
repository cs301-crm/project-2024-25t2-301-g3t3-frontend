"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAgent } from "@/contexts/agent-context";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/forms/form-dialog";
import { ClientFormFields } from "@/components/forms/client-form-fields";
import { clientFormSchema, ClientFormValues, defaultClientValues } from "@/lib/schemas/client-schema";

interface CreateClientDialogProps {
  compact?: boolean;
}

export function CreateClientDialog({ compact = false }: CreateClientDialogProps) {
  const { addClient, loading } = useAgent();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultClientValues,
  });

  async function onSubmit(data: ClientFormValues) {
    await addClient(data);
    form.reset(defaultClientValues);
  }

  const trigger = compact ? (
    <Button variant="outline" size="sm">
      <UserPlus className="mr-1 h-4 w-4" />
      Create Client
    </Button>
  ) : (
    <Button className="w-full justify-start" variant="outline">
      <UserPlus className="mr-2 h-4 w-4" />
      Create Client Profile
    </Button>
  );

  return (
    <FormDialog
      title="Create Client Profile"
      description="Enter client information to create a new profile"
      trigger={trigger}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitLabel="Save"
      maxWidth="600px"
    >
      <ClientFormFields form={form} />
    </FormDialog>
  );
}
