import { z } from "zod";
// import { Gender } from "@/lib/api";

// Define the client form schema
export const clientFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nric: z
  .string()
  .regex(/^[STFG]\d{7}[A-Z]$/, "Invalid NRIC"),
  emailAddress: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

// Default values for client form
export const defaultClientValues: ClientFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  nric: "",
  emailAddress: "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

// Country code mapping
export const countryToCode: Record<string, string> = {
  "Singapore": "+65",
  "Malaysia": "+60"
};

export const codeToCountry: Record<string, string> = {
  "+65": "Singapore",
  "+60": "Malaysia"
};
