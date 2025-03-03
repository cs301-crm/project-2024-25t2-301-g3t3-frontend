"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAgent, Client } from "@/contexts/agent-context";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/forms/form-dialog";
import { ClientFormFields } from "@/components/forms/client-form-fields";
import { clientFormSchema, ClientFormValues } from "@/lib/schemas/client-schema";
import { useToast } from "@/components/ui/use-toast";

interface EditClientDialogProps {
  client: Client;
  trigger?: React.ReactNode;
}

export function EditClientDialog({ client, trigger }: Readonly<EditClientDialogProps>) {
  const { updateClient, loading } = useAgent();
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: client.firstName,
      lastName: client.lastName,
      dateOfBirth: client.dateOfBirth ?? "",
      gender: client.gender ?? "",
      emailAddress: client.email,
      phoneNumber: client.phoneNumber ?? "",
      address: client.address ?? "",
      city: client.city ?? "",
      state: client.state ?? "",
      country: client.country ?? "",
      postalCode: client.postalCode ?? "",
      nric: client.nric ?? "",
    },
  });

  async function onSubmit(data: ClientFormValues) {
    try {
      await updateClient(client.id, data);
      toast({
        title: "Client updated",
        description: `${data.firstName} ${data.lastName}'s profile has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <FormDialog
      title="Edit Client Profile"
      description={`Update client information for ${client.firstName} ${client.lastName}`}
      trigger={
        trigger ?? (
          <Button variant="outline" size="sm">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        )
      }
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitLabel="Save Changes"
      maxWidth="600px"
    >
      <ClientFormFields form={form} />
    </FormDialog>
  );
}
