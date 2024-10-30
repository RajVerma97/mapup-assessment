import { HomeIcon, LogInIcon, LogOut, User } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/app/hooks/use-user";
import { useLogout } from "@/app/hooks/use-logout";

interface SidebarProps {
  className?: string;
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
}

interface SidebarLinkProps {
  name: string;
  path: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink = ({ name, path, children, onClick }: SidebarLinkProps) => (
  <Link
    href={onClick ? "#" : path}
    className="flex items-center gap-2 hover:scale-110 transition-all"
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
  >
    {children}
    <span
      className={`text-black hover:text-purple-500 ${
        name === "Logout" ? "text-red-500" : ""
      }`}
    >
      {name}
    </span>
  </Link>
);

export default function Sidebar({ className, setPath }: SidebarProps) {
  const user = useUser();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };
  const sideBarLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <HomeIcon className="text-black" />,
    },
  ];

  if (user) {
    sideBarLinks.push({
      name: "Logout",
      path: "",
      icon: <LogOut className="text-red-500" />,
    });
  }

  if (!user) {
    sideBarLinks.push(
      {
        name: "Register",
        path: "/register",
        icon: <User className="text-black" />,
      },
      {
        name: "Login",
        path: "/login",
        icon: <LogInIcon className="text-black" />,
      }
    );
  }
  const userProfileTypeImages: Record<string, string> = {
    ADMIN:
      "https://img.freepik.com/free-vector/admin-concept-illustration_114360-2139.jpg?uid=R80559136&semt=ais_hybrid",
    MANAGER:
      "https://img.freepik.com/premium-vector/man-sits-desk-with-laptop-plant-it_704913-30606.jpg?uid=R80559136&semt=ais_hybrid",
    USER: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?uid=R80559136&semt=ais_hybrid",
    DEFAULT:
      "https://img.freepik.com/free-vector/no-people-sign_78370-7014.jpg?uid=R80559136&semt=ais_hybrid",
  };

  //@ts-expect-error remove
  const UserSrcImage = userProfileTypeImages[user?.role]
    ? //@ts-expect-error remove
      userProfileTypeImages[user?.role]
    : userProfileTypeImages.DEFAULT;

  return (
    <div className={`w-full h-full ${className} p-8 bg-white `}>
      <div>
        <div className="w-full flex flex-col justify-center gap-4 items-center border-blue-500 p-2">
          <Image
            src={UserSrcImage}
            alt="user-image"
            width={100}
            height={100}
            className="aspect-square object-cover rounded-full"
          />
          <h1 className="text-2xl  text-black">
            {/* @ts-expect-error remove */}
            {user ? user?.username : "No User"}
          </h1>
          <h4 className="text-xl  text-black">
            {/* @ts-expect-error remove */}
            {user ? user?.role.toUpperCase() : "No Role"}
          </h4>
        </div>

        <div className="flex flex-col gap-6 p-2 mt-10">
          {sideBarLinks.map((link) => (
            <SidebarLink
              key={link.name}
              path={link.path}
              name={link.name}
              onClick={
                link.name === "Logout" ? handleLogout : () => setPath(link.path)
              }
            >
              {link.icon}
            </SidebarLink>
          ))}
        </div>
      </div>
    </div>
  );
}
