import "./globals.css";
import { AxiosProvider } from "./hooks/use-axios-context";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryClientProviderWrapper>
        <AxiosProvider>
          <body>{children}</body>
        </AxiosProvider>
      </QueryClientProviderWrapper>
    </html>
  );
}
