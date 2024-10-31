import { io } from "socket.io-client";

if (!process.env.NEXT_PUBLIC_BACKEND) {
  throw new Error("NEXT_PUBLIC_BACKEND environment variable is not defined");
}

export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}`, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  path: "/socket.io/",
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  secure: true,
});
