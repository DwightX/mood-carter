"use client";

import { useEffect, useState } from "react";
import "./QuoteCard.css";

export default function QuoteCard() {
  const [quote, setQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    fetch("https://thequoteshub.com/api/")
      .then((response) => response.json())
      .then((data) =>
        setQuote({
          text: data?.text || "No quote available.",
          author: data?.author || "Unknown",
        })
      )
      .catch((error) => console.error("Error fetching quote:", error));
  }, []);

  return (
<div className="quote-card bg-blue-500 text-white p-6 rounded-lg shadow-lg relative">
  {/* Quote Icon */}
  <div className="absolute top-4 left-4 text-6xl text-black opacity-70">
    <span className="font-serif leading-none">“</span>
  </div>

  {/* Quote Text */}
  <p className="quote-text text-white text-lg leading-relaxed pl-10">
    {quote.text}
  </p>

  {/* Quote Author */}
  <div className="flex justify-end mt-4">
    <p className="quote-author bg-black text-white text-sm px-4 py-1 rounded-lg">
      - {quote.author}
    </p>
  </div>
</div>

  );
}
