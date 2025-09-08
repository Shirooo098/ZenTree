"use client";

import { editProfileInformation } from "@/app/actions/edit-profile.action";
import { EditProfileState, User } from "@/app/types/definition";
import Button from "@/app/ui/button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRound, Mail, Phone } from 'lucide-react';

interface EditProfileProps {
  userData: User;
}

export default function EditProfile({ userData }: EditProfileProps) {
  const [userProfile, setUserProfile] = useState<User>(userData);
  const [isEdit, setIsEdit] = useState(false);
  const initialState: EditProfileState = { message: null, errors: {} };
  const [state, formAction] = useActionState(
    editProfileInformation,
    initialState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setUserProfile(userData);
    setIsEdit(false);
  };

    useEffect(() => {
        if (state.message) {
            if (state.message === 'Update user information successfully.') {
                toast.success(state.message);
                setIsEdit(false); 
            } else if (state.message === 'Failed to update profile. Please try again.') {
                toast.error(state.message);
            }
        }
    }, [state.message]);

  return (
    <div className="pt-10">
      <form
        action={formAction}
        className="bg-white shadow-lg rounded-xl p-9 space-y-6"
      >
        <input type="hidden" name="id" value={userData.id} />

        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <div className="flex gap-2">
            <UserRound />
            <label htmlFor="name" className="text-gray-500 font-medium flex items-center">Name:</label>
          </div>
          <input
            name="name"
            type="text"
            defaultValue={userProfile.name}
            onChange={handleChange}
            aria-describedby="name-error"
            className="font-semibold text-gray-800 bg-transparent focus:outline-none w-1/2 text-right"
          />
        </div>
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <div className="flex gap-2">
            <UserRound />
            <label htmlFor="name" className="text-gray-500 font-medium flex items-center">Username:</label>
          </div>
          <input
            name="username"
            type="text"
            defaultValue={userProfile.username || ""}
            onChange={handleChange}
            aria-describedby="username-error"
            className="font-semibold text-gray-800 bg-transparent focus:outline-none w-1/2 text-right"
          />
        </div>
        <div id="username-error" aria-live="polite" aria-atomic="true">
          {state.errors?.username?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <div className="flex gap-2">
            <Mail />
            <label htmlFor="email" className="text-gray-500 font-medium flex items-center">
              Email:
            </label>
          </div>
          <input
            type="email"
            defaultValue={userProfile.email}
            disabled
            className="font-semibold text-gray-800 bg-transparent focus:outline-none w-1/2 text-right"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Phone />
            <label htmlFor="phoneNumber" className="text-gray-500 font-medium flex items-center">
              Phone Number:
            </label>
          </div>
          <input
            name="phoneNumber"
            type="text"
            placeholder="Mobile Number"
            defaultValue={userProfile.phoneNumber || ""}
            onChange={handleChange}
            aria-describedby="phoneNumber-error"
            className="font-semibold text-gray-800 bg-transparent focus:outline-none w-1/2 text-right"
          />
        </div>
        <div id="phoneNumber-error" aria-live="polite" aria-atomic="true">
          {state.errors?.phoneNumber?.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>

        <div className="flex justify-between mt-5">
          <Button variant="secondary" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="lg">
            Edit Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
