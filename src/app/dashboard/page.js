// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import "../../../firebaseConfig"; // Import Firebase config
import { db } from "../../../firebaseConfig"; // Correctly import db
import Calendar from "../components/Calendar/Calendar";
import TodayMoodCard from "../components/TodayMoodCard/TodayMoodCard";
import PreviousDateMoodCard from "../components/PreviousDateCard/PreviousDateMoodCard";
import QuoteCard from "../components/QuoteCard/QuoteCard";
import "./dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const router = useRouter();

  // Check authentication status
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

  // Fetch mood data from Firestore
  useEffect(() => {
    if (user) {
      const fetchMoods = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "moods"));
          const moodEvents = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              date: data.date?.toDate?.() || new Date(data.date), // Safely convert Firestore date
              mood: data.mood || "Neutral",
              note: data.note || "",
            };
          });
          setMoodData(moodEvents);
        } catch (error) {
          console.error("Error fetching moods:", error);
        }
      };

      fetchMoods();
    }
  }, [user]);


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
    <div className="">
      <div className="card-container">
        <div className="card-row">
          {moodData.length > 0 ? (
            moodData
              .filter((mood) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset to start of the day
                const moodDate = new Date(mood.date);
                moodDate.setHours(0, 0, 0, 0); // Reset mood date to start of the day
                return moodDate.getTime() === today.getTime();
              })
              .slice(0, 1) // Only render one card
              .map((mood) => (
                <TodayMoodCard
                  key={mood.id}
                  mood={mood.mood}
                  date={mood.date.toDateString()}
                  note={mood.note}
                />
              ))
          ) : (
            <h1 className="text-2xl text-white">No mood data for today.</h1>
          )}
          {moodData.length > 0 ? (
            moodData
              .filter((mood) => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1); // Get previous day
                yesterday.setHours(0, 0, 0, 0); // Reset to start of the day
                const moodDate = new Date(mood.date);
                moodDate.setHours(0, 0, 0, 0); // Reset mood date to start of the day
                return moodDate.getTime() === yesterday.getTime();
              })
              .slice(0, 1) // Only render one card
              .map((mood) => (
                <PreviousDateMoodCard
                  key={mood.id}
                  mood={mood.mood}
                  date={mood.date.toDateString()}
                  note={mood.note}
                />
              ))
          ) : (
            <h1 className="text-2xl text-white">No mood data for previous day.</h1>
          )}
          <QuoteCard />
        </div>
      </div>
      <div className="row">
        {/* Pass moodData and setMoodData to Calendar */}
        <Calendar moodData={moodData} setMoodData={setMoodData} />
      </div>
    </div>
  );  
}
