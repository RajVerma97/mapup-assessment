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

export default function Register() {
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
      } else {
        setMessage({
          text: "Failed to register",
          category: AlertCategory.ERROR,
        });
        console.log("here");
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message || "Failed to register"
          : "Network error, please try again";
      console.log("catch");
      console.log(error);

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
    <div className="p-16">
      <h1 className="text-center text-2xl font-bold">Register</h1>
      <div className="p-5 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          action="/api/register"
          method="POST"
          className="flex flex-col max-w-md gap-4"
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black"
          />

          <label htmlFor="username">username</label>
          <input
            type="username"
            name="username"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-black"
          />

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="text-black"
          >
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.MANAGER}>Manager</option>
            <option value={UserRole.USER}>User</option>
          </select>

          <button type="submit">Submit</button>

          {message && (
            <div>
              {message.category === AlertCategory.SUCCESS ? (
                <p className="text-green-500">Success: {message.text}</p>
              ) : (
                <p className="text-red-500">Error: {message.text}</p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
