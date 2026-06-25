"use client";

import { useRef, useState } from "react";

type Work = {
  title: string;
  label: string;
  src: string;
  poster: string;
  orientation: string;
  summary: string;
};

type WorkGalleryProps = {
  works: Work[];
};

function videoClass(orientation: string, featured = false) {
  if (orientation === "portrait") {
    return featured
      ? "mx-auto aspect-[9/16] max-h-[78vh] w-full max-w-[420px] bg-black object-contain"
      : "mx-auto aspect-[9/16] max-h-[620px] w-full max-w-[360px] bg-black object-contain";
  }

  return featured
    ? "aspect-video w-full bg-black object-contain"
    : "aspect-video w-full bg-black object-contain";
}

export function WorkGallery({ works }: WorkGalleryProps) {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [startedIndexes, setStartedIndexes] = useState<Set<number>>(
    () => new Set(),
  );

  const pauseOthers = (index: number) => {
    videoRefs.current.forEach((video, videoIndex) => {
      if (video && videoIndex !== index) {
        video.pause();
      }
    });
  };

  const notifyAudioState = (playing: boolean) => {
    window.dispatchEvent(
      new CustomEvent(playing ? "portfolio-video-play" : "portfolio-video-idle"),
    );
  };

  const handlePlay = async (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    pauseOthers(index);
    setStartedIndexes((current) => new Set(current).add(index));
    setActiveIndex(index);
    try {
      await video.play();
    } catch {
      setActiveIndex(null);
    }
  };

  const handleNativePlay = (index: number) => {
    pauseOthers(index);
    setStartedIndexes((current) => new Set(current).add(index));
    setActiveIndex(index);
    notifyAudioState(true);
  };

  const handleStop = (index: number) => {
    setActiveIndex((current) => (current === index ? null : current));
    window.setTimeout(() => {
      const hasPlayingVideo = videoRefs.current.some(
        (video) => video && !video.paused && !video.ended,
      );
      if (!hasPlayingVideo) {
        notifyAudioState(false);
      }
    }, 80);
  };

  const renderVideo = (work: Work, index: number, featured = false) => {
    const isActive = activeIndex === index;
    const hasStarted = startedIndexes.has(index);

    return (
      <div
        className="work-video-frame group relative overflow-hidden bg-black shadow-[0_28px_80px_rgba(17,17,17,0.16)]"
        data-video-card
      >
        <video
          ref={(element) => {
            videoRefs.current[index] = element;
          }}
          className={videoClass(work.orientation, featured)}
          controls={hasStarted}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          preload="metadata"
          poster={work.poster}
          onContextMenu={(event) => event.preventDefault()}
          onPlay={() => handleNativePlay(index)}
          onPause={() => handleStop(index)}
          onEnded={() => handleStop(index)}
        >
          <source src={work.src} />
        </video>
        {!isActive && (
          <button
            type="button"
            aria-label={`播放 ${work.title}`}
            className="cinematic-play-button absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/78 text-[#172719] shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-md transition duration-300 before:absolute before:inset-[-10px] before:rounded-full before:border before:border-white/45 before:content-[''] hover:scale-105 hover:bg-white"
            onClick={() => {
              void handlePlay(index);
            }}
          >
            <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#172719]" />
          </button>
        )}
      </div>
    );
  };

  const [featured, ...gallery] = works;

  return (
    <>
      <article className="work-feature reveal-section">
        <div className="work-feature-media">{renderVideo(featured, 0, true)}</div>
        <div className="work-feature-copy">
          <p className="work-index">01 / Campaign Film</p>
          <p className="work-label">{featured.label}</p>
          <h3>{featured.title}</h3>
          <p>{featured.summary}</p>
        </div>
        <span className="work-feature-ghost" aria-hidden="true">
          SELECTED
        </span>
      </article>

      <div className="poster-grid mt-16">
        {gallery.map((work, galleryIndex) => {
          const index = galleryIndex + 1;

          return (
            <article
              key={work.title}
              className={`poster-card reveal-section ${
                work.orientation === "portrait" ? "poster-card-portrait" : ""
              }`}
            >
              <div className="poster-card-image">{renderVideo(work, index)}</div>
              <div className="poster-card-copy">
                <div className="poster-card-meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{work.orientation === "portrait" ? "9:16" : "16:9"}</span>
                </div>
                <p className="poster-card-label">{work.label}</p>
                <h3>{work.title}</h3>
                <p>{work.summary}</p>
              </div>
              <span className="poster-card-ghost" aria-hidden="true">
                NIU
              </span>
            </article>
          );
        })}
      </div>
    </>
  );
}
