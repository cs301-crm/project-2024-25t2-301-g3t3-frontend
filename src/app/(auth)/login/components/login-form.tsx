"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import { userService } from "@/lib/api/userService";
import { OtpVerificationModal } from "@/components/user-management/otp-verification-modal";
import {
  OtpVerificationDTO,
  ResendOtpRequestDTO,
  UserContextDTO,
} from "@/lib/api/types";
import { useUser } from "@/contexts/user-context";
import { toast } from "@/components/ui/use-toast";
export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { setUser } = useUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError("");
    setEmail(values.email);
    try {
      const result = await userService.login(values);

      if (result.success) {
        setIsOtpModalOpen(true);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    if (isVerifyingOtp) return;
    setIsVerifyingOtp(true);
    setOtpError(null);
    try {
      const OtpDTO: OtpVerificationDTO = {
        email,
        oneTimePassword: otp,
      };
      const result = await userService.verifyAuthOtp(OtpDTO);

      if (result.success) {
        const { userId, fullName, role } = result.message;
        const user: UserContextDTO = { userId, fullName, role };

        localStorage.setItem("userEmail", email);

        // Update state
        setUser(user);
        toast({
          title: "Login Success",
          description: `Welcome back, ${fullName}`,
        });

        const redirectAfterLogin = sessionStorage.getItem("redirectAfterLogin");
        if (redirectAfterLogin) {
          sessionStorage.removeItem("redirectAfterLogin");
          router.push(redirectAfterLogin);
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error("Failed to verify OTP");
      }
    } catch (err) {
      setOtpError("Failed to verify OTP");
      console.log(err);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    try {
      if (!email) return;
      const resendDTO: ResendOtpRequestDTO = {
        email,
      };
      const result = await userService.resendAuthOtp(resendDTO);
      if (result.success) {
        console.log("OTP resent to the user.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-3">
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
                      placeholder="your.email@scroogebank.com"
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
            className="w-full bg-slate-800 font-medium cursor-pointer hover:bg-slate-900"
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
