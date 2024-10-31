import Login from "@/app/(auth)/login/page";
import Register from "@/app/(auth)/register/page";
import React, { useMemo } from "react";
import Dashboard from "./Dashboard";

interface MainContentProps {
  className?: string;
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  handleToggleSidebar: () => void;
}
export default function MainContent({
  className,
  path,
  handleToggleSidebar,
}: MainContentProps) {
  const content = useMemo(() => {
    switch (path) {
      case "/dashboard":
        return <Dashboard handleToggleSidebar={handleToggleSidebar} />;
      case "/register":
        return <Register />;
      case "/login":
        return <Login />;
    }
  }, [path, handleToggleSidebar]);
  return <div className={` ${className}  `}>{content}</div>;
}
