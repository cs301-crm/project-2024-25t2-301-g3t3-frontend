import { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

import { ForgotPasswordForm } from "./components/forgot-password-form"; // Update this import
import { Branding } from "@/components/branding";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Forgot Password | Scrooge Bank CRM System",
  description: "Reset your password for the Scrooge Bank CRM system",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <Branding size="md" showTagline={true} layout="horizontal" />

      <Card className="w-full border-slate-200 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-center text-xl font-medium tracking-tight">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <ForgotPasswordForm /> {/* Update this component */}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t bg-slate-50 px-6 py-4">
          <div className="flex justify-center space-x-4 text-center text-sm">
            <Link
              href="/login"
              className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
            >
              Back to login
            </Link>
          </div>
          <div className="flex items-center justify-center text-center text-xs text-slate-500">
            <Shield className="mr-1 h-3 w-3" />
            Protected by company security policies
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
