import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";
import ListView from "./EmailCategories/ListView";
import { emailCategoryApi } from "../services/api";
import CategoryModal from "./EmailCategories/CategoryModal";
import KanbanBoard from "../components/EmailKanban/KanBanBoard";

interface Category {
  id: number;
  name: string;
  description: string;
  instructions?: string;
  email_count?: number;
}

const EmailCategories: React.FC = () => {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await emailCategoryApi.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await emailCategoryApi.delete(id);
        setCategories(categories.filter((cat) => cat.id !== id));
        toast.success("Category deleted successfully");
      } catch (err) {
        console.error("Failed to delete category:", err);
        toast.error("Failed to delete category");
      }
    }
  };

  const handleSaveCategory = async (categoryData: Omit<Category, "id">) => {
    try {
      if (editingCategory) {
        const response = await emailCategoryApi.update(
          editingCategory.id,
          categoryData
        );
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? response.data : cat
          )
        );
        toast.success("Category updated successfully");
      } else {
        const response = await emailCategoryApi.create(categoryData);
        setCategories([...categories, response.data]);
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save category:", err);
      toast.error("Failed to save category");
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow">
      <Toaster position="top-right" />

      {/* Categories header */}
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Email Categories
          </h1>

          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg shadow-sm">
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  view === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView("kanban")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  view === "kanban"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300"
                }`}
              >
                Kanban View
              </button>
            </div>

            <button
              onClick={handleCreateCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Category
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-700">
          {error}
        </div>
      )}

      {/* Categories content */}
      <div className="h-[calc(100vh-8rem)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : view === "kanban" ? (
          <KanbanBoard
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        ) : (
          <div className="p-6">
            <ListView
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default EmailCategories;
