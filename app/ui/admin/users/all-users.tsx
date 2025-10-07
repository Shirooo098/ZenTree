"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Ban, CheckCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import BanUserDialog from "../dialog/BanUserDialog";

// Type definition based on your schema
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

  const handleBanClick = (user: UserData) => {
    setSelectedUser(user);
    setIsBanDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsBanDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    onUserUpdated?.();
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "default";
      case "moderator":
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
        <TableCell className="space-x-2">
            <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBanClick(user)}
            >
            <Ban className="w-4 h-4 mr-1" /> {user.banned ? "Banned" : "Ban"}
            </Button>
        </TableCell>
        </TableRow>
    );

    return (
    <>
        <div className="w-full mt-6">
            {/* Desktop View */}
            <div className="border rounded-lg hidden lg:block">
            <TableUI
                items={usersData}
                tableHeads={tableHeads}
                tableRow={displayTableRow}
            />
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:hidden">
            {usersData.map((user) => (
                

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
                  <div className="flex items-center gap-2">
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

                <Button
                    variant="destructive"
                    className="w-full mt-3"
                    size="sm"
                    onClick={() => handleBanClick(user)}
                >
                    <Ban className="w-4 h-4 mr-1" /> {user.banned ? "Banned" : "Ban User"}
                </Button>
                </div>
            ))}
            </div>
        </div>
        
        <BanUserDialog
            user={selectedUser}
            isOpen={isBanDialogOpen}
            onClose={handleDialogClose}
            onSuccess={handleSuccess}
        />
    </>
  );
};

export default UsersTable;