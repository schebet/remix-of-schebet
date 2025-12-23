import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { SocialShare } from "@/components/SocialShare";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar, ArrowLeft, Tag, ArrowRight, Loader2 } from "lucide-react";
import { getCategoryColor } from "@/data/blogPosts";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
  author_id: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArticle(data);

      // Fetch related articles from same category
      if (data.category) {
        const { data: related } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);

        setRelatedArticles(related || []);
      }

      setLoading(false);
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("sr-Latn-RS", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryLabel = (category: string | null) => {
    const categories: Record<string, string> = {
      istorija: "Istorija",
      kultura: "Kultura",
      ljudi: "Ljudi",
      priroda: "Priroda",
      gastronomija: "Gastronomija",
      arhitektura: "Arhitektura",
    };
    return category ? categories[category] || category : "";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !article) {
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

  // Use fixed production URL for OG tags - Facebook crawler doesn't execute JS
  const siteUrl = 'https://sebet.lovable.app';
  const fullUrl = `${siteUrl}/blog/${article.slug}`;
  
  // Fixed OG image for all posts - valid Supabase storage URL
  const ogImageUrl = 'https://geflwjxcposyetxrmbcq.supabase.co/storage/v1/object/public/article-images/covers/1766478998950-uft5dfsb4l.jpg';

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{article.title} - Selo Šebet</title>
        <meta name="description" content={article.excerpt || ""} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || ""} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={article.title} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:site_name" content="Selo Šebet" />
        {article.published_at && (
          <meta property="article:published_time" content={article.published_at} />
        )}
        {article.category && (
          <meta property="article:section" content={getCategoryLabel(article.category)} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || ""} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <Navigation />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <Breadcrumbs 
            items={[
              { label: 'Blog', href: '/#blog' },
              { label: getCategoryLabel(article.category), href: '/#blog' },
              { label: article.title }
            ]} 
          />

          <div className="mb-8 animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              {article.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <Badge variant="outline" className={`border ${getCategoryColor(article.category)}`}>
                    {getCategoryLabel(article.category)}
                  </Badge>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-primary">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {article.excerpt}
              </p>
            )}

            {/* Social Share */}
            <div className="mb-8 pb-8 border-b border-border">
              <SocialShare 
                url={`/blog/${article.slug}`}
                title={article.title}
                description={article.excerpt || ""}
              />
            </div>

            {article.cover_image && (
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg mb-8">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            )}
          </div>

          <div 
            className="prose prose-lg max-w-none animate-fade-in-up dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted"
            style={{ animationDelay: "0.1s" }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>

        <div className="container mx-auto px-4 max-w-4xl">
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-3xl font-bold mb-8 text-gradient-primary">Srodni članci</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedPost) => (
                  <Card key={relatedPost.id} className="flex flex-col overflow-hidden hover-scale">
                    {relatedPost.cover_image && (
                      <AspectRatio ratio={16 / 9} className="overflow-hidden">
                        <img
                          src={relatedPost.cover_image}
                          alt={relatedPost.title}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        />
                      </AspectRatio>
                    )}
                    <CardHeader>
                      {relatedPost.category && (
                        <Badge variant="outline" className={`w-fit mb-2 border ${getCategoryColor(relatedPost.category)}`}>
                          {getCategoryLabel(relatedPost.category)}
                        </Badge>
                      )}
                      <CardTitle className="text-xl line-clamp-2">{relatedPost.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <Link to={`/blog/${relatedPost.slug}`}>
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
        </div>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default BlogPost;