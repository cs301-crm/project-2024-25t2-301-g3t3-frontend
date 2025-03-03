"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";

interface PasswordInputProps {
  placeholder?: string;
  disabled?: boolean;
  field: any;
  className?: string;
}

export function PasswordInput({
  placeholder = "••••••••",
  disabled = false,
  field,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl>
      <div className="relative">
        <Input
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          disabled={disabled}
          className={`pl-10 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 ${className}`}
          {...field}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-slate-500" />
          ) : (
            <Eye className="h-4 w-4 text-slate-500" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    </FormControl>
  );
}
