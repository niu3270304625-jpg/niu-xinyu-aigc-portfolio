"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_VOLUME = 0.075;

export function AmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const shouldResumeRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const start = async () => {
      audio.volume = DEFAULT_VOLUME;

      try {
        await audio.play();
        shouldResumeRef.current = true;
        setEnabled(true);
        return true;
      } catch {
        return false;
      }
    };

    void start();

    const startAfterGesture = () => {
      void start().then((played) => {
        if (played) {
          window.removeEventListener("pointerdown", startAfterGesture);
          window.removeEventListener("keydown", startAfterGesture);
          window.removeEventListener("scroll", startAfterGesture);
        }
      });
    };

    window.addEventListener("pointerdown", startAfterGesture, { once: false });
    window.addEventListener("keydown", startAfterGesture, { once: false });
    window.addEventListener("scroll", startAfterGesture, { once: false });

    return () => {
      window.removeEventListener("pointerdown", startAfterGesture);
      window.removeEventListener("keydown", startAfterGesture);
      window.removeEventListener("scroll", startAfterGesture);
    };
  }, []);

  useEffect(() => {
    const handleVideoPlay = () => {
      const audio = audioRef.current;
      if (!audio) return;

      shouldResumeRef.current = enabled || !audio.paused;
      audio.pause();
      setEnabled(false);
    };

    const handleVideoIdle = () => {
      const audio = audioRef.current;
      if (!audio || !shouldResumeRef.current) return;

      audio.volume = DEFAULT_VOLUME;
      void audio.play().then(() => {
        setEnabled(true);
      });
    };

    window.addEventListener("portfolio-video-play", handleVideoPlay);
    window.addEventListener("portfolio-video-idle", handleVideoIdle);

    return () => {
      window.removeEventListener("portfolio-video-play", handleVideoPlay);
      window.removeEventListener("portfolio-video-idle", handleVideoIdle);
    };
  }, [enabled]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      audio.pause();
      shouldResumeRef.current = false;
      setEnabled(false);
      return;
    }

    audio.volume = DEFAULT_VOLUME;
    await audio.play();
    shouldResumeRef.current = true;
    setEnabled(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio ref={audioRef} src="/audio/entotsu.mp3" loop preload="auto" />
      <button
        type="button"
        aria-label={enabled ? "关闭背景音乐" : "开启背景音乐"}
        aria-pressed={enabled}
        className="group flex h-14 items-center gap-3 rounded-full border border-[#24452d]/12 bg-[#fbfcf2]/86 px-4 text-[#172719] shadow-[0_18px_54px_rgba(36,69,45,0.14)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white"
        onClick={() => {
          void toggle();
        }}
      >
        <span
          className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-[#24452d]/20 ${
            enabled ? "bg-[#24452d] text-[#fbfcf2]" : "bg-white text-[#172719]"
          }`}
        >
          <span className="sound-mark" data-playing={enabled} />
        </span>
        <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] sm:block">
          {enabled ? "Ambience" : "Sound"}
        </span>
      </button>
    </div>
  );
}
