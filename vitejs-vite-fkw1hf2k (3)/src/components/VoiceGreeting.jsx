import { useEffect, useRef } from "react";

export default function VoiceGreeting({ trigger }) {
  const hasSpokenRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!trigger || hasSpokenRef.current) return;
    hasSpokenRef.current = true;

    const playCustomAudio = () => {
      return new Promise((resolve, reject) => {
        if (!audioRef.current) {
          reject("Audio element missing");
          return;
        }

        audioRef.current.volume = 1;
        audioRef.current.currentTime = 0;

        const onEnded = () => {
          cleanup();
          resolve();
        };
        const onError = (e) => {
          cleanup();
          reject(e);
        };
        const cleanup = () => {
          audioRef.current.removeEventListener("ended", onEnded);
          audioRef.current.removeEventListener("error", onError);
        };

        audioRef.current.addEventListener("ended", onEnded);
        audioRef.current.addEventListener("error", onError);
        audioRef.current.play().catch(reject);
      });
    };

    const speakFallback = () => {
      const voices = speechSynthesis.getVoices();
      const preferred = localStorage.getItem("preferredVoice");
      const voice = voices.find((v) => v.name === preferred) || voices[0];

      const part1 = new SpeechSynthesisUtterance("Welcome back,");
      part1.voice = voice;
      part1.rate = 0.85;
      part1.pitch = 1.0;

      const part2 = new SpeechSynthesisUtterance("Commander.");
      part2.voice = voice;
      part2.rate = 0.9;
      part2.pitch = 1.3;

      part1.onend = () => {
        speechSynthesis.speak(part2);
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(part1);
    };

    // Delay so startup sounds don’t overlap
    setTimeout(() => {
      playCustomAudio().catch(() => {
        speakFallback();
      });
    }, 2000);
  }, [trigger]);

  return <audio ref={audioRef} src="/sounds/welcome.mp3" preload="auto" />;
}
