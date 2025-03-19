"use client";
// import "./TodayMoodCard.css";

export default function PreviousDateCard({ mood, date, note }) {
  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
  {/* Header Section */}
  <div className="bg-blue-500 h-24"></div>

  {/* Mood Icon (Emoji) */}
  <div className="flex justify-center -mt-12">
    <div className="mood-icon w-24 h-24 flex items-center justify-center bg-white border-4 border-white rounded-full text-4xl">
      {mood} {/* Replace with dynamic mood emoji */}
    </div>
  </div>

  {/* Card Header */}
  <div className="text-center mt-2">
    <h3 className="text-lg font-bold">Yesterday's Mood</h3>
    <p className="text-sm text-gray-500">{date}</p>
  </div>

  {/* Card Body */}
  <div className="card-body text-center mt-2 px-4 pb-4">
    <p className="text-sm">{note}</p>
  </div>
</div>

  );
}
