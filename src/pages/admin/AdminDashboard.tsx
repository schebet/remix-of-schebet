import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  FileText,
  Eye,
  Loader2,
  Home,
  Users,
  ShieldCheck,
  UserX,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  category: string | null;
  created_at: string;
  published_at: string | null;
  author_id: string | null;
}

interface Author {
  id: string;
  user_id: string;
  role: string;
  full_name: string | null;
}

const AdminDashboard = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminRole();
      fetchArticles();
    }
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) return;
    const { data } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    setIsAdmin(!!data);
    if (data) {
      fetchAllArticles();
      fetchAuthors();
    }
  };

  const fetchArticles = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, status, category, created_at, published_at, author_id")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće učitati članke.",
      });
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const fetchAllArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, status, category, created_at, published_at, author_id")
      .order("created_at", { ascending: false });

    if (!error) {
      setAllArticles(data || []);
    }
  };

  const fetchAuthors = async () => {
    // First get roles
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("id, user_id, role")
      .in("role", ["author", "admin"]);

    if (rolesError || !rolesData) return;

    // Then get profiles for those users
    const userIds = rolesData.map(r => r.user_id);
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    // Combine the data
    const authorsWithNames = rolesData.map(role => ({
      ...role,
      full_name: profilesData?.find(p => p.id === role.user_id)?.full_name || null
    }));

    setAuthors(authorsWithNames);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće obrisati članak.",
      });
    } else {
      toast({
        title: "Članak obrisan",
        description: "Članak je uspešno obrisan.",
      });
      setArticles(articles.filter((a) => a.id !== id));
      setAllArticles(allArticles.filter((a) => a.id !== id));
    }
  };

  const handleRemoveAuthor = async (roleId: string, userId: string) => {
    // Prevent removing own admin role
    if (userId === user?.id) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Ne možete ukloniti sopstvenu ulogu.",
      });
      return;
    }

    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće ukloniti autora.",
      });
    } else {
      toast({
        title: "Autor uklonjen",
        description: "Autor je uspešno uklonjen.",
      });
      setAuthors(authors.filter((a) => a.id !== roleId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-category-people text-primary-foreground">Objavljeno</Badge>;
      case "draft":
        return <Badge variant="secondary">Nacrt</Badge>;
      case "archived":
        return <Badge variant="outline" className="text-muted-foreground">Arhivirano</Badge>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return <Badge className="bg-primary text-primary-foreground">Admin</Badge>;
    }
    return <Badge variant="secondary">Autor</Badge>;
  };

  const ArticleList = ({ articleList, showAuthor = false }: { articleList: Article[], showAuthor?: boolean }) => (
    <div className="space-y-4">
      {articleList.map((article) => (
        <Card key={article.id} className="border-border/50 hover:shadow-soft transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(article.status)}
                  {article.category && (
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-foreground truncate">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {article.excerpt}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(article.created_at).toLocaleDateString("sr-Latn")}
                  {showAuthor && article.author_id && (
                    <span className="ml-2">
                      • Autor: {authors.find(a => a.user_id === article.author_id)?.full_name || "Nepoznat"}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {article.status === "published" && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/blog/${article.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/edit/${article.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Obrisati članak?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ova akcija se ne može poništiti. Članak će biti trajno obrisan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Otkaži</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(article.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Obriši
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gradient-primary">Admin Panel</h1>
            <span className="text-sm text-muted-foreground">Selo Šebet</span>
            {isAdmin && (
              <Badge className="bg-primary/20 text-primary border border-primary/30">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Sajt
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Odjava
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isAdmin ? "Svi članci" : "Vaši članci"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {isAdmin ? allArticles.length : articles.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Objavljeno
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-category-people">
                {(isAdmin ? allArticles : articles).filter((a) => a.status === "published").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isAdmin ? "Autori" : "Nacrti"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">
                {isAdmin ? authors.length : articles.filter((a) => a.status === "draft").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {isAdmin ? "Upravljanje sadržajem" : "Vaši članci"}
          </h2>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/admin/new">
              <Plus className="h-4 w-4 mr-2" />
              Novi članak
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isAdmin ? (
          /* Admin View with Tabs */
          <Tabs defaultValue="all-articles" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all-articles" className="gap-2">
                <FileText className="h-4 w-4" />
                Svi članci
              </TabsTrigger>
              <TabsTrigger value="my-articles" className="gap-2">
                <Edit className="h-4 w-4" />
                Moji članci
              </TabsTrigger>
              <TabsTrigger value="authors" className="gap-2">
                <Users className="h-4 w-4" />
                Autori
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-articles">
              {allArticles.length === 0 ? (
                <Card className="border-border/50 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nema članaka</p>
                  </CardContent>
                </Card>
              ) : (
                <ArticleList articleList={allArticles} showAuthor />
              )}
            </TabsContent>

            <TabsContent value="my-articles">
              {articles.length === 0 ? (
                <Card className="border-border/50 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Nemate još članaka</p>
                    <Button asChild>
                      <Link to="/admin/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Kreirajte prvi članak
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <ArticleList articleList={articles} />
              )}
            </TabsContent>

            <TabsContent value="authors">
              <div className="space-y-4">
                {authors.length === 0 ? (
                  <Card className="border-border/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nema autora</p>
                    </CardContent>
                  </Card>
                ) : (
                  authors.map((author) => (
                    <Card key={author.id} className="border-border/50 hover:shadow-soft transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {author.full_name || "Nepoznat korisnik"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {getRoleBadge(author.role)}
                                {author.user_id === user?.id && (
                                  <Badge variant="outline" className="text-xs">Vi</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {author.user_id !== user?.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Ukloni
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Ukloniti autora?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Ova akcija će ukloniti ulogu "{author.role}" korisniku{" "}
                                    <strong>{author.full_name || "Nepoznat"}</strong>.
                                    Korisnik više neće moći da pristupa admin panelu.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Otkaži</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveAuthor(author.id, author.user_id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Ukloni
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          /* Regular Author View */
          articles.length === 0 ? (
            <Card className="border-border/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Nemate još članaka</p>
                <Button asChild>
                  <Link to="/admin/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Kreirajte prvi članak
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ArticleList articleList={articles} />
          )
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;