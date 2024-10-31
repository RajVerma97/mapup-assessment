import { HomeIcon, LogInIcon, LogOut, User, X } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/app/hooks/use-user";
import { useLogout } from "@/app/hooks/use-logout";
import { useMediaQuery } from "react-responsive";

interface SidebarProps {
  className?: string;
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  handleToggleSidebar: () => void;
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
    className="flex items-center  text-lg md:text-md center hover:md:scale-105   gap-2  transition-all"
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

export default function Sidebar({
  className,
  setPath,
  handleToggleSidebar,
}: SidebarProps) {
  const user = useUser();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    if (isMobile) {
      handleToggleSidebar();
    }
  };
  const sideBarLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <HomeIcon className="  text-black" size={28} />,
    },
  ];

  if (user) {
    sideBarLinks.push({
      name: "Logout",
      path: "",
      icon: <LogOut className="text-red-500" size={28} />,
    });
  }

  if (!user) {
    sideBarLinks.push(
      {
        name: "Register",
        path: "/register",
        icon: <User className="text-black" size={28} />,
      },
      {
        name: "Login",
        path: "/login",
        icon: <LogInIcon className="text-black" size={28} />,
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

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className={`w-full h-full ${className} p-8 bg-white `}>
      <div>
        <div className="w-full flex flex-col justify-center gap-4 items-center border-blue-500 p-2">
          <button
            onClick={handleToggleSidebar}
            className=" text-black block md:hidden absolute top-0 right-0 p-8 hover:bg-gray-100 rounded-lg z-50"
          >
            <X className="h-12 w-12" />
          </button>
          <div className="relative w-full flex flex-col items-center gap-4 p-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative">
                <Image
                  src={UserSrcImage}
                  alt="user-image"
                  width={120}
                  height={120}
                  className="aspect-square object-cover rounded-full ring-4 ring-white shadow-lg transform group-hover:scale-105 transition duration-300"
                />
                {user && (
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 mt-2">
              <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
                {user ? (
                  <span className="relative">
                    <span className="relative z-10 hover:text-purple-600 transition-colors duration-300">
                      {user.username.toUpperCase()}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-full h-2 bg-purple-200 opacity-50 transform -skew-x-12"></span>
                  </span>
                ) : (
                  <span className="text-gray-500">No User</span>
                )}
              </h1>

              <div className="flex items-center gap-2">
                {user ? (
                  <span
                    className={`
          px-4 py-1 rounded-full text-sm font-semibold
          ${
            user.role.toUpperCase() === "ADMIN"
              ? "bg-purple-100 text-purple-700"
              : user.role.toUpperCase() === "MANAGER"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }
          transform hover:scale-105 transition-transform duration-300
        `}
                  >
                    {user.role.toUpperCase()}
                  </span>
                ) : (
                  <span className="px-4 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
                    No Role
                  </span>
                )}
              </div>
            </div>

            {/* Decorative Element */}
            {user && (
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 opacity-10">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full transform rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-12 md:gap-8 p-2 mt-10 w-full center">
          {sideBarLinks.map((link) => (
            <SidebarLink
              key={link.name}
              path={link.path}
              name={link.name}
              onClick={() => {
                if (link.name === "Logout") {
                  handleLogout();
                } else {
                  setPath(link.path);
                  if (isMobile) {
                    handleToggleSidebar();
                  }
                }
              }}
            >
              {link.icon}
            </SidebarLink>
          ))}
        </div>
      </div>
    </div>
  );
}
