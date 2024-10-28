import { useCallback } from "react";

export const useLogout = () => {
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }, []);

  return { logout };
};
