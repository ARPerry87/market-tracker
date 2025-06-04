import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function NewsMarquee() {
  const [headlines, setHeadlines] = useState(["Loading news..."]);

  useEffect(() => {
    axios.get(`https://finnhub.io/api/v1/news?category=general&token=${import.meta.env.VITE_FINNHUB_API_KEY}`)
      .then(res => {
        const titles = res.data.map(article => article.headline);
        setHeadlines(titles.slice(0, 15));
      })
      .catch(err => {
        console.error("Error fetching news:", err);
      });
  }, []);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="animate-marquee text-yellow-300">
        {headlines.map((title, index) => (
          <span key={index} className="mr-8">{title}</span>
        ))}
      </div>
    </div>
  );
}
