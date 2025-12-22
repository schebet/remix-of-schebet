import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post4: BlogPost = {
  id: 4,
  title: "Prirodne lepote okoline",
  excerpt: "Šebet je okružen prelepi prirodom. Istražite šume, reke i planine koje nas okružuju...",
  author: "Jelena Đorđević",
  date: "1. januar 2025",
  category: "Priroda",
  imageUrl: rimsko2Url,
  imageSrcSet: rimsko2,
  ogImage: "/og-images/rimsko_2.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Geografski položaj</h2><p>Selo Šebet se nalazi u podnožju planinskog masiva, okruženo šumama i livadama. Ovaj prirodni ambijent pruža neverovatne mogućnosti za aktivnosti na otvorenom.</p>'
    },
    {
      type: 'image',
      src: rimsko2Url,
      srcset: rimsko2,
      alt: 'Priroda oko Šebeta',
      caption: 'Planinski ambijent koji okružuje selo'
    },
    {
      type: 'text',
      html: '<h2>Planinske staze</h2><p>Brojne planinarske staze vode kroz okolne šume do vidikovaca sa kojih se pruža spektakularan pogled na dolinu. Najpoznatija staza vodi do vrha Veliki kamen.</p><h2>Reke i izvori</h2><p>Kroz selo protiče kristalno čista planinska reka, koja je dom brojnih riba i divljih životinja. Prirodni izvori vode su poznati po svom kvalitetu.</p><h2>Flora i fauna</h2><p>Područje je dom raznovrsnog biljnog i životinjskog sveta. U šumama žive srne, divlje svinje, lisice, a mogu se uočiti i retke vrste ptica.</p>'
    },
    {
      type: 'quote',
      quoteText: 'U svakom šetnji prirodom, čovek dobija mnogo više nego što je tražio.',
      quoteAuthor: 'John Muir'
    },
    {
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=iyLdoQGBchQ',
      videoProvider: 'youtube',
      caption: 'Prirodne lepote Srbije'
    }
  ],
};
