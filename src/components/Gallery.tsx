import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Static images as fallback
import slika777Url from "@/assets/photos/777.JPG?w=1024&format=webp&quality=85";
import rimsko1Url from "@/assets/photos/rimsko_1.jpeg?w=1024&format=webp&quality=85";
import rimsko2Url from "@/assets/photos/rimsko_2.jpeg?w=1024&format=webp&quality=85";

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const staticImages: GalleryImage[] = [
  { id: "static-1", title: "Centar sela", category: "Arhitektura", image_url: slika777Url },
  { id: "static-2", title: "Rimsko naselje", category: "Istorija", image_url: rimsko1Url },
  { id: "static-3", title: "Arheološko nalazište", category: "Istorija", image_url: rimsko2Url },
];

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>("Sve");
  const [images, setImages] = useState<GalleryImage[]>(staticImages);
  const [loading, setLoading] = useState(true);

  const categories = ["Sve", "Arhitektura", "Istorija", "Priroda", "Kultura"];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, title, category, image_url")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setImages(data);
    }
    setLoading(false);
  };

  const filteredImages =
    filter === "Sve"
      ? images
      : images.filter((img) => img.category === filter);

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
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square card-hover"
                onClick={() => setSelectedImage(image)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={image.image_url}
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
        )}

        {/* Image Dialog */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            {selectedImage && (
              <div className="space-y-4">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
                <div>
                  <span className="text-sm px-3 py-1 bg-accent/20 text-accent rounded-full">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-2xl font-bold mt-2">
                    {selectedImage.title}
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
