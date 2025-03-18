"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../firebaseConfig.js"; // Import Firebase config

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard"); // Redirect to dashboard if authenticated
      } else {
        router.push("/auth/signIn"); // Redirect to signIn if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001029]">
      <h1 className="text-4xl text-white">Loading...</h1>
    </div>
  );
}
