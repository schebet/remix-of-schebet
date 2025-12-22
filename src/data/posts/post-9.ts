import slika777Srcset from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post9: BlogPost = {
  id: 9,
  title: "Najnoviji sneg u Šebetu",
  excerpt: "Zimska idila obavila selo Šebet - prvi sneg ove sezone doneo je čarobnu atmosferu i radost meštanima.",
  author: "Marko Petrović",
  date: "25. novembar 2025",
  category: "Priroda",
  imageUrl: slika777Url,
  imageSrcSet: slika777Srcset,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: `
        <p>Prošle noći selo Šebet se probudio pod debelim pokrivačem belog snega. Prvi sneg ove sezone doneo je radost i deci i odraslima, pretvarajući naše malo selo u pravu zimsku čaroliju.</p>
        <p>Temperatura je pala ispod nule tokom noći, a sneg je padao neprekidno skoro šest sati. Jutros su ulice bile prekrivene sa više od 20 centimetara svežeg snega.</p>
      `
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777Srcset,
      alt: "Snežni pejzaž u selu Šebet",
      caption: "Selo Šebet prekriveno svežim snegom - pogled na crkvu i glavnu ulicu"
    },
    {
      type: 'text',
      html: `
        <h2>Zimska radost</h2>
        <p>Deca su odmah izašla napolje da prave sneškog čoveka i sankaju se niz brdo kod škole. Stariji meštani su se setili svojih detinjstava i pričali priče o nekadašnjim zimama kad je sneg bio mnogo viši.</p>
        <p>Komunalna služba je brzo reagovala i očistila glavne ulice, ali mnogi su uživali u šetnji kroz zasneženo selo, uživajući u tišini i lepoti koje donosi prvi sneg.</p>
        <h2>Priprema za zimu</h2>
        <p>Ovo je odličan podsetnik da se svi pripremimo za predstojeću zimu. Vreme je da proverimo ogrev, pripremimo dovoljno drva, i obezbedimo da naši stariji komšije imaju sve što im je potrebno.</p>
        <p>Meteorolozi najavljuju da će sneg ostati još nekoliko dana, tako da ćemo moći da uživamo u zimskoj atmosferi.</p>
      `
    }
  ]
};
