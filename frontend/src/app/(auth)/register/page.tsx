"use client";

import { useState } from "react";
import useRegisterUserMutation from "@/app/hooks/use-register-user-mutation";
import { notify, ToastManager } from "@/components/ToastManager";
import { UserRole } from "@/enums/UserRole";
import { RegisterAuthResponse, RegisterUserData } from "@/types/register-user";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";

interface RegisterProps {
  setPath: React.Dispatch<React.SetStateAction<string>>;
}
export default function Register({ setPath }: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  const registerMutation = useRegisterUserMutation({
    onSuccess: (data: RegisterAuthResponse) => {
      setEmail("");
      setPassword("");
      setUserName("");
      setRole(UserRole.USER);

      notify({
        message: data?.message || "User Registered Successfully",
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
    const data: RegisterUserData = {
      email: email,
      password: password,
      username: userName,
      role: role,
    };

    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-400 text-black">
      <div className="bg-white  shadow-lg rounded-lg p-16 max-w-2xl  w-full">
        <h1 className="text-center text-black text-3xl font-bold mb-8">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border  border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border   border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label htmlFor="username" className="font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border   border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label htmlFor="role" className="font-medium ">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="border   border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.MANAGER}>Manager</option>
            <option value={UserRole.USER}>User</option>
          </select>

          <button
            type="submit"
            className="bg-black col-span-2 h-full   text-white rounded-lg  hover:bg-blue-600 transition duration-200 mt-6"
          >
            Submit
          </button>
        </form>
        <ToastManager />
      </div>
    </div>
  );
}
