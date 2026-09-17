"use client";

import { useRef, useState } from "react";

const sources = ["/videos/videobmw.mp4", "/videos/video.mp4"];

export default function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  function handleEnded() {
    setIndex((prev) => (prev + 1) % sources.length);
  }

  return (
    <section className="w-full aspect-[21/13] lg:aspect-[21/5] overflow-hidden bg-neutral-950">
      <video
        ref={videoRef}
        key={sources[index]}
        className="h-full w-full object-cover"
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
