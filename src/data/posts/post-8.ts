import slika777 from "@/assets/photos/777.JPG?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko1 from "@/assets/photos/rimsko_1.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post8: BlogPost = {
  id: 8,
  title: "Seoska zadruga i saradnja",
  excerpt: "Kako seljani zajedno rade i pomažu jedni drugima. Priča o zajedništvu i solidarnosti u Šebetu...",
  author: "Marko Petrović",
  date: "26. novembar 2025",
  category: "Ljudi",
  imageUrl: slika777Url,
  imageSrcSet: slika777,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Zajedništvo kao temelj</h2><p>U selu Šebet, <strong>zajedništvo nije samo reč - to je način života</strong>. Od davnina, seljani su znali da je <em>međusobna pomoć</em> ključ za opstanak i napredak cele zajednice.</p><p>Kroz sve generacije, ljudi su se okupljali na &quot;mobe&quot; - zajedničkim radovima gde se pomaže komšiji bez očekivanja materijalne nadoknade.</p>'
    },
    {
      type: 'image',
      src: slika777Url,
      srcset: slika777,
      alt: 'Seoska zajednica na radu',
      caption: 'Zajednički rad seljana tokom žetve'
    },
    {
      type: 'text',
      html: '<h2>Moba - tradicija koja traje</h2><p>Moba je stara seoska tradicija gde se ljudi okupljaju da pomognu u velikim poslovima:</p><ul><li><strong>Žetva i vršidba</strong> - najvažniji poslovi u leto</li><li><strong>Branje kukuruza</strong> - jesenja okupljanja uz priče i smeh</li><li><strong>Gradnja kuća</strong> - celo selo dolazi da pomogne</li><li><strong>Sečenje drva</strong> - priprema za zimu</li></ul><p>Ova tradicija i danas živi u Šebetu, povezujući generacije i čuvajući duh zajedništva.</p>'
    },
    {
      type: 'quote',
      quoteText: 'Sam ideš brže, zajedno ideš dalje.',
      quoteAuthor: 'Afrička poslovica'
    },
    {
      type: 'text',
      html: '<h2>Moderna seoska zadruga</h2><p>Danas u Šebetu postoji <strong>aktivna zemljoradnička zadruga</strong> koja:</p><ol><li>Omogućava zajedničku kupovinu opreme i mašina</li><li>Organizuje zajedničku prodaju proizvoda</li><li>Pomaže u dobijanju povoljnih kredita</li><li>Spaja seljake sa kupcima i izvoznicima</li></ol><p>Zahvaljujući zadruzi, čak i mala domaćinstva mogu pristupiti modernoj mehanizaciji i tržištu.</p>'
    },
    {
      type: 'image',
      src: rimsko1Url,
      srcset: rimsko1,
      alt: 'Zadrugari na sastanku',
      caption: 'Godišnja skupština seoske zadruge'
    },
    {
      type: 'text',
      html: '<h2>Solidarnost u teškim trenucima</h2><p>Najlepši primeri zajedništva se vide kada neko od seljana doživi <strong>nepriliku ili nesreću</strong>:</p><blockquote>Kada je porodica Jovanović prošle godine izgubila štalu u požaru, celo selo se odmah organizovalo. Za mesec dana izgradili su novu štalu, skupili novac i donirali stoku. Ni jedna porodica u Šebetu ne ostaje sama u nevolji.</blockquote><p>Ovakvi primeri nisu retkost - oni su svakodnevica koja pokazuje pravu vrednost zajednice.</p>'
    },
    {
      type: 'quote',
      quoteText: 'Dobro selo nije ono sa lepim kućama, već ono sa dobrim ljudima.',
      quoteAuthor: 'Narodna izreka'
    },
    {
      type: 'text',
      html: '<h2>Mladi nastavljaju tradiciju</h2><p>Nova generacija seljana <em>ne napušta</em> principe zajedništva, već ih prilagođava savremenom dobu:</p><ul><li>Preko društvenih mreža organizuju <strong>zajedničke akcije</strong></li><li>Dele znanja i iskustva kroz <strong>online grupe</strong></li><li>Pokreću <strong>inovativne projekte</strong> poput zajedničkih plastenika</li><li>Kombinuju staro i novo - <strong>tradicija i inovacija</strong></li></ul><p>Tako selo Šebet ostaje primer kako tradicija i moderna mogu ići ruku pod ruku.</p>'
    },
    {
      type: 'image',
      src: rimsko2Url,
      srcset: rimsko2,
      alt: 'Mladi seljaci',
      caption: 'Nova generacija čuva tradicije i unosi nove ideje'
    },
    {
      type: 'text',
      html: '<h2>Zaključak</h2><p>Seoska zadruga i saradnja u Šebetu nisu relikt prošlosti - oni su <strong>živa stvarnost</strong> koja čini ovo selo posebnim.</p><p>U vreme kada mnogi govore o individualizmu i otuđenosti, Šebet pokazuje da zajedništvo i solidarnost nisu izgubljene vrednosti.</p><p><em>Selo Šebet je dokaz da zajemo možemo više, bolje i srećnije!</em></p>'
    }
  ],
};
