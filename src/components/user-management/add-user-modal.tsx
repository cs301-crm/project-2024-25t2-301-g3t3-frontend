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
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAgent: (agent: Omit<Agent, "id">, showOtpVerification: boolean) => void;
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

  const handleChange = (field: keyof Omit<Agent, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Pass the agent data and indicate that OTP verification should be shown
    onAddAgent(formData, true);

    // Reset form (will be cleared when modal closes)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      status: "active",
    });
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
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700 text-sm">
                A temporary password will be auto-generated and emailed to the
                agent along with their username.
              </AlertDescription>
            </Alert>

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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
