"use client";

import { useEffect, useState } from "react";

export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let progressValue = 0;
    let doneTimer: number | undefined;

    const tick = () => {
      progressValue = Math.min(100, progressValue + Math.max(1, (100 - progressValue) * 0.075));
      setProgress(Math.round(progressValue));

      if (progressValue < 100) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      doneTimer = window.setTimeout(() => {
        setVisible(false);
      }, 420);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="site-loader" aria-label="网站加载中">
      <div className="loader-progress-panel">
        <div className="loader-progress-head">
          <p>Portfolio loading</p>
          <span>{progress}</span>
        </div>
        <div
          className="loader-progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="loader-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader-progress-foot">
          <span>牛昕宇</span>
          <span>AIGC FILM</span>
        </div>
      </div>
    </div>
  );
}
