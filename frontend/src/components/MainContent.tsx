import Login from "@/app/(auth)/login/page";
import Register from "@/app/(auth)/register/page";
import React, { useMemo } from "react";
import Dashboard from "./Dashboard";

interface MainContentProps {
  className?: string;
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}
export default function MainContent({
  className,
  path,
  setPath,
}: MainContentProps) {
  const content = useMemo(() => {
    switch (path) {
      case "/dashboard":
        return <Dashboard />;
      case "/register":
        return <Register setPath={setPath} />;
      case "/login":
        return <Login setPath={setPath} />;
    }
  }, [path, setPath]);
  return <div className={` ${className}  `}>{content}</div>;
}
