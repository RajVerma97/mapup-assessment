import axiosInstance from "@/lib/axiosInstance";
import { RegisterUserData } from "@/types/register-user";

export default async function registerUser(data: RegisterUserData) {
  const response = await axiosInstance.post("/user/register", data);
  return response.data;
}
