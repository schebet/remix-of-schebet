import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
import {
  Home,
  LogOut,
  Upload,
  Trash2,
  Loader2,
  Image,
  ArrowLeft,
  X,
} from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

const CATEGORIES = ["Arhitektura", "Istorija", "Priroda", "Kultura", "Ostalo"];

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Ostalo");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće učitati slike.",
      });
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Greška",
          description: "Molimo izaberite sliku.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Greška",
          description: "Slika mora biti manja od 5MB.",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Unesite naslov i izaberite sliku.",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(fileName);

      // Insert into database
      const { error: dbError } = await supabase.from("gallery_images").insert({
        title: title.trim(),
        category,
        image_url: publicUrl,
        uploaded_by: user?.id,
      });

      if (dbError) throw dbError;

      toast({
        title: "Uspešno",
        description: "Slika je uspešno dodata u galeriju.",
      });

      // Reset form
      setTitle("");
      setCategory("Ostalo");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      fetchImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: error.message || "Došlo je do greške pri uploadu.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    try {
      // Extract filename from URL
      const urlParts = image.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage.from("gallery").remove([fileName]);

      // Delete from database
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      toast({
        title: "Obrisano",
        description: "Slika je uspešno obrisana.",
      });

      setImages(images.filter((img) => img.id !== image.id));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće obrisati sliku.",
      });
    }
  };

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
            <h1 className="text-xl font-bold text-gradient-primary">Galerija</h1>
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
        {/* Upload Form */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Dodaj novu fotografiju
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Naslov</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Unesite naslov slike"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Kategorija</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image">Fotografija (max 5MB)</Label>
                  <Input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || !title.trim()}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Učitavanje...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Dodaj u galeriju
                    </>
                  )}
                </Button>
              </div>
              
              {/* Preview */}
              <div className="flex items-center justify-center">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 rounded-lg object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Pregled slike</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Fotografije u galeriji ({images.length})</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : images.length === 0 ? (
          <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nema fotografija u galeriji</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden border-border/50 group">
                <div className="aspect-square relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Obrisati sliku?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ova akcija se ne može poništiti. Slika će biti trajno obrisana.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Otkaži</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(image)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Obriši
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium truncate text-sm">{image.title}</p>
                  <p className="text-xs text-muted-foreground">{image.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GalleryManager;