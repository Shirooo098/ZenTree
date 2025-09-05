'use server';

import { db } from "@/db/drizzle";
import { EditProfileState } from "../types/definition";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { schema } from "@/db/schema";

const EditProfileFormSchema = z.object({
    id: z.string(),
    name: z.string().min(5, "Name must have more than 5 characters."),
    username: z.string().min(5, "Username must have more than 5 characters."),
    phoneNumber: z.string()
        .min(11, "Please input the correct mobile number format.")
        .max(11, "Please input the correct mobile number format."),    
})



export async function editProfileInformation(
    prevState: EditProfileState, 
    formData: FormData
): Promise<EditProfileState>{

    const validateFields = EditProfileFormSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        username: formData.get('username'),
        phoneNumber: formData.get('phoneNumber')
    })

    if (!validateFields.success) {
        const flattened = z.flattenError(validateFields.error)
        return {
            message: "Validation failed",
            errors: flattened.fieldErrors
        };
    }

    const {id, name, username, phoneNumber} = validateFields.data;

    try {
        await db.update(schema.user)
                .set({
                    name,
                    username,
                    phoneNumber
                })
                .where(eq(schema.user.id, id));

        return{
            message: 'Update user information successfully.'
        }

    } catch (error) {
        console.error('Database error:', error);
        return{
            message: 'Failed to update profile. Please try again.'
        }
    }
    
}

