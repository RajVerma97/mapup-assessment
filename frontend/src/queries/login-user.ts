import axiosInstance from "@/lib/axiosInstance";
import { LoginUserData } from "@/types/login-user";

export default async function registerUser(data: LoginUserData) {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
}
