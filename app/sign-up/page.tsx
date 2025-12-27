"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/auth-context";
import { apiClient } from "../../lib/api-client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["INFLUENCER", "BRAND"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function SignUpPage() {
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        role: "INFLUENCER"
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await signup(data.email, data.password, data);
      setSuccess(true);
      setError("");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 items-center justify-center px-6 py-12 font-sans text-slate-900">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Get started with InfluencerConnect</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          {success && (
            <div className="mb-6 rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Check your email to confirm your account!
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
                <input
                  {...register("firstName")}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                  placeholder="Jane"
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
                <input
                  {...register("lastName")}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                {...register("email")}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                type="email"
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <input
                {...register("password")}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                type="password"
                placeholder="At least 8 characters"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Type</label>
              <div className="relative">
                <select
                  {...register("role")}
                  className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:border-slate-900 transition-all appearance-none cursor-pointer pr-10 font-medium"
                >
                  <option value="INFLUENCER">Influencer</option>
                  <option value="BRAND">Brand</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-md mt-2 transition-colors font-medium">
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-slate-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
