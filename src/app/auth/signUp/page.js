"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../../../../firebaseConfig.js"; // Firebase config import

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/auth/signIn"); // Redirect to sign-in after sign-up
    } catch (err) {
      alert("Sign up failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001029]">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Sign Up</h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border focus:outline-none bg-[#001029] text-white placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border focus:outline-none bg-[#001029] text-white placeholder-gray-400"
          />
          <button
            onClick={signUp}
            className="w-full bg-[#e3b23c] text-white py-3 rounded-lg hover:bg-yellow-500"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
