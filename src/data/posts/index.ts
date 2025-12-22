import type { BlogPost } from '../blogPosts';

// 🚀 Automatsko učitavanje svih blog postova koristeći Vite's import.meta.glob()
// Ovo će automatski učitati SVE .ts fajlove iz ovog foldera
const postModules = import.meta.glob<{ [key: string]: BlogPost }>('./*.ts', { eager: true });

// Ekstraktuj sve postove iz modula
const loadedPosts: BlogPost[] = [];

for (const path in postModules) {
  // Preskoči index.ts fajl
  if (path === './index.ts') continue;
  
  const module = postModules[path];
  
  // Pronađi export koji je tipa BlogPost (bilo koji export)
  for (const key in module) {
    const exported = module[key];
    // Proveri da li ima potrebne properties za BlogPost
    if (exported && typeof exported === 'object' && 'id' in exported && 'title' in exported) {
      loadedPosts.push(exported as BlogPost);
      break; // Uzmi samo prvi export iz svakog fajla
    }
  }
}

// Sortiraj po ID-u opadajuće (najnoviji prvi)
export const allPosts: BlogPost[] = loadedPosts.sort((a, b) => b.id - a.id);
