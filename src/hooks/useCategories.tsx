import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  value: string;
  label: string;
  is_default: boolean;
  created_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("label", { ascending: true });

    if (!error && data) {
      setCategories(data as Category[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (value: string, label: string) => {
    const { data, error } = await supabase
      .from("categories")
      .insert({ value, label, is_default: false })
      .select()
      .single();

    if (!error && data) {
      setCategories((prev) => [...prev, data as Category].sort((a, b) => a.label.localeCompare(b.label)));
      return { success: true, data };
    }
    return { success: false, error };
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    }
    return { success: false, error };
  };

  const updateCategory = async (id: string, value: string, label: string) => {
    const { data, error } = await supabase
      .from("categories")
      .update({ value, label })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? (data as Category) : c)).sort((a, b) => a.label.localeCompare(b.label))
      );
      return { success: true, data };
    }
    return { success: false, error };
  };

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
  };
};
