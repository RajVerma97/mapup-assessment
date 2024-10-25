"use client";

import { getUser, logout } from "@/utils/userUtils";
import React from "react";

export default function Home() {
  const user = getUser();

  if (!user) {
    return <p>No user</p>;
  }

  return (
    <div className="p-16">
      <h1 className="text-center text-2xl font-bold">Hello Home</h1>
      {user ? (
        <div className="text-center">
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p className="text-red-500">Please log in to see your information.</p>
      )}
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
