"use client";

import Link from "next/link";
import Button from "../../../ui/button";
import { PiGoogleLogoBold } from "react-icons/pi";
import { signIn } from "@/server/users";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { signInWithGoogle } from "@/app/lib/auth-client";
import { ManRope } from "@/app/ui/fonts";
import { Loader } from "../../loader/loader";
import Logo from "@/app/ui/Logo";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password is required"),
});

export default function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await signIn(values.email, values.password);

      if (result.success) {
        toast("Signed-In Successfully");

        console.log("Role", result.role);
        if (result.role === "admin" || result.role === "staff") {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occured"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${ManRope.className} flex flex-col py-4 px-6 w-[260px] xs:w-[280px] sm:w-[320px] lg:w-[380px]
                bg-main-white text-dark-brown rounded-lg`}
    >
      <Logo />
      <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-bold">
        Sign-In Form
      </h1>
      <label htmlFor="Email" className="label-style">
        Email:
      </label>
      <input
        type="text"
        placeholder="johndoe@gmail.com"
        {...register("email")}
        className="input-style"
      />
      {errors.email && (
        <span className="error-span">{errors.email.message}</span>
      )}
      <label htmlFor="Password" className="label-style">
        Password:
      </label>
      <input
        type="password"
        placeholder="********"
        {...register("password")}
        className="input-style"
      />
      {errors.password && (
        <span className="error-span">{errors.password.message}</span>
      )}
      {error && <div className="error-span mt-2 mb-4">{error}</div>}
      <Button
        disabled={isSubmitting}
        variant="primary"
        size="md"
        className="inline-flex justify-center items-center mt-5 p-2"
      >
        {isSubmitting ? <Loader /> : "Sign-In"}
      </Button>

      <div className="relative flex items-center mt-2">
        <div className="grow border-t border-black"></div>
        <span className="capitalize text-center px-2 text-sm">
          {" "}
          or continue with
        </span>
        <div className="grow border-t "></div>
      </div>

      <Button
        type="button"
        onClick={signInWithGoogle}
        variant="secondary"
        size="md"
        className="mt-2 p-2 inline-flex justify-center items-center gap-2"
      >
        <PiGoogleLogoBold />
        Sign In with Google
      </Button>
      <p className="capitalize mt-4 text-center text-xs md:text-sm lg:text-base">
        Don&apos;t Have an Account? |{" "}
        <Link href="/sign-up" className="text-blue-800">
          Sign-Up
        </Link>
      </p>
    </form>
  );
}
