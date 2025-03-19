"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "../../../../firebaseConfig.js"; // Firebase config import

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const auth = getAuth();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Update the user's display name after creating the account
      await updateProfile(user, {
        displayName: name, // Set the name as displayName
      });
  
      console.log("User registered with display name:", user.displayName);
      router.push("/auth/signIn"); // Redirect after successful sign-up
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
            type="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border focus:outline-none bg-[#001029] text-white placeholder-gray-400"
          />
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
