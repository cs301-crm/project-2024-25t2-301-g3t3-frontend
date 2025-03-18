"use client";

import type React from "react";

import { useState } from "react";
import type { Agent } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AddAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAgent: (agent: Omit<Agent, "id">) => void;
}

export function AddAgentModal({
  open,
  onOpenChange,
  onAddAgent,
}: AddAgentModalProps) {
  const [formData, setFormData] = useState<Omit<Agent, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    status: "active",
  });
  const [password, setPassword] = useState("");
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);

  const handleChange = (field: keyof Omit<Agent, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, you would handle the password here
    const finalPassword = autoGeneratePassword
      ? generateRandomPassword()
      : password;
    console.log(`Creating agent with password: ${finalPassword}`);

    onAddAgent(formData);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      status: "active",
    });
    setPassword("");
    setAutoGeneratePassword(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Create a new agent account. They will receive an email with login
              instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoGenerate"
                  checked={autoGeneratePassword}
                  onCheckedChange={(checked) =>
                    setAutoGeneratePassword(checked as boolean)
                  }
                />
                <Label htmlFor="autoGenerate">Auto-generate password</Label>
              </div>
            </div>
            {!autoGeneratePassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!autoGeneratePassword}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Agent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
