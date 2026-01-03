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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  FileText,
  Trash2,
  ImagePlus,
  Link as LinkIcon,
  Video,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCategories } from "@/hooks/useCategories";

// Fallback categories if database is empty
const FALLBACK_CATEGORIES = [
  { value: "istorija", label: "Istorija" },
  { value: "kultura", label: "Kultura" },
  { value: "ljudi", label: "Ljudi" },
  { value: "priroda", label: "Priroda" },
  { value: "gastronomija", label: "Gastronomija" },
  { value: "arhitektura", label: "Arhitektura" },
  { value: "tradicija", label: "Tradicija" },
  { value: "dogadjaji", label: "Događaji" },
  { value: "turizam", label: "Turizam" },
  { value: "religija", label: "Religija" },
  { value: "sport-rekreacija", label: "Sport i rekreacija" },
  { value: "umetnost", label: "Umetnost" },
  { value: "privreda", label: "Privreda" },
  { value: "o-imenu-sela-sebet", label: "O imenu sela Šebet" },
  { value: "ostalo", label: "Ostalo" },
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

interface AIResource {
  name: string;
  content: string;
  type: string;
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
  const [roleCheck, setRoleCheck] = useState<{
    checked: boolean;
    loading: boolean;
    hasPermission: boolean;
    role: string | null;
  }>({ checked: false, loading: false, hasPermission: false, role: null });
  const [aiResources, setAiResources] = useState<AIResource[]>([]);
  const [resourceUploading, setResourceUploading] = useState(false);
  const [urlResourceInput, setUrlResourceInput] = useState("");
  const [urlResourceLoading, setUrlResourceLoading] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [coverImageDialogOpen, setCoverImageDialogOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<{ id: string; title: string; image_url: string }[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [inlineUploading, setInlineUploading] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const resourceInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Load categories from database
  const { categories: dbCategories, loading: categoriesLoading } = useCategories();
  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES;

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    }
    // Auto-check role on mount
    checkUserRole();
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

  const checkUserRole = async () => {
    if (!user) {
      setRoleCheck({ checked: true, loading: false, hasPermission: false, role: null });
      return;
    }

    setRoleCheck((prev) => ({ ...prev, loading: true }));

    try {
      // Check for admin role
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });

      if (isAdmin) {
        setRoleCheck({ checked: true, loading: false, hasPermission: true, role: "admin" });
        return;
      }

      // Check for author role
      const { data: isAuthor } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "author",
      });

      if (isAuthor) {
        setRoleCheck({ checked: true, loading: false, hasPermission: true, role: "author" });
        return;
      }

      // No valid role
      setRoleCheck({ checked: true, loading: false, hasPermission: false, role: null });
    } catch (error) {
      console.error("Role check error:", error);
      setRoleCheck({ checked: true, loading: false, hasPermission: false, role: null });
    }
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

  const handleResourceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setResourceUploading(true);

    const newResources: AIResource[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type - only text-based files
      const allowedTypes = [
        'text/plain',
        'text/markdown',
        'text/html',
        'text/csv',
        'application/json',
        'application/xml',
        'text/xml',
        'application/pdf',
      ];
      
      const allowedExtensions = ['.txt', '.md', '.html', '.csv', '.json', '.xml', '.doc', '.rtf', '.pdf'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        toast({
          variant: "destructive",
          title: "Nepodržan format",
          description: `Fajl "${file.name}" nije podržan. Koristite txt, md, html, csv, json, xml ili pdf.`,
        });
        continue;
      }

      // Validate file size (max 5MB for PDF, 1MB for others)
      const maxSize = fileExtension === '.pdf' ? 5 * 1024 * 1024 : 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "Prevelik fajl",
          description: `Fajl "${file.name}" je veći od ${fileExtension === '.pdf' ? '5MB' : '1MB'}.`,
        });
        continue;
      }

      try {
        // Handle PDF files differently
        if (fileExtension === '.pdf' || file.type === 'application/pdf') {
          // Convert PDF to base64 and send to edge function for parsing
          const arrayBuffer = await file.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          
          const { data: pdfData, error: pdfError } = await supabase.functions.invoke(
            "parse-pdf",
            {
              body: {
                pdfBase64: base64,
                fileName: file.name,
              },
            }
          );
          
          if (pdfError) {
            throw new Error(pdfError.message || "Greška pri parsiranju PDF-a");
          }
          
          if (pdfData?.content) {
            newResources.push({
              name: file.name,
              content: pdfData.content,
              type: 'application/pdf',
            });
          } else {
            throw new Error("PDF nije vratio sadržaj");
          }
        } else {
          // Handle text-based files normally
          const content = await file.text();
          newResources.push({
            name: file.name,
            content: content.slice(0, 50000),
            type: file.type || 'text/plain',
          });
        }
      } catch (error) {
        console.error("Error reading file:", file.name, error);
        toast({
          variant: "destructive",
          title: "Greška pri čitanju",
          description: `Nije moguće pročitati fajl "${file.name}".`,
        });
      }
    }

    if (newResources.length > 0) {
      setAiResources((prev) => [...prev, ...newResources]);
      toast({
        title: "Resursi dodati",
        description: `Dodato ${newResources.length} resurs(a) za AI.`,
      });
    }

    setResourceUploading(false);
    if (resourceInputRef.current) {
      resourceInputRef.current.value = "";
    }
  };

  const handleRemoveResource = (index: number) => {
    setAiResources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddUrlResource = async () => {
    const url = urlResourceInput.trim();
    if (!url) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Unesite URL adresu.",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        variant: "destructive",
        title: "Neispravan URL",
        description: "Unesite validnu URL adresu (npr. https://example.com).",
      });
      return;
    }

    setUrlResourceLoading(true);

    try {
      // Add URL as a resource - the edge function will fetch the content
      const urlResource: AIResource = {
        name: url,
        content: `[URL Resource] ${url}`,
        type: 'url',
      };
      
      setAiResources((prev) => [...prev, urlResource]);
      setUrlResourceInput("");
      
      toast({
        title: "URL dodat",
        description: "URL resurs je dodat za AI asistenta.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće dodati URL resurs.",
      });
    } finally {
      setUrlResourceLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    setGalleryLoading(true);
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, title, image_url")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGalleryImages(data);
    }
    setGalleryLoading(false);
  };

  const handleOpenImageDialog = () => {
    setImageDialogOpen(true);
    if (galleryImages.length === 0) {
      fetchGalleryImages();
    }
  };

  const handleOpenCoverImageDialog = () => {
    setCoverImageDialogOpen(true);
    if (galleryImages.length === 0) {
      fetchGalleryImages();
    }
  };

  const selectCoverImageFromGallery = (imageUrl: string) => {
    setForm((prev) => ({ ...prev, cover_image: imageUrl }));
    setCoverImageDialogOpen(false);
    toast({
      title: "Slika izabrana",
      description: "Naslovna slika je postavljena iz galerije.",
    });
  };

  const insertImageAtCursor = (imageUrl: string, altText: string) => {
    const markdown = `\n![${altText}](${imageUrl})\n`;
    const textarea = contentTextareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = form.content.substring(0, start) + markdown + form.content.substring(end);
      setForm((prev) => ({ ...prev, content: newContent }));
      
      // Set cursor position after inserted image
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + markdown.length, start + markdown.length);
      }, 0);
    } else {
      setForm((prev) => ({ ...prev, content: prev.content + markdown }));
    }
    
    setImageDialogOpen(false);
    toast({
      title: "Slika ubačena",
      description: "Slika je dodata u tekst članka.",
    });
  };

  const handleInlineImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Možete uploadovati samo slike.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Maksimalna veličina slike je 5MB.",
      });
      return;
    }

    setInlineUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `inline/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(filePath);

      insertImageAtCursor(urlData.publicUrl, file.name.replace(/\.[^/.]+$/, ""));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Greška pri uploadu",
        description: error.message || "Pokušajte ponovo.",
      });
    } finally {
      setInlineUploading(false);
      if (inlineImageInputRef.current) {
        inlineImageInputRef.current.value = "";
      }
    }
  };

  const insertVideoAtCursor = (videoSrc: string, title?: string) => {
    // Use HTML video tag for direct embedding
    const videoHtml = `\n<video controls src="${videoSrc}" title="${title || 'Video'}"></video>\n`;
    const textarea = contentTextareaRef.current;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = form.content.substring(0, start) + videoHtml + form.content.substring(end);
      setForm((prev) => ({ ...prev, content: newContent }));
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + videoHtml.length, start + videoHtml.length);
      }, 0);
    } else {
      setForm((prev) => ({ ...prev, content: prev.content + videoHtml }));
    }
    
    setVideoDialogOpen(false);
    setVideoUrl("");
    toast({
      title: "Video ubačen",
      description: "Video je dodat u tekst članka.",
    });
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Podržani formati: MP4, WebM, OGG, MOV",
      });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Maksimalna veličina videa je 100MB.",
      });
      return;
    }

    setVideoUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(filePath);

      insertVideoAtCursor(urlData.publicUrl, file.name.replace(/\.[^/.]+$/, ""));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Greška pri uploadu",
        description: error.message || "Pokušajte ponovo.",
      });
    } finally {
      setVideoUploading(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
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
            resources: aiResources.length > 0 ? aiResources : undefined,
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
            {/* Role indicator badge */}
            {roleCheck.checked && (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  roleCheck.hasPermission
                    ? "bg-green-500/20 text-green-600 border border-green-500/30"
                    : "bg-destructive/20 text-destructive border border-destructive/30"
                }`}
              >
                {roleCheck.hasPermission ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : (
                  <ShieldX className="h-3 w-3" />
                )}
                {roleCheck.hasPermission ? roleCheck.role : "Bez dozvole"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Role check button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={checkUserRole}
              disabled={roleCheck.loading}
              className="group"
            >
              <ShieldAlert
                className={`h-4 w-4 mr-2 transition-transform duration-500 ${
                  roleCheck.loading ? "animate-spin" : "group-hover:rotate-12"
                }`}
              />
              {roleCheck.loading ? "Provera..." : "Proveri uloge"}
            </Button>
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
          {/* Role Check Alert */}
          {roleCheck.checked && !roleCheck.hasPermission && (
            <Alert variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertTitle>Nemate dozvolu</AlertTitle>
              <AlertDescription>
                Nemate ulogu admin ili author. Kontaktirajte administratora za pristup.
              </AlertDescription>
            </Alert>
          )}

          {roleCheck.checked && roleCheck.hasPermission && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Uloga potvrđena</AlertTitle>
              <AlertDescription className="text-green-600/80">
                Vaša uloga: <span className="font-semibold capitalize">{roleCheck.role}</span>. Imate dozvolu za uređivanje članaka.
              </AlertDescription>
            </Alert>
          )}

          {!roleCheck.checked && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkUserRole}
                disabled={roleCheck.loading}
              >
                {roleCheck.loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ShieldAlert className="h-4 w-4 mr-2" />
                )}
                Proveri dozvole
              </Button>
            </div>
          )}
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
                      {categories.map((cat) => (
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
                  <Dialog open={coverImageDialogOpen} onOpenChange={setCoverImageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleOpenCoverImageDialog}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Iz galerije
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>Izaberite naslovnu sliku iz galerije</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] pr-4">
                        {galleryLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : galleryImages.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            Nema slika u galeriji.
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            {galleryImages.map((img) => (
                              <div
                                key={img.id}
                                onClick={() => selectCoverImageFromGallery(img.image_url)}
                                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors group"
                              >
                                <img
                                  src={img.image_url}
                                  alt={img.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">{img.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                  <span className="text-xs text-muted-foreground">ili</span>
                  <Input
                    id="cover_image"
                    value={form.cover_image}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, cover_image: e.target.value }))
                    }
                    placeholder="Unesite URL slike"
                    className="bg-background text-sm flex-1"
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
            <CardContent className="space-y-4">
              {/* AI Resources Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Resursi za AI (opciono)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Dodajte fajlove ili URL adrese kao izvore informacija za AI.
                </p>
                
                <input
                  ref={resourceInputRef}
                  type="file"
                  accept=".txt,.md,.html,.csv,.json,.xml,.doc,.rtf,.pdf"
                  multiple
                  onChange={handleResourceUpload}
                  className="hidden"
                />
                
                {/* File and URL resource buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => resourceInputRef.current?.click()}
                    disabled={resourceUploading}
                    className="border-dashed"
                  >
                    {resourceUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Dodaj fajlove
                  </Button>
                </div>

                {/* URL Resource Input */}
                <div className="flex gap-2">
                  <Input
                    value={urlResourceInput}
                    onChange={(e) => setUrlResourceInput(e.target.value)}
                    placeholder="https://example.com/article"
                    className="flex-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrlResource();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddUrlResource}
                    disabled={urlResourceLoading || !urlResourceInput.trim()}
                  >
                    {urlResourceLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {aiResources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiResources.map((resource, index) => (
                      <div
                        key={index}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          resource.type === 'url' 
                            ? 'bg-accent/10 text-accent-foreground border-accent/20' 
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}
                      >
                        {resource.type === 'url' ? (
                          <LinkIcon className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        <span className="max-w-[150px] truncate">{resource.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(index)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* AI Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
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
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg">Sadržaj *</CardTitle>
              <div className="flex gap-2">
                {/* Video Dialog */}
                <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Ubaci video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ubaci video u tekst</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload MP4</TabsTrigger>
                        <TabsTrigger value="url">URL / YouTube</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upload" className="mt-4">
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                        <div
                          onClick={() => !videoUploading && videoInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          {videoUploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Uploadovanje...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Video className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Kliknite da uploadujete video
                              </p>
                              <p className="text-xs text-muted-foreground">
                                MP4, WebM, OGG do 100MB
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="url" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Video URL</Label>
                          <Input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://example.com/video.mp4 ili YouTube link"
                          />
                          <p className="text-xs text-muted-foreground">
                            Podržani: MP4 linkovi, YouTube, Vimeo
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            if (videoUrl.trim()) {
                              insertVideoAtCursor(videoUrl.trim());
                            }
                          }}
                          disabled={!videoUrl.trim()}
                          className="w-full"
                        >
                          Ubaci video
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                {/* Image Dialog */}
                <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenImageDialog}
                      className="gap-2"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Ubaci sliku
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ubaci sliku u tekst</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="gallery" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="gallery">Iz galerije</TabsTrigger>
                      <TabsTrigger value="upload">Upload nove</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gallery" className="mt-4">
                      {galleryLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : galleryImages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Nema slika u galeriji</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[300px]">
                          <div className="grid grid-cols-3 gap-2 p-1">
                            {galleryImages.map((img) => (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => insertImageAtCursor(img.image_url, img.title)}
                                className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors group"
                              >
                                <img
                                  src={img.image_url}
                                  alt={img.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-xs font-medium text-center px-2 line-clamp-2">
                                    {img.title}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                      <input
                        ref={inlineImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInlineImageUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => !inlineUploading && inlineImageInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      >
                        {inlineUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Uploadovanje...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Kliknite da uploadujete sliku
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, WebP do 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={contentTextareaRef}
                value={form.content}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="Napišite sadržaj članka..."
                className="bg-background resize-none min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Podržava Markdown formatiranje. Slike: ![opis](url), Video: &lt;video src="url"&gt;&lt;/video&gt;
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
