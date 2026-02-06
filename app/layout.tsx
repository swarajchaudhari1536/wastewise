import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intelligent Urban Waste Monitoring System",
  description: "Smart waste management and recycling monitoring platform for sustainable cities",
  keywords: ["waste management", "recycling", "smart city", "IoT", "sustainability"],
  authors: [{ name: "Omkar" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}