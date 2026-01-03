import React from "react";

interface VideoProps {
  src: string;
  title?: string;
  poster?: string;
}

const MarkdownVideo: React.FC<VideoProps> = ({ src, title, poster }) => {
  // Detect if it's a YouTube or Vimeo embed
  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  const isVimeo = src.includes("vimeo.com");

  if (isYouTube) {
    const videoId = extractYouTubeId(src);
    if (videoId) {
      return (
        <div className="my-6 rounded-lg overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
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
  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-lg bg-black">
      <video
        controls
        className="w-full max-h-[500px]"
        poster={poster}
        preload="metadata"
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
