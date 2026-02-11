"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-[72px]">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}

export default Layout;
