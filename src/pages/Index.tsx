import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { BlogGrid } from "@/components/BlogGrid";
import { Gallery } from "@/components/Gallery";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Sve");

  return (
    <div className="min-h-screen">
      <Navigation selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <main>
        <Hero />
        <BlogGrid selectedCategory={selectedCategory} />
        <Gallery />
        <About />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Index;
