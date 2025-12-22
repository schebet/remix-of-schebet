// Helper type for vite-imagetools output
export interface ImageOutput {
  src: string;
  width: number;
}

// Generate srcset string from array of images
export const generateSrcSet = (images: ImageOutput[]): string => {
  return images
    .map((img) => `${img.src} ${img.width}w`)
    .join(', ');
};

// Default sizes for responsive images
export const getDefaultSizes = () => {
  return '(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px';
};

export const getHeroSizes = () => {
  return '100vw';
};

export const getBlogCardSizes = () => {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px';
};

export const getGallerySizes = () => {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 300px';
};
