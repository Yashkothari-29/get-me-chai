"use client"; // Marks this as a Client Component

import { SessionProvider } from "next-auth/react"; // Importing the session provider
import { Children } from "react"; // This line is unnecessary, you can remove it

export default function SessionWrapper({ children }) {
  return (
    <SessionProvider>
      {children} {/* Corrected prop name */}
    </SessionProvider>
  );
}
