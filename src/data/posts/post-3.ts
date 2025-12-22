import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post3: BlogPost = {
  id: 3,
  title: "Ljudi koji grade zajednicu",
  excerpt: "Upoznajte ljude koji čine srce našeg sela. Priče o pojedincima koji doprinose zajednici...",
  author: "Stefan Nikolić",
  date: "5. januar 2025",
  category: "Ljudi",
  imageUrl: slika777Url,
  imageSrcSet: slika777,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Seoska zajednica</h2><p>Srce svakog sela su njegovi ljudi. U Šebetu živi zajednica koja čuva tradiciju, ali i gradi budućnost kroz svoje svakodnevne aktivnosti i doprinos.</p><h2>Lokalni proizvođači</h2><p>Mnoge porodice se bave organskom proizvodnjom hrane, pčelarstvom i tradiconalnim zanatima. Njihovi proizvodi su poznati širom regiona po kvalitetu i autentičnosti.</p>'
    },
    {
      type: 'quote',
      quoteText: 'Sila zajednice je u pojedincu, a snaga pojedinca u zajednici.',
      quoteAuthor: 'Stara srpska poslovica'
    },
    {
      type: 'image',
      src: rimsko2Url,
      srcset: rimsko2,
      alt: 'Lokalni proizvođači',
      caption: 'Tradicionalni zanati i proizvodi'
    },
    {
      type: 'text',
      html: '<h2>Aktivisti i volonteri</h2><p>Mlađe generacije su pokrenule brojne inicijative za očuvanje životne sredine, obnovu starih kuća, i digitalizaciju seoskog arhiva.</p><p>Kroz volonterski rad u udruženjima i lokalnim akcijama, građani Šebeta pokazuju da zajedništvo i solidarnost nisu izgubljene vrednosti.</p>'
    }
  ],
};
