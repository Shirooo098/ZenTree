import { AddUserDialog } from "@/app/ui/admin/dialog/user-dialog/AddUserDialog";
import UsersTable from "@/app/ui/admin/users/all-users";
import { getAllUsers, getCurrentUser } from "@/server/users";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  const allUsers = await getAllUsers();

  if (user.role !== "admin") redirect("/admin");
  return (
    <div>
      <div className="flex justify-end pb-4">
        <AddUserDialog />
      </div>
      <UsersTable usersData={allUsers ?? []} />
    </div>
  );
}
