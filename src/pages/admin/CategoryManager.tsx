import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, Category } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Home,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Tag,
  Edit,
  Lock,
} from "lucide-react";

const CategoryManager = () => {
  const { categories, loading, addCategory, deleteCategory, updateCategory } = useCategories();
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();

  const generateSlug = (text: string) => {
    return text
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

  const handleLabelChange = (label: string) => {
    setNewLabel(label);
    setNewValue(generateSlug(label));
  };

  const handleEditLabelChange = (label: string) => {
    setEditLabel(label);
    setEditValue(generateSlug(label));
  };

  const handleAdd = async () => {
    if (!newLabel.trim() || !newValue.trim()) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Unesite naziv kategorije.",
      });
      return;
    }

    // Check for duplicates
    if (categories.some((c) => c.value === newValue)) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Kategorija sa ovim slugom već postoji.",
      });
      return;
    }

    setAdding(true);
    const result = await addCategory(newValue, newLabel);

    if (result.success) {
      toast({
        title: "Kategorija dodana",
        description: `Kategorija "${newLabel}" je uspešno kreirana.`,
      });
      setNewLabel("");
      setNewValue("");
    } else {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće dodati kategoriju.",
      });
    }
    setAdding(false);
  };

  const handleDelete = async (category: Category) => {
    const result = await deleteCategory(category.id);

    if (result.success) {
      toast({
        title: "Kategorija obrisana",
        description: `Kategorija "${category.label}" je obrisana.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće obrisati kategoriju.",
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditCategory(category);
    setEditValue(category.value);
    setEditLabel(category.label);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editCategory || !editLabel.trim() || !editValue.trim()) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Unesite naziv kategorije.",
      });
      return;
    }

    // Check for duplicates (excluding current)
    if (categories.some((c) => c.value === editValue && c.id !== editCategory.id)) {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Kategorija sa ovim slugom već postoji.",
      });
      return;
    }

    setUpdating(true);
    const result = await updateCategory(editCategory.id, editValue, editLabel);

    if (result.success) {
      toast({
        title: "Kategorija ažurirana",
        description: `Kategorija je uspešno ažurirana.`,
      });
      setEditDialogOpen(false);
      setEditCategory(null);
    } else {
      toast({
        variant: "destructive",
        title: "Greška",
        description: "Nije moguće ažurirati kategoriju.",
      });
    }
    setUpdating(false);
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
            <h1 className="text-xl font-bold text-gradient-primary">Kategorije</h1>
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Add Category Form */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Dodaj novu kategoriju
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Naziv</Label>
                <Input
                  id="label"
                  value={newLabel}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="npr. Priroda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Slug (URL)</Label>
                <Input
                  id="value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="npr. priroda"
                />
              </div>
            </div>
            <Button
              onClick={handleAdd}
              disabled={adding || !newLabel.trim()}
              className="mt-4"
            >
              {adding ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Dodaj kategoriju
            </Button>
          </CardContent>
        </Card>

        {/* Categories List */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Sve kategorije ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <Card className="border-border/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nema kategorija</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <Card key={category.id} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{category.label}</p>
                      <p className="text-sm text-muted-foreground">
                        /{category.value}
                      </p>
                    </div>
                    {category.is_default && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Podrazumevana
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!category.is_default && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Obrisati kategoriju?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ova akcija se ne može poništiti. Kategorija "{category.label}" će biti trajno obrisana.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Otkaži</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Obriši
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Uredi kategoriju</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-label">Naziv</Label>
                <Input
                  id="edit-label"
                  value={editLabel}
                  onChange={(e) => handleEditLabelChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Slug (URL)</Label>
                <Input
                  id="edit-value"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Otkaži
              </Button>
              <Button onClick={handleUpdate} disabled={updating}>
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sačuvaj
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CategoryManager;
