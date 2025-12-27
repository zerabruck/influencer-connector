"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../context/auth-context";
import { apiClient } from "../../lib/api-client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center mb-4 shadow-sm">
            <Sparkles className="w-5 h-5 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to InfluencerConnect</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your details below</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                {...register("email")}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-sans"
                type="email"
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs font-medium text-slate-500 hover:text-slate-900">Forgot password?</Link>
              </div>
              <input
                {...register("password")}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-sans"
                type="password"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-md mt-2 transition-colors font-medium">
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-slate-900 hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
