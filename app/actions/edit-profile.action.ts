'use server';

import { EditProfileState } from "../types/definition";
import { z } from "zod";

const EditProfileFormSchema = z.object({
    id: z.string(),
    name: z.string().min(10, "Name must have more than 10 characters."),
    username: z.string().min(5, "Username must have more than 5 characters."),
    phoneNumber: z.string().min(10, "Please input the correct mobile number format."),    
})

const EditProfileForm = EditProfileFormSchema.omit({ id: true});


export async function editProfileInformation(
    prevState: EditProfileState, 
    formData: FormData
): Promise<EditProfileState>{

    const validateFields = EditProfileForm.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        username: formData.get('username'),
        phoneNumber: formData.get('phoneNumber')
    })

    if (!validateFields.success) {
        const flattened = z.flattenError(validateFields.error)
        return {
            errorMessage: "Validation failed",
            errors: flattened.fieldErrors
        };
    }

    console.log(validateFields)
    return {
        errorMessage: null,
        errors: {}
    };

    
}

