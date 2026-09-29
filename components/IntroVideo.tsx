"use client";

import { useState, useRef } from "react";

interface IntroVideoProps {
  onFinish: () => void;
}

export default function IntroVideo({ onFinish }: IntroVideoProps) {
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      onFinish();
    }, 1000);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Video de fondo */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={handleFinish}
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-70"
      >
        <source src="/videos/pokemon-intro.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 z-[1] bg-black/50" />

      {/* Botón de audio (arriba a la derecha) */}
      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-all hover:bg-black/80 hover:scale-110"
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? (
          // Ícono de muteado
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // Ícono con sonido
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>

      {/* Contenido */}
      <div className="relative z-10 px-6 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow-2xl md:text-6xl">
          ¿Quieres volver a recordar tu infancia?
        </h1>
        <p className="mb-8 text-xl text-stone-100 drop-shadow-lg md:text-2xl">
          Explora la <span className="font-bold text-red-500">Pokédex</span> completa
        </p>

        <button
          onClick={handleFinish}
          className="rounded-full bg-red-600 px-8 py-3 font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:bg-red-500"
        >
          Explorar ahora
        </button>
      </div>
    </div>
  );
}