import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post5: BlogPost = {
  id: 5,
  title: "Gastronomska baština",
  excerpt: "Tradicionalna seoska kuhinja i recepti koji se prenose generacijama. Ukusi detinjstva...",
  author: "Milica Todorović",
  date: "28. decembar 2024",
  category: "Gastronomija",
  imageUrl: rimsko2Url,
  imageSrcSet: rimsko2,
  ogImage: "/og-images/rimsko_2.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Tradicionalna kuhinja</h2><p>Gastronomija Šebeta je rezultat vekova kulinarskog nasleđa. Recepti se prenose sa kolena na koleno, čuvajući autentične ukuse i tehnike pripreme.</p><h2>Karakteristična jela</h2><p>Posebno su poznati domaći sir, pršuta sušena na planinski način, ajvar, kiseli kupus i zimnica. Svaka domaćica ima svoje tajne sastojke koji čine jelo jedinstvenim.</p>'
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777,
      alt: 'Tradicionalna gozba',
      caption: 'Domaća jela i proizvodi'
    },
    {
      type: 'quote',
      quoteText: 'Najbolja hrana je ona spremljena sa ljubavlju i deljena sa radošću.',
      quoteAuthor: 'Tradicionalna kuharska mudrost'
    },
    {
      type: 'text',
      html: '<h2>Slavska gozba</h2><p>Za velike proslave priprema se tradicionalna gozba: pečenje na ražnju, sarma, gibanica, različiti kolaći i domaće rakije. Ova jela su neodvojivi deo svakog slavlja.</p><h2>Domaći proizvodi</h2><p>Većina namirnica potiče iz sopstvenih bašta i ekonomija. Organski uzgajano voće i povrće, domaće životinje i pčelinji proizvodi čine osnovu svake trpeze.</p>'
    }
  ],
};
