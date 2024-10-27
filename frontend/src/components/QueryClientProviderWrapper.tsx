"use client";

import queryClient from "@/lib/queryClient";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";

const QueryClientProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;
