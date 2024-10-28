import useAuthenticatedMutation from "./use-authenticated-mutation";
import { LoginAuthResponse, LoginUserData } from "@/types/login-user";
import loginUser from "@/queries/login-user";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";

export default function useLoginUserMutation(options?: {
  onSuccess?: (data: LoginAuthResponse) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}) {
  return useAuthenticatedMutation({
    mutationFn: async (data: LoginUserData) => loginUser(data),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
