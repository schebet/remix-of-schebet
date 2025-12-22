import rimsko1 from "@/assets/photos/rimsko_1.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import rimsko2 from "@/assets/photos/rimsko_2.jpeg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";
import type { BlogPost } from "../blogPosts";

export const post6: BlogPost = {
  id: 6,
  title: "Arhitektonsko nasleđe",
  excerpt: "Stare kuće, crkve i mostovi koji svedoče o prošlosti. Očuvanje arhitektonskog nasleđa...",
  author: "Nikola Stanković",
  date: "20. decembar 2024",
  category: "Arhitektura",
  imageUrl: rimsko1Url,
  imageSrcSet: rimsko1,
  ogImage: "/og-images/rimsko_1.jpg",
  content: [
    {
      type: 'text',
      html: '<h2>Tradicionalna gradnja</h2><p>Arhitektura Šebeta odražava tradicionalni stil gradnje karakterističan za ovaj region. Stare kuće su građene od prirodnih materijala - kamena, drveta i ćerpiča.</p>'
    },
    {
      type: 'image',
      src: rimsko1Url,
      srcset: rimsko1,
      alt: 'Arhitektura Šebeta',
      caption: 'Tradicionalna gradnja i arhitektonski elementi'
    },
    {
      type: 'text',
      html: '<h2>Sakralni objekti</h2><p>Stara seoska crkva je centralno mesto duhovnog života zajednice. Sagrađena u 18. veku, predstavlja značajno kulturno-istorijsko dobro.</p><h2>Očuvanje nasleđa</h2><p>Lokalna zajednica aktivno radi na očuvanju starih zgrada i tradicionalnog stila gradnje. Renoviraju se stare kuće uz poštovanje autentičnih tehnika i materijala.</p>'
    },
    {
      type: 'image',
      src: rimsko2Url,
      srcset: rimsko2,
      alt: 'Renovirana tradicionalna kuća',
      caption: 'Primer uspešne renovacije uz očuvanje originalnog stila'
    }
  ],
};
