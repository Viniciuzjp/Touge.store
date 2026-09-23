"use client";

import { useRef, useState } from "react";

const sources = ["/videos/videobmw.mp4", "/videos/video.mp4"];
const tickerItems = Array.from({ length: 8 }, () => "SIGA-NOS NAS REDES SOCIAIS");

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  function handleEnded() {
    setIndex((prev) => (prev + 1) % sources.length);
  }

  return (
    <section className="flex w-full flex-col aspect-[21/13] lg:aspect-[21/5] overflow-hidden bg-neutral-950">
      <div className="flex h-10 w-full shrink-0 items-center overflow-hidden border-b border-white/10 bg-black text-white">
        <div className="flex w-max shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-6 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={index} className="flex shrink-0 items-center gap-6">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                {item}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-red-600" />
            </span>
          ))}
        </div>
      </div>
      <video
        ref={videoRef}
        key={sources[index]}
        className="h-full w-full flex-1 object-cover"
        src={sources[index]}
        autoPlay
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onEnded={handleEnded}
      />
    </section>
  );
}
