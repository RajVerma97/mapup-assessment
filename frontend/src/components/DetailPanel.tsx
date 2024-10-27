import React from "react";

interface DetailPanelProps {
  className?: string;
}
export default function DetailPanel({ className }: DetailPanelProps) {
  return <div className={` w-full h-ful ${className}`}>DetailPanel</div>;
}
