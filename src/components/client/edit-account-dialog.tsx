"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAgent, Account } from "@/contexts/agent-context";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/forms/form-dialog";
import { AccountFormFields } from "@/components/forms/account-form-fields";
import { accountFormSchema, AccountFormValues } from "@/lib/schemas/account-schema";

interface EditAccountDialogProps {
  account: Account;
  clientName: string;
}

export function EditAccountDialog({ account, clientName }: Readonly<EditAccountDialogProps>) {
  const { updateAccount, loading } = useAgent();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      clientId: account.clientId,
      accountType: account.accountType,
      accountStatus: account.accountStatus,
      openingDate: account.openingDate,
      initialDeposit: account.initialDeposit,
      currency: account.currency,
      branchId: account.branchId,
    },
  });

  async function onSubmit(data: AccountFormValues) {
    await updateAccount(account.id, data);
  }

  return (
    <FormDialog
      title="Edit Account"
      description={`Edit account details for ${clientName}`}
      trigger={
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Edit className="h-3.5 w-3.5" />
        </Button>
      }
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitLabel="Save Changes"
    >
      <AccountFormFields form={form} />
    </FormDialog>
  );
}
