"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Ban, CheckCircle, Mail, Phone, MoreHorizontal, Eye, Edit, Trash2, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import BanUserDialog from "../dialog/user-dialog/BanUserDialog";
import { ViewUserDialog } from "../dialog/user-dialog/ViewUserDialog";
import { EditUserDialog } from "../dialog/user-dialog/EditUserDialog";
import { DeleteUserDialog } from "../dialog/user-dialog/DeleteUserDialog";

type UserData = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  username: string | null;
  displayUsername: string | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  phoneNumber: string | null;
  cancellationCount?: number;
};

const UsersTable = ({
  usersData,
  onUserUpdated
}: {
  usersData: UserData[];
  onUserUpdated?: () => void;
}) => {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  const tableHeads = [
    "User",
    "Email",
    "Username",
    "Role",
    "Status",
    "Cancellations (24h)",
    "Joined",
    "Actions",
  ];

  // Filter users based on all filter criteria
  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      // Search filter (name, email, username)
      const matchesSearch = searchQuery === "" || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()));

      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      // Status filter (banned/active)
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && !user.banned) ||
        (statusFilter === "banned" && user.banned);

      // Verification filter
      const matchesVerification = 
        verificationFilter === "all" ||
        (verificationFilter === "verified" && user.emailVerified) ||
        (verificationFilter === "unverified" && !user.emailVerified);

      return matchesSearch && matchesRole && matchesStatus && matchesVerification;
    });
  }, [usersData, searchQuery, roleFilter, statusFilter, verificationFilter]);

  const handleActionClick = (user: UserData, action: 'view' | 'edit' | 'delete' | 'ban') => {
    setSelectedUser(user);
    switch (action) {
      case 'view':
        setIsViewDialogOpen(true);
        break;
      case 'edit':
        setIsEditDialogOpen(true);
        break;
      case 'delete':
        setIsDeleteDialogOpen(true);
        break;
      case 'ban':
        setIsBanDialogOpen(true);
        break;
    }
  };

  const handleDialogClose = () => {
    setIsBanDialogOpen(false);
    setIsViewDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    onUserUpdated?.();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setVerificationFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || roleFilter !== "all" || statusFilter !== "all" || verificationFilter !== "all";

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "default";
      case "staff":
        return "secondary";
      default:
        return "outline";
    }
  };

  const displayTableRow = (user: UserData) => (
    <TableRow key={user.id} className="h-[80px]">
      {/* User Info */}
      <TableCell>
        <div className="flex justify-center items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            {user.displayUsername && (
              <span className="text-xs text-muted-foreground">
                @{user.displayUsername}
              </span>
            )}
          </div>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="text-sm">{user.email}</span>
          {user.emailVerified && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
        </div>
      </TableCell>

      {/* Username */}
      <TableCell>
        {user.username ? (
          <span className="text-sm">@{user.username}</span>
        ) : (
          <span className="text-xs text-muted-foreground">No username</span>
        )}
      </TableCell>

      {/* Role */}
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role || "user"}
        </Badge>
      </TableCell>

      {/* Status */}
      <TableCell>
        {user.banned ? (
          <div className="flex flex-col">
            <Badge variant="destructive" className="w-fit">
              <Ban className="w-3 h-3 mr-1" /> Banned
            </Badge>
            {user.banReason && (
              <span className="text-xs text-muted-foreground mt-1">
                {user.banReason}
              </span>
            )}
          </div>
        ) : (
          <Badge variant="outline" className="bg-green-50">
            Active
          </Badge>
        )}
      </TableCell>

      <TableCell>
        {user.cancellationCount !== undefined && user.cancellationCount > 0 ? (
          <Badge 
            variant={user.cancellationCount >= 3 ? "destructive" : "secondary"}
            className="font-mono"
          >
            {user.cancellationCount}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">0</span>
        )}
      </TableCell>

      {/* Join Date */}
      <TableCell className="text-sm">
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleActionClick(user, 'view')}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionClick(user, 'edit')}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleActionClick(user, 'ban')}
              className="text-orange-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              {user.banned ? "Manage Ban" : "Ban User"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleActionClick(user, 'delete')}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {/* Filters Section */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          {/* Verification Filter */}
          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {usersData.length} users
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <div className="w-full">
        {/* Desktop View */}
        <div className="border rounded-lg hidden lg:block">
          <TableUI
            items={filteredUsers}
            tableHeads={tableHeads}
            tableRow={displayTableRow}
          />
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    {user.username && (
                      <p className="text-xs text-muted-foreground">@{user.username}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                        {user.role || "user"}
                      </Badge>
                      {user.banned ? (
                        <Badge variant="destructive" className="text-xs">
                          Banned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-green-50">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs">{user.email}</span>
                    {user.emailVerified && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">{user.phoneNumber}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {user.cancellationCount !== undefined && user.cancellationCount > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Cancellations (24h):</span>
                    <Badge 
                      variant={user.cancellationCount >= 3 ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {user.cancellationCount}
                    </Badge>
                  </div>
                )}

                {user.banned && user.banReason && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-xs">
                    <span className="font-medium">Ban reason:</span> {user.banReason}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionClick(user, 'view')}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionClick(user, 'edit')}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleActionClick(user, 'ban')}
                  >
                    <Ban className="w-4 h-4 mr-1" /> {user.banned ? "Banned" : "Ban"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleActionClick(user, 'delete')}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No users found matching your filters</p>
              <Button
                variant="link"
                onClick={clearFilters}
                className="mt-2"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <BanUserDialog
        user={selectedUser}
        isOpen={isBanDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
      
      <ViewUserDialog
        user={selectedUser}
        isOpen={isViewDialogOpen}
        onClose={handleDialogClose}
      />
      
      <EditUserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
      
      <DeleteUserDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default UsersTable;