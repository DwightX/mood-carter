"use client";

import { useEffect, useState } from "react";
import  "./QuoteCard.css";

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
    <div className="quote-card">
      <p className="">{quote.text}</p>
      <p className="text-sm text-gray-500">- {quote.author}</p>
    </div>
  );
}
