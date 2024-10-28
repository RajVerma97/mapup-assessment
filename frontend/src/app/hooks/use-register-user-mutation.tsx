import registerUser from "@/queries/register-user";
import useAuthenticatedMutation from "./use-authenticated-mutation";
import { RegisterAuthResponse, RegisterUserData } from "@/types/register-user";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/error-response";

export default function useRegisterUserMutation(options?: {
  onSuccess?: (data: RegisterAuthResponse) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
}) {
  return useAuthenticatedMutation({
    mutationFn: async (data: RegisterUserData) => registerUser(data),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      options?.onError?.(error);
    },
  });
}
