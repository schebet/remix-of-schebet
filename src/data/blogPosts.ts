// This file now imports blog posts from separate TypeScript files
// All blog posts are stored in src/data/posts/ as individual .ts files

export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'quote';
  html?: string;
  src?: string;
  srcset?: string;
  alt?: string;
  caption?: string;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo';
  quoteText?: string;
  quoteAuthor?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  imageSrcSet: string;
  ogImage: string;
  content: ContentBlock[];
}

// Import blog posts from posts folder
import { allPosts } from './posts';

// Export the loaded posts
export const blogPosts: BlogPost[] = allPosts;

// Helper function to get category colors
export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Istorija": "bg-category-history/10 text-category-history border-category-history/20",
    "Kultura": "bg-category-culture/10 text-category-culture border-category-culture/20",
    "Ljudi": "bg-category-people/10 text-category-people border-category-people/20",
    "Priroda": "bg-category-nature/10 text-category-nature border-category-nature/20",
    "Gastronomija": "bg-category-gastronomy/10 text-category-gastronomy border-category-gastronomy/20",
    "Arhitektura": "bg-category-architecture/10 text-category-architecture border-category-architecture/20",
  };
  return colors[category] || "bg-primary/10 text-primary border-primary/20";
};
