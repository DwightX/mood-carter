// app/components/SignOutButton.js
"use client";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import "../../../firebaseConfig.js"; // Firebase config import


export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/auth/signIn"); // Redirect to sign-in after logout
    } catch (error) {
      alert("Error signing out: " + error.message);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
