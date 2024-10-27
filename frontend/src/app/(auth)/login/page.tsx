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

interface LoginProps {
  setPath: React.Dispatch<React.SetStateAction<string>>;
}
export default function Login({ setPath }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [message, setMessage] = useState<AlertMessage>();

  const Backend = process.env.NEXT_PUBLIC_BACKEND;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${Backend}/api/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setMessage({
          text: "Successfully Logged In",
          category: AlertCategory.SUCCESS,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setEmail("");
        setPassword("");
        setPath("/dashboard");
      } else {
        setMessage({
          text: "Failed to login",
          category: AlertCategory.ERROR,
        });
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Failed to login"
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
