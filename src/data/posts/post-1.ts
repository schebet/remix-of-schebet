import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko1 from "@/assets/photos/rimsko_1.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post1: BlogPost = {
  id: 1,
  title: "Istorija sela kroz vekove",
  excerpt: "Otkrijte bogatu istoriju sela Šebet, od prvih naseljenika do danas. Priče koje oblikuju našu zajednicu...",
  author: "Neško - Škone",
  date: "15. januar 2025",
  category: "Istorija",
  imageUrl: rimsko1Url,
  imageSrcSet: rimsko1,
  ogImage: "/og-images/rimsko_1.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Početak naselja</h2><p>Selo Šebet ima bogatu istoriju koja seže nekoliko vekova unazad. Prvi pisani tragovi o selu datiraju iz 15. veka, kada je ovo područje bilo deo većeg feudalnog poseda.</p>'
    },
    {
      type: 'image',
      src: rimsko1Url,
      srcset: rimsko1,
      alt: 'Arheološko nalazište rimskog perioda',
      caption: 'Ostatci rimskog naselja u blizini Šebeta'
    },
    {
      type: 'quote',
      quoteText: 'Istorija nije ono što se dogodilo, već priče koje prenosimo o tome što se dogodilo.',
      quoteAuthor: 'Narodna mudrost'
    },
    {
      type: 'text',
      html: '<h2>Razvoj kroz vekove</h2><p>Tokom 18. i 19. veka, selo je doživelo značajan razvoj. Građene su prve škole, crkve i javne zgrade koje su postale centar društvenog života zajednice.</p><p>Stanovništvo se bavilo uglavnom poljoprivredom, stočarstvom i tradicionalnim zanatima. Mnoge od ovih tradicija su očuvane i dan danas.</p>'
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777,
      alt: 'Centar sela Šebet',
      caption: 'Centralni deo sela danas'
    },
    {
      type: 'text',
      html: '<h2>Moderne prilike</h2><p>U 20. veku, selo je prošlo kroz modernizaciju infrastrukture. Elektrifikacija, putevi i vodosnabdevanje su značajno poboljšali kvalitet života stanovnika.</p><p>Danas, Šebet predstavlja spoj tradicionalnog seoskog života i modernih pogodnosti, čuvajući svoje nasleđe dok gleda ka budućnosti.</p>'
    }
  ],
};
