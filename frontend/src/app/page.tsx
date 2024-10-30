"use client";

import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default function Home() {
  const [path, setPath] = React.useState("/dashboard");

  return (
    <div className="w-full h-screen  p-6  ">
      <div className="w-full h-full grid grid-cols-12 rounded-2xl">
        <Sidebar
          className="col-span-3 rounded-2xl rounded-tr-none rounded-br-none hidden md:block overflow-hidden"
          path={path}
          setPath={setPath}
        />
        <MainContent
          className="col-span-12 md:col-span-9  rounded-2xl rounded-tl-none rounded-bl-none overflow-auto"
          path={path}
          setPath={setPath}
        />
      </div>
    </div>
  );
}
