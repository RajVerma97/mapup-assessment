"use client";

import { getUser, logout } from "@/utils/userUtils";
import axios from "axios";
import React from "react";

export default function Home() {
  const user = getUser();
  const AllowedFileUploadType = ["csv"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileInput = document.getElementById("file") as HTMLFormElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (!AllowedFileUploadType.includes(fileExtension as string)) {
      alert("Please upload a csv file");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-16">
      <h1 className="text-center text-2xl font-bold text-white">
        Welcome to Dashboard
      </h1>

      <form action="/upload" method="POST" onSubmit={handleSubmit}>
        <input type="file" name="file" id="file" />
        <button type="submit">Upload</button>
      </form>

      {user ? (
        <div className="text-center">
          <div className="text-center">
            <p>Welcome, {user.username}!</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-red-500 text-center p-4">
            Please log in to see your information.
          </p>
          <a href="/login">login</a>
          <br />
          <a href="/register">Register</a>
        </div>
      )}
    </div>
  );
}
