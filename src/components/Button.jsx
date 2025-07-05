import clsx from "clsx";
import { useRef, useEffect } from "react";

const Button = ({ id, title, rightIcon, leftIcon, containerClass }) => {
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Create a simple tick sound using Web Audio API as fallback
    const createTickSound = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.log("Web Audio API not supported");
      }
    };

    // Store the function for later use
    buttonRef.current.createTickSound = createTickSound;
  }, []);

  const handleMouseEnter = () => {
    // Try to play audio file first, fallback to generated sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // If audio file fails, use generated tick sound
        if (buttonRef.current && buttonRef.current.createTickSound) {
          buttonRef.current.createTickSound();
        }
      });
    } else if (buttonRef.current && buttonRef.current.createTickSound) {
      buttonRef.current.createTickSound();
    }
  };

  return (
    <button
      ref={buttonRef}
      id={id}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black transition-all duration-300 ease-out hover:bg-yellow-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-300/25 active:scale-95",
        containerClass
      )}
      onMouseEnter={handleMouseEnter}
    >
      {/* Hidden audio element for tick sound - will fallback to generated sound if file not found */}
      <audio
        ref={audioRef}
        preload="auto"
        volume={0.2}
        style={{ display: 'none' }}
      >
        <source src="/audio/tick.mp3" type="audio/mpeg" />
        <source src="/audio/tick.wav" type="audio/wav" />
      </audio>

      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase transition-colors duration-300 group-hover:text-black">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-0 transition-opacity duration-300 group-hover:opacity-30 blur-sm"></div>
      
      {/* Subtle border highlight */}
      <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-0 transition-opacity duration-300 group-hover:opacity-60"></div>
    </button>
  );
};

export default Button;
