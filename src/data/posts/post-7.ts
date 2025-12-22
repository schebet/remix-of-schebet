import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko1 from "@/assets/photos/rimsko_1.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post7: BlogPost = {
  id: 7,
  title: "Šablon",
  excerpt: "Ovo je početni blog post koji služi kao šablon. Kopirajte i prilagodite sadržaj prema vašim potrebama...",
  author: "Admin",
  date: "25. novembar 2025",
  category: "Kultura",
  imageUrl: slika777Url,
  imageSrcSet: slika777,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Uvod</h2><p>Ovo je primer uvodnog teksta. Ovde možete opisati temu blog posta. Tekst može biti kratak ili detaljan, zavisno od vaših potreba.</p><p>Možete dodati više paragrafa i oblikovati tekst HTML tagovima kao što su <strong>bold</strong>, <em>italic</em>, ili <u>underline</u>.</p>'
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777,
      alt: 'Primer slike',
      caption: 'Opis ispod slike - dodajte detalje o slici'
    },
    {
      type: 'text',
      html: '<h2>Osnovna sekcija sa tekstom</h2><p>Nastavite sa tekstom nakon slike. Možete dodavati više sekcija sa naslovima i paragrafima.</p><ul><li>Lista sa tačkama</li><li>Druga stavka liste</li><li>Treća stavka</li></ul><p>Možete koristiti i numerisane liste:</p><ol><li>Prva stavka</li><li>Druga stavka</li><li>Treća stavka</li></ol>'
    },
    {
      type: 'quote',
      quoteText: 'Ovo je primer inspirativnog citata. Koristite citate da naglasite važne misli ili izjave relevantne za temu.',
      quoteAuthor: 'Ime autora citata'
    },
    {
      type: 'text',
      html: '<h2>Dodatna slika sa opisom</h2><p>Možete dodati više slika kroz post. Svaka slika može imati svoj caption koji pruža dodatni kontekst.</p>'
    },
    {
      type: 'image',
      src: rimsko1Url,
      srcset: rimsko1,
      alt: 'Druga primer slika',
      caption: 'Svaka slika može imati jedinstven opis'
    },
    {
      type: 'text',
      html: '<h2>Zaključak</h2><p>Završite post sa zaključkom ili pozivom na akciju.</p>'
    }
  ],
};
