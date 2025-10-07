import UsersTable from "@/app/ui/admin/users/all-users";
import { getAllUsers } from "@/server/users";



export default async function Page(){

    const allUsers = await getAllUsers();

    return(
        <UsersTable usersData={allUsers ?? []}/>
    )
}