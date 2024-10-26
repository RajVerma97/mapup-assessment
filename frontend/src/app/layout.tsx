import SocketProvider from "@/utils/SocketContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
