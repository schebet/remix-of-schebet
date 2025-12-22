import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post2: BlogPost = {
  id: 2,
  title: "Tradicionalne svečanosti",
  excerpt: "Naše selo čuva jedinstvene tradicije i običaje. Saznajte više o godišnjim proslavama i festivalima...",
  author: "Ana Jovanović",
  date: "10. januar 2025",
  category: "Kultura",
  imageUrl: slika777Url,
  imageSrcSet: slika777,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Godišnji običaji</h2><p>Selo Šebet neguje bogatu tradiciju kulturnih i verskih praznika koji se slave tokom cele godine. Ove svečanosti okupljaju zajednicu i prenose tradiciju sa kolena na koleno.</p>'
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777,
      alt: 'Seoska svečanost u Šebetu',
      caption: 'Okupljanje stanovnika na centralnom trgu'
    },
    {
      type: 'text',
      html: '<h2>Slava sela</h2><p>Svake godine u julu, selo proslavlja svoju krsnu slavu, koja okuplja sva domaćinstva i goste iz okolnih mesta. Ovo je najvažniji događaj u seoskom kalendaru.</p><h2>Tradicionalni festivali</h2><p>Pored verskih praznika, održavaju se i tradicionalni festivali: berba grožđa u jesen, žetveni praznik u leto, i zimski sajam u decembru.</p><p>Ovi događaji uključuju folklorne igre, tradicionalnu muziku, izložbe domaćih proizvoda i takmičenja u pripremi autentičnih jela.</p>'
    },
    {
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=qGgnaj6y75s',
      videoProvider: 'youtube',
      caption: 'Tradicionalna srpska muzika i igre'
    }
  ],
};
