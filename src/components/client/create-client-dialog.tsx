"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@/contexts/user-context";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDTO } from '@/lib/api/types'
import { FormDialog } from "@/components/forms/form-dialog";
import { ClientFormFields } from "@/components/forms/client-form-fields";
import { clientFormSchema, ClientFormValues, defaultClientValues } from "@/lib/schemas/client-schema";
import { useState } from "react";
import { handleApiError } from "@/lib/api";
import clientService from "@/lib/api/mockClientService";
import { toast } from "../ui/use-toast";

interface CreateClientDialogProps {
  compact?: boolean;
}

export function CreateClientDialog({ compact = false }: CreateClientDialogProps) {
  const { user } = useUser();
  const [ loading, setLoading ] = useState<boolean>(false);
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultClientValues,
  });

  const addClient = async (clientData: Omit<ClientDTO, "clientId" >) => {
    setLoading(true);
    try { 
        const agentId = user.id;
        // Add the agentId to the client data
        const clientDataWithAgent = {
          ...clientData,
          agentId
        };
          try {
            await clientService.createClient(clientDataWithAgent as ClientDTO);
            toast({
              title: "Client created",
              description: `Client ${clientData.firstName} ${clientData.lastName} has been created successfully.`,
            });
          } catch (err) {
            handleApiError(err, 'Failed to add client');
            throw err; 
          }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create client. Please try again.",
          variant: "destructive",
        });
        console.log(err);
      } finally {
        setLoading(false);
      }

    }

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
    <Button className="w-full justify-start" variant="outline" disabled={loading}>
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
