// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "../../../firebaseConfig"; // Import Firebase config

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth/signIn"); // Redirect if not authenticated
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Sign out function
  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/auth/signIn"); // Redirect after sign out
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#001029]">
        <h1 className="text-3xl text-white">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001029]">
      <div className="text-center space-y-6">
        <h1 className="text-4xl text-white">Welcome to your Dashboard!</h1>
        <button
          onClick={handleSignOut}
          className="bg-[#e3b23c] text-white py-3 px-6 rounded-lg hover:bg-yellow-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
