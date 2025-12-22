/// <reference types="vite/client" />
/// <reference types="vite-imagetools/client" />

// Standard image imports
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.JPG' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

// Catch-all for any image with query parameters (vite-imagetools)
declare module '*jpg?*' {
  const value: any;
  export default value;
}

declare module '*JPG?*' {
  const value: any;
  export default value;
}

declare module '*jpeg?*' {
  const value: any;
  export default value;
}

declare module '*png?*' {
  const value: any;
  export default value;
}

declare module '*webp?*' {
  const value: any;
  export default value;
}

declare module '*svg?*' {
  const value: any;
  export default value;
}
