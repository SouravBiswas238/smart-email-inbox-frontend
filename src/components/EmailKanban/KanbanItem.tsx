import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Mail } from "lucide-react";

interface Email {
  id: number;
  subject: string;
  sender: string;
  body: string;
  status: string;
  summary: string;
  created_at: string;
  urgent_text: string | null;
}

interface KanbanItemProps {
  email: Email;
}

const KanbanItem: React.FC<KanbanItemProps> = ({ email }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: email.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow p-4 cursor-move ${
        isDragging ? "opacity-50" : ""
      } ${email.status !== "read" ? "border-l-4 border-blue-500" : ""} ${
        email.urgent_text ? "border-l-4 border-red-500" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {email.subject}
          </p>
          <p className="text-sm text-gray-500 truncate">{email.sender}</p>
          {email.summary && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {email.summary}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {formatDate(email.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KanbanItem;
