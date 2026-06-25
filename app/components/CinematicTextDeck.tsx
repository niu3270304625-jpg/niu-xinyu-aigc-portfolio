"use client";

import { useEffect, useState } from "react";

const statements = [
  "Story as system",
  "Character continuity",
  "Image production",
  "AIGC cinema craft",
];

const words = ["故事", "角色", "镜头", "秩序"];

export function CinematicTextDeck() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % statements.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="cinematic-text-deck" aria-label="影视创作关键词">
      <p className="cinematic-kicker">Current Focus</p>
      <div className="cinematic-statement" aria-live="polite">
        {statements[active]}
      </div>
      <div className="cinematic-word-row">
        {words.map((word, index) => (
          <button
            key={word}
            type="button"
            className="cinematic-word"
            data-active={index === active % words.length}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
