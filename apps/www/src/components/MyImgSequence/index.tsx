"use client";

import { ImgSequence } from "@chipsa-ui/core";
import { useEffect, useRef } from "react";

export const MyImgSequence = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const imgSequence = new ImgSequence({
      canvas: canvasRef.current,
      debug: true,
      playback: {
        minFrameIdx: 100,
        maxFrameIdx: 300,
        fps: 60,
        loop: true,
        reverse: true,
      },
      render: {
        objectFit: "contain",
        objectPosition: ["center", "center"],
        shouldClear: true,
      },
      loader: {
        strategy: "lazy",
        framesLoadingRange: 30,
        framesCount: 354,
        getFrameUrl: (idx: number) => {
          return `/img/sequence/image-${String(idx + 1).padStart(3, "0")}.webp`;
        },
        onReady() {
          imgSequence.render({ fallbackToClosestFrame: true });
          imgSequence.play();
        },
        onFullyLoaded() {
          console.log("All frames fully loaded!");
        },
      },
    });

    return () => {
      imgSequence.destroy();
    };
  }, []);

  return (
    <canvas
      className="w-full h-full border-2 border-border rounded-lg shadow-lg bg-card"
      ref={canvasRef}
    />
  );
};

export default MyImgSequence;
