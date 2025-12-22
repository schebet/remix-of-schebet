import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts, getCategoryColor } from "@/data/blogPosts";
import { getBlogCardSizes } from "@/lib/imageUtils";

const POSTS_PER_PAGE = 6;

export const BlogGrid = ({ selectedCategory }: { selectedCategory?: string }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = selectedCategory && selectedCategory !== "Sve" 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="blog" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-back-to-top">
            {selectedCategory && selectedCategory !== "Sve" ? `${selectedCategory} priče` : "Najnovije priče"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Istražite dokumentarne članke o istoriji, kulturi i ljudima našeg sela
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Nema postova u ovoj kategoriji.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post, index) => (
            <Card
              key={post.id}
              className="flex flex-col overflow-hidden card-hover bg-gradient-card border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AspectRatio ratio={16 / 9} className="overflow-hidden">
                <img
                  src={post.imageUrl}
                  srcSet={post.imageSrcSet}
                  sizes={getBlogCardSizes()}
                  alt={post.title}
                  loading="lazy"
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                />
              </AspectRatio>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                  <Badge variant="outline" className={`ml-auto border ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-2xl hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <Link to={`/blog/${post.id}`}>
                  <Button variant="ghost" size="sm" className="bg-muted text-primary hover:bg-muted/80 hover:text-primary transition-all duration-300">
                    Pročitaj više
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
