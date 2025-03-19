"use client"

import React, { useState } from "react";

const moods = [
    { emoji: "😃", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😎", label: "Cool" },
    { emoji: "🤔", label: "Thinking" },
    { emoji: "😌", label: "Relaxed" },
    { emoji: "🥰", label: "Loved" },
    { emoji: "🤯", label: "Mind Blown" },
    { emoji: "🤗", label: "Excited" },
  ];

  export default function MoodSelector({ onSelect }) {
    const [selectedMood, setSelectedMood] = useState(null);

    const handleMoodClick = (mood) => {
      setSelectedMood(mood.label);
      onSelect(mood.emoji);
    }

    return (
        <div className="flex flex-wrap justify-center gap-3 p-4 bg-white rounded-lg shadow-md">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodClick(mood)}
              className={`text-3xl p-2 border-2 rounded-lg hover:bg-gray-100 ${
                selectedMood === mood.label
                  ? "border-[#e3b23c] bg-yellow-100"
                  : "border-gray-300"
              }`}
            >
              {mood.emoji}
            </button>
          ))}
          {selectedMood && (
            <p className="mt-4 text-lg font-bold text-[#001029]">
              Selected Mood: {selectedMood}
            </p>
          )}
        </div>
      );
  }