"use client";

import { useContext } from "react";
import { ModalManagerContext } from "@/context/ModalManagerContext";

export function useGoogleSheetsModal() {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error(
      "useGoogleSheetsModal must be used within a <ModalManagerProvider>"
    );
  }
  return context;
}
