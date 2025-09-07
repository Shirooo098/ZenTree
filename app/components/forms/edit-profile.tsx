'use client';

import { editProfileInformation } from "@/app/actions/edit-profile.action";
import { EditProfileState, User } from "@/app/types/definition";
import Button from "@/app/ui/button";
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner";

interface EditProfileProps {
    userData: User
}

export default function EditProfile({ userData }: EditProfileProps){
    const [userProfile, setUserProfile] = useState<User>(userData);
    const [isEdit, setIsEdit] = useState(false);
    const initialState: EditProfileState = { message: null, errors: {}}
    const [state, formAction] = useActionState(editProfileInformation, initialState)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCancel = () => {
        setUserProfile(userData);
        setIsEdit(false);
    }

    useEffect(() => {
        if (state.message) {
            if (state.message === 'Update user information successfully.') {
                toast.success(state.message);
                setIsEdit(false); // Exit edit mode on success
            } else if (state.message === 'Failed to update profile. Please try again.') {
                toast.error(state.message);
            }
        }
    }, [state.message]);

    return(
        <>
            <h1>Edit Profile</h1>
            <form action={formAction}  className="flex flex-col">
                <input 
                    className="hidden"
                    defaultValue={userProfile.id}
                    name="id"/>
                <label htmlFor="name">Name:</label>
                <input 
                    name="name"
                    type="text"
                    defaultValue={userProfile.name}
                    onChange={handleChange}
                    aria-describedby="name-error"
                    className="input-style"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name && 
                    state.errors.name.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                        </p>
                    ))
                    }
                </div>
                <label htmlFor="username">Username:</label>
                <input 
                    name="username"
                    type="text"
                    defaultValue={userProfile.username || ''}
                    onChange={handleChange}
                    aria-describedby="username-error"
                    className="input-style"
                />
                <div id="username-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.username && 
                    state.errors.username.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                        </p>
                    ))
                    }
                </div>

                <label htmlFor="email">Email:</label>
                <input 
                    type="email"
                    defaultValue={userProfile.email}
                    disabled
                    className="input-style"
                />
                <label htmlFor="mobile-nuber">Mobile Number:</label>
                <input 
                    name="phoneNumber"
                    type="text"
                    placeholder="Mobile Number"
                    defaultValue={userProfile.phoneNumber || ""}
                    onChange={handleChange}
                    aria-describedby="phoneNumber-error"
                    className="input-style"
                 />
                <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.phoneNumber && 
                    state.errors.phoneNumber.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                        </p>
                    ))
                    }
                </div>
                
                <div className="flex justify-between mt-5">
                    <Button variant="secondary" size="lg" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="lg">Edit Profile</Button>
                </div>
            </form>
        </>
    )
}