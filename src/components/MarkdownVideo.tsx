import React, { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface VideoProps {
  src: string;
  title?: string;
  poster?: string;
}

const MarkdownVideo: React.FC<VideoProps> = ({ src, title, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoThumbnail, setAutoThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect if it's a YouTube or Vimeo embed
  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  const isVimeo = src.includes("vimeo.com");

  // Extract YouTube thumbnail
  useEffect(() => {
    if (isYouTube && !poster) {
      const videoId = extractYouTubeId(src);
      if (videoId) {
        setAutoThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      }
    }
  }, [src, isYouTube, poster]);

  // Generate thumbnail from video for MP4 files
  useEffect(() => {
    if (!isYouTube && !isVimeo && !poster && !autoThumbnail) {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = src;
      video.muted = true;
      video.preload = 'metadata';
      
      video.addEventListener('loadeddata', () => {
        video.currentTime = 1; // Seek to 1 second
      });
      
      video.addEventListener('seeked', () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
            setAutoThumbnail(thumbnail);
          }
        } catch (e) {
          // CORS or other error - just don't show thumbnail
          console.log('Could not generate thumbnail:', e);
        }
      });
    }
  }, [src, isYouTube, isVimeo, poster, autoThumbnail]);

  const thumbnailUrl = poster || autoThumbnail;

  if (isYouTube) {
    const videoId = extractYouTubeId(src);
    if (videoId) {
      if (!isPlaying && thumbnailUrl) {
        return (
          <div className="my-6 rounded-lg overflow-hidden shadow-lg">
            <div 
              className="relative cursor-pointer group"
              onClick={() => setIsPlaying(true)}
            >
              <img 
                src={thumbnailUrl}
                alt={title || "YouTube video thumbnail"}
                className="w-full aspect-video object-cover"
                onError={(e) => {
                  // Fallback to hqdefault if maxres doesn't exist
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" fill="currentColor" />
                </div>
              </div>
              {title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{title}</p>
                </div>
              )}
            </div>
          </div>
        );
      }
      
      return (
        <div className="my-6 rounded-lg overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title || "YouTube video"}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
  }

  if (isVimeo) {
    const videoId = extractVimeoId(src);
    if (videoId) {
      return (
        <div className="my-6 rounded-lg overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}`}
              title={title || "Vimeo video"}
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }
  }

  // Default: HTML5 video player for MP4 and other video files
  if (!isPlaying && thumbnailUrl) {
    return (
      <div className="my-6 rounded-lg overflow-hidden shadow-lg bg-black">
        <div 
          className="relative cursor-pointer group"
          onClick={() => {
            setIsPlaying(true);
            setTimeout(() => {
              videoRef.current?.play();
            }, 100);
          }}
        >
          <img 
            src={thumbnailUrl}
            alt={title || "Video thumbnail"}
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all group-hover:scale-110 shadow-lg">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm font-medium">{title}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        controls
        className="w-full max-h-[500px]"
        poster={thumbnailUrl || undefined}
        preload="metadata"
        autoPlay={isPlaying}
      >
        <source src={src} type={getVideoMimeType(src)} />
        Vaš pregledač ne podržava video tag.
      </video>
      {title && (
        <p className="text-sm text-muted-foreground text-center py-2 bg-muted">
          {title}
        </p>
      )}
    </div>
  );
};

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

function extractVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function getVideoMimeType(src: string): string {
  if (src.includes(".mp4")) return "video/mp4";
  if (src.includes(".webm")) return "video/webm";
  if (src.includes(".ogg") || src.includes(".ogv")) return "video/ogg";
  if (src.includes(".mov")) return "video/quicktime";
  return "video/mp4";
}

export default MarkdownVideo;
