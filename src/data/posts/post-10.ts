import img777 from '@/assets/photos/777.JPG';
import type { BlogPost } from '../blogPosts';

export const post10: BlogPost = {
  id: 10,
  title: "Geografski položaj Šebeta",
  excerpt: "Otkrijte gde se nalazi selo Šebet, njegovo okruženje, reljef i prirodne karakteristike koje ga čine jedinstvenim...",
  author: "Redakcija",
  date: "22. decembar 2024",
  category: "Priroda",
  imageUrl: img777,
  imageSrcSet: `${img777} 1200w, ${img777} 800w, ${img777} 400w`,
  ogImage: "/og-images/777.jpg",
  content: [
    {
      type: 'text',
      html: `<h2>Gde se nalazi Šebet?</h2>
<p>Selo Šebet smešteno je u slikovitom delu Srbije, okruženo brdima i plodnim poljima. Njegova geografska lokacija čini ga idealnim mestom za poljoprivredu i stočarstvo, tradicije koje su ovde negovane vekovima.</p>`
    },
    {
      type: 'image',
      src: img777,
      srcset: `${img777} 1200w, ${img777} 800w`,
      alt: 'Panorama sela Šebet',
      caption: 'Pogled na selo i okolinu'
    },
    {
      type: 'text',
      html: `<h2>Reljef i priroda</h2>
<p>Teren oko Šebeta karakterišu blaga brda i doline, sa nekoliko potoka koji prolaze kroz atare sela. Šume hrasta i bukve okružuju naselje, pružajući prirodnu zaštitu i bogat ekosistem.</p>
<p>Nadmorska visina varira od 200 do 400 metara, što stvara povoljnu mikroklimu za uzgoj raznih kultura.</p>`
    },
    {
      type: 'text',
      html: `<h2>Klima</h2>
<p>Umerenoukontinentalna klima donosi topla leta i hladne zime sa snegom. Prosečna godišnja temperatura iznosi oko 11°C, sa najviše padavina u proleće i jesen.</p>`
    },
    {
      type: 'quote',
      quoteText: 'Šebet leži u srcu plodne zemlje, gde se nebo spušta do brda.',
      quoteAuthor: 'Narodno predanje'
    },
    {
      type: 'text',
      html: `<h2>Saobraćajna povezanost</h2>
<p>Selo je povezano lokalnim putevima sa okolnim mestima i većim gradovima. Ova pristupačnost omogućava stanovnicima lak pristup tržištima i uslugama, dok istovremeno čuva mirnoću seoskog života.</p>`
    }
  ]
};
