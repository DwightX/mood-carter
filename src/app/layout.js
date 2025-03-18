// app/layout.js
import Link from "next/link";
import "./globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#001029]">
        <nav className="bg-[#001029] p-4">
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signIn" className="text-white hover:text-yellow-400">
              Sign In
            </Link>
            <Link href="/auth/signUp" className="text-white hover:text-yellow-400">
              Sign Up
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
