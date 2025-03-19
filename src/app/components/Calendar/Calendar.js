"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "../Modal/Modal";
import MoodSelector from "../MoodSelector/MoodSelector";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";

export default function Calendar({ moodData, setMoodData }) {
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Add mood to Firestore and update local moodData
  const handleAddEvent = async () => {
    if (text.trim() !== "" && selectedDate) {
      try {
        // Add to Firestore
        const docRef = await addDoc(collection(db, "moods"), {
          date: Timestamp.fromDate(selectedDate),
          mood: selectedMood || "Neutral",
          note: text,
        });

        console.log("Mood added successfully with ID: ", docRef.id);
        // Add new mood to local moodData
        const newMood = {
          id: docRef.id,
          date: Timestamp.fromDate(selectedDate).toDate(), // Correct conversion to JS Date
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
    title: `${mood.note || "No Note"} \n ${mood.date.toLocaleString()}`,
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
        height="auto"
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
