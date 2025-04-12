"use client";

import type React from "react";
import { useState } from "react";
import type { User } from "@/lib/api/types";
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
// import { AlertCircle } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface EditUserModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (user: User) => void;
  onResetPassword: (id: string) => void;
}

export function EditUserModal({
  user,
  open,
  onOpenChange,
  onUpdateUser,
}: // onResetPassword,
EditUserModalProps) {
  const [formData, setFormData] = useState<User>({ ...user });
  // const [passwordResetRequested, setPasswordResetRequested] = useState(false);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    // setPasswordResetRequested(false);
  };

  // const handleResetPassword = () => {
  //   onResetPassword(user.id);
  //   setPasswordResetRequested(true);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <div className="flex items-center h-10 px-3 rounded-md border border-input bg-muted text-sm">
                <Badge
                  variant={user.userRole === "admin" ? "default" : "outline"}
                >
                  {user.userRole === "admin" ? "Admin" : "Agent"}
                </Badge>
                <span className="ml-2 text-xs text-muted-foreground">
                  (Role cannot be changed)
                </span>
              </div>
            </div>

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
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={formData.id}
                disabled
                className="bg-muted"
              />
            </div>

            {/* {passwordResetRequested && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Password Reset Requested</AlertTitle>
                <AlertDescription>
                  A password reset email has been sent to the user.
                </AlertDescription>
              </Alert>
            )} */}
          </div>
          <DialogFooter className="flex items-center justify-end">
            {/* <Button
              type="button"
              variant="outline"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button> */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
