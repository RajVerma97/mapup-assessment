import fileUpload from "@/queries/file-upload";
import useAuthenticatedMutation from "./use-authenticated-mutation";
import { notify } from "@/components/ToastManager";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";

export default function useFileUploadMutation() {
  return useAuthenticatedMutation({
    mutationFn: async (data: FormData) => fileUpload(data),
    onSuccess: (data) =>
      notify({
        message: data?.message || "File uploaded successfully",
        status: "success",
      }),
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error?.response?.data?.message;
      notify({
        message: errorMessage || "Something went wrong",
        status: "error",
      });
    },
  });
}
