"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail, Lock } from "lucide-react";

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
import { PasswordInput } from "@/components/password-input";
import { loginFormSchema, LoginFormValues } from "@/lib/validations/auth";
import { login } from "@/lib/api/mockAuthService";
import { OtpVerificationModal } from "@/components/user-management/otp-verification-modal";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      const token = await login(values.email, values.password);
      console.log("Logged in! Token:", token);

      // Store the token temporarily and open the OTP modal
      setPendingToken(token);
      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    if (!pendingToken) return;

    setIsVerifyingOtp(true);
    setOtpError(null);

    // Simulate OTP verification with a delay
    setTimeout(() => {
      if (otp === "123456") {
        // OTP is correct, proceed with login
        localStorage.setItem("token", pendingToken);
        setIsOtpModalOpen(false);
        router.push("/dashboard");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
      setIsVerifyingOtp(false);
    }, 1500);
  };

  const handleResendOtp = () => {
    // Simulate OTP resend
    console.log("OTP resent to the user.");
  };

  return (
    <>
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
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="your.email@company.com"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      className="pl-10 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Password
                </FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <PasswordInput
                    field={field}
                    disabled={isLoading}
                    placeholder="••••••••"
                  />
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        open={isOtpModalOpen}
        onOpenChange={(open) => {
          setIsOtpModalOpen(open);
          if (!open) {
            setOtpError(null);
          }
        }}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        isVerifying={isVerifyingOtp}
        error={otpError}
      />
    </>
  );
}
