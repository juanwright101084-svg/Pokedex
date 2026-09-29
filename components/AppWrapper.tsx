"use client";

import { useState, useEffect } from "react";
import IntroVideo from "./IntroVideo";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
    setIsLoading(false);
  }, []);

  const handleFinishIntro = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  if (isLoading) return null;

  return (
    <>
      {showIntro && <IntroVideo onFinish={handleFinishIntro} />}
      {children}
    </>
  );
}