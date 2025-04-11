"use client";

import { Gender } from "@/lib/api";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/lib/schemas/client-schema";
import { useCountryCode } from "@/hooks/use-country-code";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormValues>;
}

export function ClientFormFields({ form }: ClientFormFieldsProps) {
  const { countryCode, handleCountryCodeChange } = useCountryCode(form);
  const today = new Date().toISOString().split("T")[0];
  return (
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
                  <Input type="date" {...field} max={today} />
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
                      onChange={(e) => handleCountryCodeChange(e.target.value)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
