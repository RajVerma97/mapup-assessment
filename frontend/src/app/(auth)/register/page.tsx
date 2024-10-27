"use client";

import { useState } from "react";
import axios from "axios";

enum AlertCategory {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
interface AlertMessage {
  text: string;
  category: AlertCategory;
}

enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

interface RegisterProps {
  setPath: React.Dispatch<React.SetStateAction<string>>;
}
export default function Register({ setPath }: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  const [message, setMessage] = useState<AlertMessage>();

  const Backend = process.env.NEXT_PUBLIC_BACKEND;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
      username: userName,
      role: role,
    };

    try {
      const response = await axios.post(`${Backend}/api/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setMessage({
          text: "Successfully registered",
          category: AlertCategory.SUCCESS,
        });
        setEmail("");
        setPassword("");
        setUserName("");
        setRole(UserRole.USER);

        setPath("/dashboard");
      } else {
        setMessage({
          text: "Failed to register",
          category: AlertCategory.ERROR,
        });
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Failed to register"
          : "Network error, please try again";

      setMessage({
        text:
          typeof errorMessage === "string"
            ? errorMessage
            : JSON.stringify(errorMessage),
        category: AlertCategory.ERROR,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-400 text-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-center text-black text-3xl font-bold mb-6">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
            className="bg-black   text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200 mt-6"
          >
            Submit
          </button>

          {message && (
            <div className="mt-4">
              {message.category === AlertCategory.SUCCESS ? (
                <p className="text-green-500">{message.text}</p>
              ) : (
                <p className="text-red-500">{message.text}</p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
