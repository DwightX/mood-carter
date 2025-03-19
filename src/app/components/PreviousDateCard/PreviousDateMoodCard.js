"use client";
// import "./TodayMoodCard.css";

export default function PreviousDateCard({ mood, date, note }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-bold">Yesterday's Mood</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="card-body">
        <p className="mood-icon text-4xl">{mood}</p>
        <p className="text-sm mt-2">{note}</p>
      </div>
    </div>
  );
}
