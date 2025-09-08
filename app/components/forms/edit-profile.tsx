"use client";

import { editProfileInformation } from "@/app/actions/edit-profile.action";
import { EditProfileState, User } from "@/app/types/definition";
import Button from "@/app/ui/button";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

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
        {/* Name */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <label htmlFor="name" className="text-gray-500 font-medium flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
            Name:
          </label>
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

        {/* Username */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <label htmlFor="username" className="text-gray-500 font-medium flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
            Username:
          </label>
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

        {/* Email */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <label htmlFor="email" className="text-gray-500 font-medium flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Email:
          </label>
          <input
            type="email"
            defaultValue={userProfile.email}
            disabled
            className="font-semibold text-gray-800 bg-transparent focus:outline-none w-1/2 text-right"
          />
        </div>

        {/* Mobile Number */}
        <div className="flex justify-between items-center">
          <label htmlFor="phoneNumber" className="text-gray-500 font-medium flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.48 2.5.74 3.85.74a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4.5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.65.74 3.85a1 1 0 01-.21 1.11l-2.2 2.2z" />
            </svg>
            Phone Number:
          </label>
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

        {/* Buttons */}
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
