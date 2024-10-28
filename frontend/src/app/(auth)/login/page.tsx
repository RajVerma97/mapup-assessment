"use client";

import useLoginUserMutation from "@/app/hooks/use-login-user-mutation";
import { notify, ToastManager } from "@/components/ToastManager";
import { ErrorResponse } from "@/types/error-response";
import { LoginAuthResponse, LoginUserData } from "@/types/login-user";
import { AxiosError } from "axios";
import { useState } from "react";

interface LoginProps {
  setPath: React.Dispatch<React.SetStateAction<string>>;
}


export default function Login({ setPath }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginMutation = useLoginUserMutation({
    onSuccess: (data: LoginAuthResponse) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEmail("");
      setPassword("");
      notify({
        message: data.message,
        status: "success",
      });
      setTimeout(() => {
        setPath("/dashboard");
      }, 3000);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error?.response?.data?.message;
      notify({
        message: errorMessage || "Something went wrong",
        status: "error",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: LoginUserData = {
      email: email,
      password: password,
    };

    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-500 text-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-center text-3xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="bg-black text-white rounded-lg p-2 hover:bg-green-600 transition duration-200"
          >
            Submit
          </button>
        </form>
        <ToastManager />
      </div>
    </div>
  );
}