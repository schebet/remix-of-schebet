import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getGallerySizes } from "@/lib/imageUtils";

import slika777SrcSet from "@/assets/photos/777.JPG?w=300;640;768;1024&format=webp&quality=85&as=srcset";
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko1SrcSet from "@/assets/photos/rimsko_1.jpeg?w=300;640;768;1024&format=webp&quality=85&as=srcset";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import rimsko2SrcSet from "@/assets/photos/rimsko_2.jpeg?w=300;640;768;1024&format=webp&quality=85&as=srcset";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";

const galleryImages = [
  { 
    id: 1, 
    title: "Centar sela", 
    category: "Arhitektura",
    imageSrc: slika777Url,
    imageSrcSet: slika777SrcSet
  },
  { 
    id: 2, 
    title: "Rimsko naselje", 
    category: "Istorija",
    imageSrc: rimsko1Url,
    imageSrcSet: rimsko1SrcSet
  },
  { 
    id: 3, 
    title: "Arheološko nalazište", 
    category: "Istorija",
    imageSrc: rimsko2Url,
    imageSrcSet: rimsko2SrcSet
  },
];

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("Sve");

  const categories = ["Sve", "Arhitektura", "Istorija", "Priroda", "Kultura"];

  const filteredImages =
    filter === "Sve"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-back-to-top">
            Galerija sela
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Fotografije koje prikazuju lepotu i duh našeg sela
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className={
                  filter === category
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    : "border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square card-hover"
              onClick={() => setSelectedImage(image.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img
                src={image.imageSrc}
                srcSet={image.imageSrcSet}
                sizes={getGallerySizes()}
                alt={image.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full w-fit mb-2">
                  {image.category}
                </span>
                <h3 className="text-lg font-bold text-foreground">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Image Dialog */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={galleryImages.find((img) => img.id === selectedImage)?.imageSrc}
                  srcSet={galleryImages.find((img) => img.id === selectedImage)?.imageSrcSet}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  alt={galleryImages.find((img) => img.id === selectedImage)?.title}
                  className="w-full h-auto rounded-lg"
                />
                <div>
                  <span className="text-sm px-3 py-1 bg-accent/20 text-accent rounded-full">
                    {galleryImages.find((img) => img.id === selectedImage)?.category}
                  </span>
                  <h3 className="text-2xl font-bold mt-2">
                    {galleryImages.find((img) => img.id === selectedImage)?.title}
                  </h3>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
