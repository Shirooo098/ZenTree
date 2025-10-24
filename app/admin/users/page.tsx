import { AddUserDialog } from "@/app/ui/admin/dialog/user-dialog/AddUserDialog";
import UsersTable from "@/app/ui/admin/users/all-users";
import { getAllUsers } from "@/server/users";

export default async function Page(){

    const allUsers = await getAllUsers();

    return(
        <div>
            <div className="flex justify-end pb-4">
                <AddUserDialog />
            </div>
            <UsersTable usersData={allUsers ?? []}/>
        </div>
    )
}