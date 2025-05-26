import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { toast } from "react-hot-toast";
import { emailApi, emailCategoryApi } from "../../services/api";
import KanbanColumn from "./KanbanColumn";

interface Email {
  id: number;
  subject: string;
  sender: string;
  body: string;
  category: {
    id: number;
    name: string;
    description: string;
    instructions: string;
    created_at: string;
    updated_at: string;
  } | null;
  email_id: string;
  status: string;
  summary: string;
  created_at: string;
  updated_at: string;
  urgent_text: string | null;
}

interface Category {
  id: number;
  name: string;
  description: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

interface KanbanBoardProps {
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (id: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onEditCategory,
  onDeleteCategory,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, emailsResponse] = await Promise.all([
        emailCategoryApi.getAll(),
        emailApi.getAll(),
      ]);
      setCategories(categoriesResponse.data);
      setEmails(emailsResponse.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const emailId = parseInt(active.id.toString());
    const newCategoryId = parseInt(over.id.toString());
    if (isNaN(emailId) || isNaN(newCategoryId)) {
      toast.error("Invalid drag operation");
      return;
    }

    try {
      await emailApi.update(emailId, { category: newCategoryId });

      setEmails(
        emails.map((email) =>
          email.id === emailId
            ? {
                ...email,
                category:
                  categories.find((c) => c.id === newCategoryId) || null,
              }
            : email
        )
      );

      toast.success("Email moved successfully");
    } catch (err) {
      console.error("Failed to update email category:", err);
      toast.error("Failed to move email");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto p-6 min-h-[calc(100vh-200px)]">
        <KanbanColumn
          key="uncategorized"
          id="uncategorized"
          title="Uncategorized"
          emails={emails.filter((email) => !email.category)}
        />
        {categories.map((category) => (
          <KanbanColumn
            key={category.id}
            id={category.id.toString()}
            title={category.name}
            emails={emails.filter(
              (email) => email.category?.id === category.id
            )}
            onEdit={() => onEditCategory?.(category)}
            onDelete={() => onDeleteCategory?.(category.id)}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
