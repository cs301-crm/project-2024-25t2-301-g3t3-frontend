"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAgent } from "@/contexts/agent-context";
import { ClientDTO, Gender } from "@/lib/api";

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
import { UserPlus } from "lucide-react";

// Define the form schema
const clientFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  emailAddress: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  nric: z.string().min(1, "NRIC is required"),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

// Country code mapping
const countryToCode: Record<string, string> = {
  "Singapore": "+65",
  "USA": "+1",
  "Malaysia": "+60"
};

const codeToCountry: Record<string, string> = {
  "+65": "Singapore",
  "+1": "USA",
  "+60": "Malaysia"
};

export function CreateClientDialog({ compact = false }) {
  const [open, setOpen] = useState(false);
  const { addClient } = useAgent();
  const [countryCode, setCountryCode] = useState("");

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      emailAddress: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      nric: "",
    },
  });

  // Update country code when country changes
  useEffect(() => {
    const country = form.watch("country");
    if (country && countryToCode[country]) {
      setCountryCode(countryToCode[country]);
      
      // Update phone number with new country code
      const phoneNumber = form.getValues("phoneNumber");
      const phoneWithoutCode = phoneNumber.replace(/^\+\d+\s*/, "");
      form.setValue("phoneNumber", countryToCode[country] + " " + phoneWithoutCode);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const phoneNumber = form.watch("phoneNumber");
    const codeMatch = phoneNumber.match(/^\+\d+/);
    
    if (codeMatch?.[0] && codeToCountry[codeMatch[0]]) {
      setCountryCode(codeMatch[0]);
      
      // Update country if it doesn't match the phone code
      const currentCountry = form.getValues("country");
      const matchingCountry = codeToCountry[codeMatch[0]];
      if (currentCountry !== matchingCountry) {
        form.setValue("country", matchingCountry);
      }
    }
  }, [form.watch("phoneNumber")]);

  function onSubmit(data: ClientFormValues) {
    addClient(data);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <Button variant="outline" size="sm">
            <UserPlus className="mr-1 h-4 w-4" />
            Create Client
          </Button>
        ) : (
          <Button className="w-full justify-start" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Create Client Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Create Client Profile</DialogTitle>
          <DialogDescription className="text-center">
            Enter client information to create a new profile
          </DialogDescription>
        </DialogHeader>
        <div className="font-mono text-xs text-slate-500">
          <pre className="overflow-auto whitespace-pre-wrap">
          </pre>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="mb-3 text-sm font-medium">Personal Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select gender</option>
                            <option value={Gender.MALE}>Male</option>
                            <option value={Gender.FEMALE}>Female</option>
                            <option value={Gender.NON_BINARY}>Non-binary</option>
                            <option value={Gender.PREFER_NOT_TO_SAY}>Prefer not to say</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-3 text-sm font-medium">Contact Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <select
                              className="flex h-10 w-24 rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={countryCode}
                              onChange={(e) => {
                                const code = e.target.value;
                                setCountryCode(code);
                                
                                // Update phone number with new country code
                                const phoneWithoutCode = field.value.replace(/^\+\d+\s*/, "");
                                field.onChange(code + " " + phoneWithoutCode);
                                
                                // Update country field based on selected country code
                                if (code && codeToCountry[code]) {
                                  form.setValue("country", codeToCountry[code]);
                                }
                              }}
                            >
                              <option value="">Code</option>
                              <option value="+65">+65 (SG)</option>
                              <option value="+1">+1 (US)</option>
                              <option value="+60">+60 (MY)</option>
                            </select>
                            <Input 
                              className="rounded-l-none" 
                              placeholder="8123 4567" 
                              value={field.value.replace(/^\+\d+\s*/, "")}
                              onChange={(e) => {
                                field.onChange(countryCode + " " + e.target.value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-3 text-sm font-medium">Address Information</h3>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select country</option>
                              <option value="Singapore">Singapore</option>
                              <option value="USA">USA</option>
                              <option value="Malaysia">Malaysia</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nric"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NRIC</FormLabel>
                          <FormControl>
                            <Input placeholder="S1234567D" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
