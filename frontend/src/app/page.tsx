"use client";

// import { getUser, logout } from "@/utils/userUtils";
// import axios from "axios";
// import useFetchWeatherData from "./hooks/use-fetch-weather-data";
// import SideBar from "@/components/Sidebar";
// import { Main } from "next/document";
// import DetailPanel from "@/components/DetailPanel";
// import Main from "@/components/Main";
import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";
import React from "react";

export default function Home() {
  const [path, setPath] = React.useState("/dashboard");

  // const user = getUser();
  // const AllowedFileUploadType = ["csv"];

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const fileInput = document.getElementById("file") as HTMLFormElement;
  //   const file = fileInput.files?.[0];

  //   if (!file) {
  //     alert("Please upload a file");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const fileExtension = file.name.split(".").pop()?.toLowerCase();

  //   if (!AllowedFileUploadType.includes(fileExtension as string)) {
  //     alert("Please upload a csv file");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND}/upload`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       alert("File uploaded successfully");
  //     } else {
  //       alert("File upload failed");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const { socket } = useSocket();

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("data update", (data) => {
  //       console.log(data);
  //     });
  //   }
  // }, [socket]);

  // const { data } = useFetchWeatherData({
  //   page: 1,
  //   limit: 20,
  //   filter: "",
  //   sort: "desc",
  // });
  {
    /* <div className="p-16">
        <h1 className="text-center text-2xl font-bold text-white">
          Welcome to Dashboard
        </h1>

        <form action="/upload" method="POST" onSubmit={handleSubmit}>
          <input type="file" name="file" id="file" />
          <button type="submit">Upload</button>
        </form>

        {user ? (
          <div className="text-center">
            <div className="text-center">
              <p>Welcome, {user.username}!</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            <button onClick={() => logout()}>Logout</button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-red-500 text-center p-4">
              Please log in to see your information.
            </p>
            <a href="/login">login</a>
            <br />
            <a href="/register">Register</a>
          </div>
        )}
      </div> */
  }
  return (
    <div className="w-full  grid grid-cols-12 p-2 h-screen overflow-hidden ">
      <Sidebar className="col-span-3 bg-white" path={path} setPath={setPath} />
      <MainContent
        className="col-span-9 bg-blue-500"
        path={path}
        setPath={setPath}
      />
    </div>
  );
}
