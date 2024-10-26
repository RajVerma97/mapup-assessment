"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

enum AlertCategory {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
interface AlertMessage {
  text: string;
  category: AlertCategory;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [message, setMessage] = useState<AlertMessage>();

  const Backend = process.env.NEXT_PUBLIC_BACKEND;

  const router = useRouter();

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
      console.log("response from login");
      console.log(response);
      if (response.status === 200) {
        setMessage({
          text: "Successfully Logged In",
          category: AlertCategory.SUCCESS,
        });
        localStorage.setItem("token", response.data.token);
        console.log("saved to local", localStorage.getItem("token"));
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info

        router.push("/");

        // const protectedResponse = await axios.get(`${Backend}/protected`, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        // console.log(protectedResponse);

        setEmail("");
        setPassword("");
      } else {
        setMessage({
          text: "Failed to login",
          category: AlertCategory.ERROR,
        });
        console.log("here");
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
    <div className="p-16">
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <div className="p-5 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          action="/api/login"
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
