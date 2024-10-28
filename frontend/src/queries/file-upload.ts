import axiosInstance from "@/lib/axiosInstance";

export default async function fileUpload(data: FormData) {
  const response = await axiosInstance.post("/upload", data);
  return response.data;
}
