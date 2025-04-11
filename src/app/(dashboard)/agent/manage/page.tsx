"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  Users,
  Search,
  Trash2,
  RefreshCw,
  UserPlus,
  FileText,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddUserModal } from "@/components/user-management/add-user-modal";
import { OtpVerificationModal } from "@/components/user-management/otp-verification-modal";
import { EditUserModal } from "@/components/user-management/edit-user-modal";
import { ViewClientsModal } from "@/components/user-management/view-clients-modal";
import { ViewLogsModal } from "@/components/user-management/view-logs-modal";
import { useToast } from "@/components/ui/use-toast";
import type { User, Client, LogEntry } from "@/lib/api/types";
import { userService } from "@/lib/api/userService";
import { mockUserService } from "@/lib/api/mockUserService";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { clientService } from "@/lib/api";
import {
  DangerousActionOtpVerificationDTO,
  ResendOtpRequestDTO,
  UpdateUserRequestDTO,
} from "@/lib/api/types";

function UserManagementInner() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Record<string, Client[]>>({});
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "agent" | "admin">(
    "all"
  );

  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingClientsUser, setViewingClientsUser] = useState<User | null>(
    null
  );
  const [viewingLogsUser, setViewingLogsUser] = useState<User | null>(null);

  // OTP verification states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<Omit<User, "id"> | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Refresh data when the component mounts
  useEffect(() => {
    const handleInitialLoad = async () => {
      await refreshData();
    };

    handleInitialLoad();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch data from the mock service
      const [fetchedUsers, fetchedClients, fetchedLogs] = await Promise.all([
        // userService.getAgents(),
        userService.getUsers(),
        mockUserService.getClients(),
        mockUserService.getLogs(),
      ]);

      setUsers(fetchedUsers);
      setClients(fetchedClients);
      setLogs(fetchedLogs);
    } catch (err) {
      setError("Failed to load user data. Please try again.");
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.trim().toLowerCase();
    const matchesSearch =
      searchLower === "" ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(
        searchLower
      ) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower);

    const matchesRole = roleFilter === "all" || user.userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (newUser: Omit<User, "id">) => {
    try {
      const result = await userService.createUser({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userRole: newUser.userRole.toUpperCase(), // "agent" → "AGENT"
      });

      if (result.success) {
        // Show OTP modal instead of immediately refreshing
        setPendingUser(newUser); // for use in OTP verification
        setIsAddUserOpen(false); // close the modal
        setIsOtpModalOpen(true); // open the OTP modal
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to the email.",
        });
      } else {
        toast({
          title: "Failed to create user",
          description: "Unexpected response from backend.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "User creation failed.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!pendingUser) return;

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setOtpError("Missing admin email");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const dto: DangerousActionOtpVerificationDTO = {
        email: userEmail,
        // email: user.email,
        oneTimePassword: otp,
        otpContext: "create",
      };

      const result = await userService.verifyUserOtp(dto);

      if (result.success) {
        setIsOtpModalOpen(false);
        setPendingUser(null);
        await refreshData();
        toast({
          title: "User Verified",
          description: "The new user has been verified successfully.",
        });
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setOtpError("Failed to verify OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    const userEmail = localStorage.getItem("userEmail"); // or "adminEmail" if that's what you used
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Missing admin email to resend OTP.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dto: ResendOtpRequestDTO = {
        email: userEmail,
      };

      const result = await userService.resendAuthOtp(dto);
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        toast({
          title: "Failed to resend OTP",
          description: "Try again or contact support.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast({
        title: "Error",
        description: "Something went wrong while resending OTP.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: Omit<User, "id" | "status">) => {
    try {
      const payload: UpdateUserRequestDTO = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        userRole: updatedUser.userRole.toUpperCase(),
      };

      const result = await userService.updateUser(payload);

      if (result.success) {
        toast({
          title: "User updated",
          description: `${updatedUser.firstName} ${updatedUser.lastName} was successfully updated.`,
        });
        await refreshData(); // Refresh UI
      } else {
        toast({
          title: "Update failed",
          description: "Unexpected backend response.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while updating the user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const { updatedUsers, updatedClients, updatedLogs } =
        await mockUserService.deleteUser(id, users, clients, logs);
      setUsers(updatedUsers);
      setClients(updatedClients);
      setLogs(updatedLogs);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const userToToggle = users.find((u) => u.id === id);
    if (!userToToggle) return;

    try {
      const endpoint =
        userToToggle.status === "active"
          ? userService.disableUser
          : userService.enableUser;

      const payload = { email: userToToggle.email }; // 🔑 based on your backend

      const result = await endpoint(payload);

      if (result.success) {
        setUsers(
          users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status: user.status === "active" ? "disabled" : "active",
                }
              : user
          )
        );

        toast({
          title: `${userToToggle.firstName} ${userToToggle.lastName} ${
            userToToggle.status === "active" ? "disabled" : "enabled"
          }`,
        });
      } else {
        toast({
          title: "Failed to update status",
          description: "Unexpected backend response.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Status toggle error:", err);
      toast({
        title: "Error",
        description: "Could not toggle user status.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (id: string) => {
    console.log(`Password reset requested for user ${id}`);
    const updatedLogs = await mockUserService.resetPassword(id, logs);
    setLogs(updatedLogs);
  };

  // const getUserClients = (userId: string) => {
  //   return clients[userId] || [];
  // };

  const toggleUserExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, userId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleUserExpand(userId);
    }
  };

  // Count users by role and status
  const userCounts = {
    total: users.length,
    active: users.filter((user) => user.status === "active").length,
    disabled: users.filter((user) => user.status === "disabled").length,
    agents: users.filter((user) => user.userRole === "agent").length,
    admins: users.filter((user) => user.userRole === "admin").length,
  };

  return (
    <div className="flex flex-col space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500">Create and manage your user profiles</p>
      </div>

      <div className="grid gap-6">
        <DashboardCard
          title="User Overview"
          className="col-span-2 border-l-4 border-l-slate-700"
        >
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">User Summary</h3>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Users:</span>
                    <span className="font-medium">{userCounts.total}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Users:</span>
                    <span className="font-medium">{userCounts.active}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Disabled Users:</span>
                    <span className="font-medium">{userCounts.disabled}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Agents:</span>
                    <span className="font-medium">{userCounts.agents}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Admins:</span>
                    <span className="font-medium">{userCounts.admins}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="User List"
          className="border-l-4 border-l-slate-700 col-span-2"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 mb-4 justify-between">
              <Button size="sm" onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <div className="flex gap-2">
                <Tabs
                  value={roleFilter}
                  onValueChange={(value) =>
                    setRoleFilter(value as "all" | "agent" | "admin")
                  }
                >
                  <TabsList>
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="agent">Agents</TabsTrigger>
                    <TabsTrigger value="admin">Admins</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refreshData()}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh Data
                </Button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 text-slate-400 animate-spin mb-4" />
                <p className="text-sm text-slate-500">Loading users...</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-md border p-3 hover:bg-slate-50"
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleUserExpand(user.id)}
                          onKeyDown={(e) => handleKeyDown(e, user.id)}
                          aria-expanded={expandedUser === user.id}
                          aria-controls={`user-details-${user.id}`}
                        >
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <Badge variant="outline" className="ml-2">
                                {user.userRole === "admin" ? "Admin" : "Agent"}
                              </Badge>
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status === "active"
                                  ? "Active"
                                  : "Disabled"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>
                            <p className="text-xs text-slate-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end space-x-2">
                          {user.userRole === "agent" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingClientsUser(user);
                              }}
                            >
                              <Users className="mr-1 h-3 w-3" />
                              View Clients
                            </Button>
                          )}
                          {user.userRole === "agent" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingLogsUser(user);
                              }}
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              View Logs
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingUser(user);
                            }}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(user.id);
                            }}
                          >
                            {user.status === "active" ? (
                              <>
                                <ToggleRight className="mr-1 h-3 w-3" />
                                Disable
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-1 h-3 w-3" />
                                Enable
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-8">
                    <Users className="h-12 w-12 text-slate-300" />
                    <p className="text-sm text-slate-500">No users found</p>
                    <Button onClick={() => setIsAddUserOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add New User
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onAddUser={handleAddUser}
      />

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        open={isOtpModalOpen}
        onOpenChange={(open) => {
          setIsOtpModalOpen(open);
          if (!open) {
            setPendingUser(null);
            setOtpError(null);
          }
        }}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        isVerifying={isVerifyingOtp}
        error={otpError}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUpdateUser={handleUpdateUser}
          onResetPassword={handleResetPassword}
        />
      )}

      {viewingClientsUser && (
        <ViewClientsModal
          agent={viewingClientsUser}
          clients={clients[viewingClientsUser.id] || []}
          open={!!viewingClientsUser}
          onOpenChange={(open) => !open && setViewingClientsUser(null)}
        />
      )}

      {viewingLogsUser && (
        <ViewLogsModal
          agent={viewingLogsUser}
          logs={logs[viewingLogsUser.id] || []}
          open={!!viewingLogsUser}
          onOpenChange={(open) => !open && setViewingLogsUser(null)}
        />
      )}
    </div>
  );
}

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div>Loading User Management Page...</div>}>
      <UserManagementInner />
    </Suspense>
  );
}
