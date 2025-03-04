import { z } from "zod";
import { AccountStatus, AccountType } from "@/lib/api";

// Define the account form schema
export const accountFormSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  accountType: z.string().min(1, "Account type is required"),
  accountStatus: z.string().min(1, "Account status is required"),
  openingDate: z.string().min(1, "Opening date is required"),
  initialDeposit: z.coerce.number().min(0, "Initial deposit must be a positive number"),
  currency: z.string().min(1, "Currency is required"),
  branchId: z.string().min(1, "Branch ID is required"),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;

// Default values for account form
export const defaultAccountValues: AccountFormValues = {
  clientId: "",
  accountType: AccountType.SAVINGS,
  accountStatus: AccountStatus.ACTIVE,
  openingDate: new Date().toISOString().split('T')[0],
  initialDeposit: 0,
  currency: "SGD",
  branchId: "SG001",
};
