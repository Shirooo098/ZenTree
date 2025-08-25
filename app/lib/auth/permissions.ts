import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";


const statement = { 
    ...defaultStatements,
    project: ["create", "share", "update", "delete", "update:own", "delete:own"], 
} as const; 

export const ac = createAccessControl(statement); 


export const user = ac.newRole({
        project: ["create", "share", "update:own", "delete:own"]
})

export const admin = ac.newRole({
    project: ["create", "share", "update", "delete", "update:own", "delete:own"],
    ...adminAc.statements
})