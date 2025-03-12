"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);

    try {
      // In a real application, you would call your forgot password API here
      console.log("Forgot password request:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message or redirect to a confirmation page
      alert("Password reset link sent to your email.");
    } catch (error) {
      console.error("Forgot password request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-700">
                Email
              </FormLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <FormControl>
                  <Input
                    placeholder="your.email@company.com"
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    className="pl-10 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-slate-800 font-medium hover:bg-slate-900"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  );
}
