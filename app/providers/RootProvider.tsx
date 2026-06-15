"use client";

import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { AuthProvider } from "./AuthProvider";

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col p-8">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
