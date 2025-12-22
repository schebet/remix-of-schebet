import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko1 from "@/assets/photos/rimsko_1.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const testPost: BlogPost = {
  id: 9,
  title: "Test - Šablon za nove postove",
  excerpt: "Ovo je test fajl sa svim mogućnostima za pisanje blog postova: formatiran tekst, naslovi, liste, slike, citati i video...",
  author: "Autor Ime",
  date: "26. novembar 2025",
  category: "Kultura",
  imageUrl: slika777Url,
  imageSrcSet: slika777,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Osnovni tekst i formatiranje</h2><p>Ovo je običan paragraf teksta. Možete koristiti <strong>bold (podebljano)</strong>, <em>italic (kurziv)</em>, ili <u>underline (podvučeno)</u> formatiranje.</p><p>Možete dodati <a href="https://example.com">linkove ka drugim stranicama</a> unutar teksta.</p>'
    },
    {
      type: 'text',
      html: '<h2>Liste i nabrajanja</h2><p>Nenumerisane liste sa tačkama:</p><ul><li>Prva stavka liste</li><li>Druga stavka sa <strong>formatiranim tekstom</strong></li><li>Treća stavka</li><li>Četvrta stavka</li></ul>'
    },
    {
      type: 'text',
      html: '<h3>Numerisane liste</h3><p>Koristite numerisane liste za korake ili redosled:</p><ol><li>Prvi korak - priprema</li><li>Drugi korak - implementacija</li><li>Treći korak - testiranje</li><li>Četvrti korak - objava</li></ol>'
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777,
      alt: 'Primer glavne slike',
      caption: 'Opis ispod slike - dodajte opis koji objašnjava šta je na slici'
    },
    {
      type: 'text',
      html: '<h2>Citat - inspirativna poruka</h2><p>Koristite citate da istaknete važne misli ili izjave:</p>'
    },
    {
      type: 'quote',
      quoteText: 'Ovo je primer inspirativnog citata. Citat se prikazuje posebno stilizovan i istaknut od ostatka teksta.',
      quoteAuthor: 'Ime autora citata'
    },
    {
      type: 'text',
      html: '<h2>Dodatni tekstualni sadržaj</h2><p>Nakon citata možete nastaviti sa dodatnim tekstom. <strong>Ključne reči</strong> mogu biti istaknute.</p><p>Možete koristiti <code>inline kod</code> za tehničke termine ili komande.</p>'
    },
    {
      type: 'text',
      html: '<h3>Blockquote stil za duži citat u tekstu</h3><blockquote>Ovo je blockquote unutar HTML-a. Koristi se za duže citate ili istaknute pasuse. Možete dodati više rečenica ovde i sve će biti lepo formatirano sa obodom sa strane.</blockquote><p>Nakon blockquote-a nastavlja se normalan tekst.</p>'
    },
    {
      type: 'image',
      src: rimsko1Url,
      srcset: rimsko1,
      alt: 'Druga slika - različita od prve',
      caption: 'Svaka slika može imati svoj opis - koristite različite slike za vizuelnu raznovrsnost'
    },
    {
      type: 'text',
      html: '<h2>Video sadržaj</h2><p>Možete ugraditi YouTube ili Vimeo video. Samo zamenite URL sa pravim linkom ka videu:</p>'
    },
    {
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoProvider: 'youtube',
      caption: 'Opis videa - objasnite šta video prikazuje'
    },
    {
      type: 'text',
      html: '<h2>Kombinacija različitih elemenata</h2><p>Post može sadržati kombinaciju svih ovih elemenata. Evo primera kako kombinovati:</p><ul><li><strong>Tekst sekcije</strong> - Objasnite temu ili kontekst</li><li><strong>Slika</strong> - Dodajte vizuelnu ilustraciju</li><li><strong>Citat</strong> - Istaknite važnu misao</li><li><strong>Video</strong> - Pružite dodatni multimedialni sadržaj</li></ul>'
    },
    {
      type: 'quote',
      quoteText: 'Drugi citat u postu - možete imati više citata kroz post.',
      quoteAuthor: 'Drugi autor'
    },
    {
      type: 'image',
      src: rimsko2Url,
      srcset: rimsko2,
      alt: 'Treća slika',
      caption: 'Možete dodati koliko god slika želite'
    },
    {
      type: 'text',
      html: '<h2>Zaključak</h2><p>Završite post sa <strong>zaključkom</strong> ili <em>pozivom na akciju</em>.</p><p>Možete dodati:</p><ol><li>Sažetak glavnih tačaka</li><li>Poziv čitaocima da komentarišu</li><li>Linkove ka povezanim temama</li><li>Najave budućih postova</li></ol><p><strong>Srećno pisanje!</strong> 🎉</p>'
    }
  ],
};
