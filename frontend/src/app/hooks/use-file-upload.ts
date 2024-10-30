import fileUpload from "@/queries/file-upload";
import useAuthenticatedMutation from "./use-authenticated-mutation";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";
import { FileUploadAuthResponse } from "@/types/dashboard";

export default function useFileUploadMutation(options?: {
  onSuccess?: (data: FileUploadAuthResponse) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}) {
  return useAuthenticatedMutation({
    mutationFn: async (data: FormData) => fileUpload(data),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
