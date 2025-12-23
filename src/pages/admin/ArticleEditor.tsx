import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Sparkles,
  Wand2,
  Upload,
  X,
  ImageIcon,
} from "lucide-react";

const CATEGORIES = [
  { value: "istorija", label: "Istorija" },
  { value: "kultura", label: "Kultura" },
  { value: "ljudi", label: "Ljudi" },
  { value: "priroda", label: "Priroda" },
  { value: "gastronomija", label: "Gastronomija" },
  { value: "arhitektura", label: "Arhitektura" },
];

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  status: string;
}

const ArticleEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<ArticleForm>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Članak nije pronađen.",
      });
      navigate("/admin");
    } else {
      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content,
        cover_image: data.cover_image || "",
        category: data.category || "",
        status: data.status,
      });
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "dj")
      .replace(/ž/g, "z")
      .replace(/č/g, "c")
      .replace(/ć/g, "c")
      .replace(/š/g, "s")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Možete uploadovati samo slike.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Maksimalna veličina slike je 5MB.",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, cover_image: urlData.publicUrl }));

      toast({
        title: "Slika uploadovana!",
        description: "Naslovna slika je uspešno dodata.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Greška pri uploadu",
        description: error.message || "Pokušajte ponovo.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, cover_image: "" }));
  };

  const handleAI = async (action: "generate" | "improve") => {
    setAiLoading(action);
    try {
      // Ensure user is logged in (invoke will attach the token automatically)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          variant: "destructive",
          title: "Greška",
          description: "Morate biti prijavljeni za korišćenje AI asistenta.",
        });
        setAiLoading(null);
        return;
      }

      const { data: functionData, error } = await supabase.functions.invoke(
        "ai-article-assistant",
        {
          body: {
            action,
            title: form.title,
            content: form.content,
            category: form.category,
          },
        }
      );

      if (error) {
        let message = error.message || "AI greška";
        const resp = (error as any)?.context as Response | undefined;

        if (resp) {
          const status = resp.status;
          if (status === 429) {
            message = "Previše zahteva. Pokušajte ponovo za minut.";
          } else if (status === 402) {
            message = "AI krediti su potrošeni.";
          } else {
            try {
              const errJson = await resp.clone().json();
              if (errJson?.error) message = errJson.error;
            } catch {
              // ignore
            }
          }
        }

        throw new Error(message);
      }

      const responseData = functionData as any;

      if (!responseData?.content) {
        throw new Error("AI greška: prazan odgovor.");
      }

      if (action === "generate") {
        setForm((prev) => ({
          ...prev,
          content: responseData.content,
          excerpt: responseData.excerpt || prev.excerpt,
        }));
        toast({
          title: "Članak generisan!",
          description: "AI je kreirao sadržaj na osnovu naslova.",
        });
      } else {
        setForm((prev) => ({
          ...prev,
          content: responseData.content,
        }));
        toast({
          title: "Članak poboljšan!",
          description: "AI je unapredio tekst.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AI greška",
        description: error.message || "Pokušajte ponovo.",
      });
    } finally {
      setAiLoading(null);
    }
  };

  const handleSave = async (publish = false) => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Naslov i sadržaj su obavezni.",
      });
      return;
    }

    setSaving(true);
    const status = publish ? "published" : form.status;
    const published_at = publish ? new Date().toISOString() : null;

    const articleData = {
      ...form,
      status,
      published_at: status === "published" ? published_at || new Date().toISOString() : null,
      author_id: user?.id,
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from("articles")
        .update(articleData)
        .eq("id", id);
      error = result.error;
    } else {
      const result = await supabase.from("articles").insert(articleData);
      error = result.error;
    }

    if (error) {
      let message = "Nije moguće sačuvati članak.";
      if (error.message.includes("duplicate")) {
        message = "Članak sa ovim slug-om već postoji.";
      }
      toast({
        variant: "destructive",
        title: "Greška",
        description: message,
      });
    } else {
      toast({
        title: publish ? "Članak objavljen!" : "Članak sačuvan!",
        description: publish
          ? "Vaš članak je sada vidljiv na sajtu."
          : "Promene su sačuvane.",
      });
      navigate("/admin");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              {isEditing ? "Uredi članak" : "Novi članak"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Sačuvaj
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-category-people hover:bg-category-people/90"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Eye className="h-4 w-4 mr-2" />
              Objavi
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Basic Info */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Osnovne informacije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Naslov *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Unesite naslov članka"
                  className="bg-background"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="url-članka"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Kategorija</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Izaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Kratak opis</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Kratak opis članka (prikazuje se u listama)"
                  className="bg-background resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Naslovna slika</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {form.cover_image ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={form.cover_image}
                      alt="Cover preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Uploadovanje...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Kliknite da uploadujete sliku
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WebP do 5MB
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">ili</span>
                  <Input
                    id="cover_image"
                    value={form.cover_image}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, cover_image: e.target.value }))
                    }
                    placeholder="Unesite URL slike"
                    className="bg-background text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Asistent
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => handleAI("generate")}
                disabled={!form.title || aiLoading !== null}
                className="border-primary/30 hover:bg-primary/10"
              >
                {aiLoading === "generate" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generiši članak
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAI("improve")}
                disabled={!form.content || aiLoading !== null}
                className="border-accent/30 hover:bg-accent/10"
              >
                {aiLoading === "improve" ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Poboljšaj tekst
              </Button>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Sadržaj *</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Napišite sadržaj članka..."
                className="bg-background resize-none min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Podržava Markdown formatiranje
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
