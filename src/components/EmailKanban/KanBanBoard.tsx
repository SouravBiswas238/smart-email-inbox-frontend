import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'react-hot-toast';
import { emailApi, emailCategoryApi } from '../../services/api';
import KanbanColumn from './KanbanColumn';
import EmailDetailModal from '../EmailInbox/EmailDetailModal';

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
  reply_draft: Array<{
    id: number;
    reply_subject: string;
    reply_body: string;
    created_at: string;
  }>;
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

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditCategory, onDeleteCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, emailsResponse] = await Promise.all([
        emailCategoryApi.getAll(),
        emailApi.getAll()
      ]);
      setCategories(categoriesResponse.data);
      setEmails(emailsResponse.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const emailId = parseInt(active.id.toString());
    const newCategoryId = parseInt(over.id.toString());

    try {
      await emailApi.update(emailId, { category: newCategoryId });
      
      setEmails(emails.map(email => 
        email.id === emailId 
          ? { ...email, category: categories.find(c => c.id === newCategoryId) || null }
          : email
      ));
      
      toast.success('Email moved successfully');
    } catch (err) {
      console.error('Failed to update email category:', err);
      toast.error('Failed to move email');
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">{error}</div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto p-6 min-h-[calc(100vh-200px)]">
          <KanbanColumn
            key="uncategorized"
            id="uncategorized"
            title="Uncategorized"
            emails={emails.filter(email => !email.category)}
            onEmailClick={handleEmailClick}
          />
          {categories?.map(category => (
            <KanbanColumn
              key={category.id}
              id={category.id.toString()}
              title={category.name}
              emails={emails.filter(email => email.category?.id === category.id)}
              onEdit={() => onEditCategory?.(category)}
              onDelete={() => onDeleteCategory?.(category.id)}
              onEmailClick={handleEmailClick}
            />
          ))}
        </div>
      </DndContext>

      <EmailDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        email={selectedEmail}
      />
    </>
  );
};

export default KanbanBoard;