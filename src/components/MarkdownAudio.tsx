import React, { useState, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

interface AudioProps {
  src: string;
  title?: string;
}

const MarkdownAudio: React.FC<AudioProps> = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getAudioMimeType = (src: string): string => {
    if (src.includes(".mp3")) return "audio/mpeg";
    if (src.includes(".wav")) return "audio/wav";
    if (src.includes(".ogg")) return "audio/ogg";
    if (src.includes(".m4a")) return "audio/mp4";
    if (src.includes(".aac")) return "audio/aac";
    if (src.includes(".flac")) return "audio/flac";
    return "audio/mpeg";
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src={src} type={getAudioMimeType(src)} />
        Vaš pregledač ne podržava audio tag.
      </audio>

      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-105 shadow-md"
            aria-label={isPlaying ? "Pauziraj" : "Pusti"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Progress and Info */}
          <div className="flex-1">
            {title && (
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground truncate">
                  {title}
                </span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 rounded-full appearance-none bg-muted cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) ${(currentTime / duration) * 100 || 0}%, hsl(var(--muted)) ${(currentTime / duration) * 100 || 0}%)`,
                }}
              />
              <span className="text-xs text-muted-foreground w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownAudio;
