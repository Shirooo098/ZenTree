"use client";

import { submitEmail } from "@/app/lib/customer/action";
import { EmailState } from "@/app/lib/customer/definitions";
import React from "react";
import { useActionState } from "react";

export default function ContactForm() {
  const initialState: EmailState = { errors: {}, errorMessage: null };
  const [state, formAction] = useActionState(submitEmail, initialState);

  return (
    <form
      action={formAction}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md border absolute right-100 mt-48 z-15 h-1/2"
    >
      <h3 className="text-lg font-semibold mb-4 text-center">
        Need help with your bonsai?
      </h3>

      {/* First + Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="border-b border-gray-400 focus:outline-none p-2 text-lg"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="border-b border-gray-400 focus:outline-none p-2 text-lg"
        />
      </div>
      {state.errors?.firstName && (
        <p className="text-sm text-red-500">{state.errors.firstName.join(", ")}</p>
      )}

      {/* Email + Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-b border-gray-400 focus:outline-none p-2 text-lg"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          className="border-b border-gray-400 focus:outline-none p-2 text-lg"
        />
      </div>
      {state.errors?.email && (
        <p className="text-sm text-red-500">{state.errors.email.join(", ")}</p>
      )}

      {/* Message */}
      <div className="mb-4">
        <textarea
          name="message"
          placeholder="Message"
          rows={5}
          className="border-b border-gray-400 focus:outline-none p-2 w-full text-lg resize-none"
        />
        {state.errors?.message && (
          <p className="text-sm text-red-500">{state.errors.message.join(", ")}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#6b584c] hover:bg-[#564338] text-white font-semibold py-2 px-4 rounded-md"
      >
        SUBMIT
      </button>

      {/* Status */}
      {state.errorMessage && (
        <p className="mt-2 text-sm text-red-500 text-center">
          {state.errorMessage}
        </p>
      )}
      {Object.keys(state.errors).length === 0 && !state.errorMessage && (
        <p className="mt-2 text-sm text-green-600 text-center">
          Message sent successfully!
        </p>
      )}
    </form>
  );
}
