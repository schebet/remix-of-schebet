import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { SocialShare } from "@/components/SocialShare";
import { Breadcrumbs } from "@/components/Breadcrumbs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, User, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { blogPosts as blogPostsData, getCategoryColor } from "@/data/blogPosts";

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPostsData.find((p) => p.id === Number(id));

  const getRelatedPosts = () => {
    if (!post) return [];
    return blogPostsData
      .filter((p) => p.category === post.category && p.id !== post.id)
      .slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Članak nije pronađen</h1>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nazad na početnu
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fullUrl = `${window.location.origin}/blog/${post.id}`;
  const ogImageUrl = `${window.location.origin}${post.ogImage}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.title} - Selo Šebet</title>
        <meta name="description" content={post.excerpt} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={fullUrl} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <Navigation />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs 
            items={[
              { label: 'Blog', href: '/#blog' },
              { label: post.category, href: '/#blog' },
              { label: post.title }
            ]} 
          />

          <div className="mb-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <Badge variant="outline" className={`border ${getCategoryColor(post.category)}`}>
                  {post.category}
                </Badge>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Social Share */}
            <div className="mb-8 pb-8 border-b border-border">
              <SocialShare 
                url={`/blog/${post.id}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>

            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg mb-8">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </div>

          <div 
            className="prose prose-lg max-w-none animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {post.content.map((block, index) => {
              if (block.type === 'text') {
                return (
                  <div 
                    key={index}
                    dangerouslySetInnerHTML={{ __html: block.html || '' }}
                  />
                );
              }
              
              if (block.type === 'image') {
                return (
                  <figure key={index} className="my-8">
                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg">
                      <img
                        src={block.src}
                        srcSet={block.srcset}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 896px"
                        alt={block.alt}
                        loading="lazy"
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    {block.caption && (
                      <figcaption className="text-sm text-muted-foreground text-center mt-3 italic">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (block.type === 'video') {
                const getEmbedUrl = () => {
                  if (block.videoProvider === 'youtube') {
                    const videoId = block.videoUrl?.split('v=')[1]?.split('&')[0];
                    return `https://www.youtube.com/embed/${videoId}`;
                  }
                  if (block.videoProvider === 'vimeo') {
                    const videoId = block.videoUrl?.split('/').pop();
                    return `https://player.vimeo.com/video/${videoId}`;
                  }
                  return block.videoUrl;
                };

                return (
                  <figure key={index} className="my-8">
                    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
                      <iframe
                        src={getEmbedUrl()}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </AspectRatio>
                    {block.caption && (
                      <figcaption className="text-sm text-muted-foreground text-center mt-3 italic">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }

              if (block.type === 'quote') {
                return (
                  <blockquote key={index} className="my-8 border-l-4 border-primary pl-6 py-4 italic">
                    <p className="text-xl text-foreground mb-2">{block.quoteText}</p>
                    {block.quoteAuthor && (
                      <footer className="text-sm text-muted-foreground not-italic">
                        — {block.quoteAuthor}
                      </footer>
                    )}
                  </blockquote>
                );
              }
              
              return null;
            })}
          </div>
        </article>


        <article className="container mx-auto px-4 max-w-4xl">
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-3xl font-bold mb-8 text-gradient-primary">Srodni članci</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="flex flex-col overflow-hidden hover-scale">
                    <AspectRatio ratio={16 / 9} className="overflow-hidden">
                      <img
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                      />
                    </AspectRatio>
                    <CardHeader>
                      <Badge variant="outline" className={`w-fit mb-2 border ${getCategoryColor(relatedPost.category)}`}>
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-xl line-clamp-2">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <Link to={`/blog/${relatedPost.id}`}>
                        <Button variant="ghost" size="sm" className="w-full">
                          Pročitaj više
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-border">
            <Link to="/#blog">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vidi sve članke
              </Button>
            </Link>
          </div>
        </article>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default BlogPost;
