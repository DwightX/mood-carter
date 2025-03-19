"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "../Modal/Modal";
import MoodSelector from "../MoodSelector/MoodSelector";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Calendar({ moodData, setMoodData }) {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [user, setUser] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Check authenticated user and set user state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserMoods(currentUser.email);
      } else {
        setUser(null);
        setMoodData([]); // Clear moodData if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch moods for the authenticated user
  const fetchUserMoods = async (userEmail) => {
    try {
      const q = query(collection(db, "moods"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const userMoods = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date.toDate(), // Convert Firestore timestamp to JS Date
          mood: data.mood || "Neutral",
          note: data.note || "",
        };
      });
      setMoodData(userMoods);
    } catch (error) {
      console.error("Error fetching user moods:", error);
    }
  };

  // Add mood to Firestore and update local moodData
  const handleAddEvent = async () => {
    if (text.trim() !== "" && selectedDate && user) {
      try {
        // Add to Firestore with user email
        const docRef = await addDoc(collection(db, "moods"), {
          date: Timestamp.fromDate(selectedDate),
          mood: selectedMood || "Neutral",
          note: text,
          email: user.email, // Add user's email for filtering
        });

        console.log("Mood added successfully with ID: ", docRef.id);
        // Add new mood to local moodData
        const newMood = {
          id: docRef.id,
          date: selectedDate, // Already JS Date
          mood: selectedMood || "Neutral",
          note: text,
        };
        // Update moodData locally
        setMoodData((prevMoods) => [...prevMoods, newMood]);

        // Reset state after submission
        setIsOpen(false);
        setText("");
        setSelectedMood("");
      } catch (error) {
        console.error("Error adding mood: ", error);
      }
    }
  };

  // Handle date click to open modal
  const handleDateClick = (info) => {
    const clickedDate = new Date(info.date); // Get clicked date
    const now = new Date(); // Get current time

    // Set current time to the clicked date
    clickedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    setSelectedDate(clickedDate);
    setIsOpen(true);
    console.log("Date clicked with time:", clickedDate.toISOString());
  };

  // Prepare events for FullCalendar
  const events = moodData.map((mood) => ({
    id: mood.id,
    title: `${mood.mood} - ${mood.note || "No Note"}`,
    start: mood.date.toISOString(),
    allDay: true,
    extendedProps: {
      mood: mood.mood || "Neutral",
      note: mood.note || "",
    },
  }));

  return (
    <div className="p-5 bg-white shadow-lg rounded-lg">
      {/* FullCalendar with date click to open modal */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="500px"
        width="500px"
      />

      {/* Modal to add mood */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-lg font-bold mb-4">
          Add Mood for{" "}
          {selectedDate
            ? `${selectedDate.toLocaleDateString()} at ${selectedDate.toLocaleTimeString()}`
            : ""}
        </h2>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Enter a note (optional)"
          className="w-full p-2 border rounded mb-4"
        />
        <MoodSelector onSelect={(mood) => setSelectedMood(mood)} />
        <button
          onClick={handleAddEvent}
          className="bg-[#e3b23c] text-white px-4 py-2 rounded hover:bg-yellow-500"
        >
          Add Mood
        </button>
      </Modal>
    </div>
  );
}
