"use client";

import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";

export default function Home() {
  const [path, setPath] = React.useState("/dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full h-screen p-6">
      <div className="w-full h-full grid grid-cols-12 rounded-2xl relative">
        <div
          className={`
            ${
              isSidebarOpen
                ? "fixed inset-0 z-50 w-full md:w-auto md:relative md:inset-auto"
                : "hidden md:block md:col-span-3"
            }
          `}
        >
          <Sidebar
            className="h-full rounded-2xl rounded-tr-none rounded-br-none bg-white"
            path={path}
            setPath={setPath}
            handleToggleSidebar={handleToggleSidebar}
          />
        </div>

        <MainContent
          className={`
            col-span-12 md:col-span-9 
            rounded-2xl rounded-tl-none rounded-bl-none 
            overflow-auto
            transition-all duration-300 ease-in-out
          `}
          path={path}
          setPath={setPath}
          handleToggleSidebar={handleToggleSidebar}
        />
      </div>
    </div>
  );
}
