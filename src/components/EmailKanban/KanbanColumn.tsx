import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { MoreVertical } from "lucide-react";
import { Menu } from "@headlessui/react";
import KanbanItem from "./KanbanItem";
import Swal from "sweetalert2";

interface Email {
  id: number;
  subject: string;
  sender: string;
  body: string;
  status: string;
  created_at: string;
  summary: string;
  urgent_text: string | null;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  emails: Email[];
  onEdit?: () => void;
  onDelete?: () => void;
  onEmailClick: (email: Email) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  emails,
  onEdit,
  onDelete,
  onEmailClick,
}) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed && onDelete) {
      onDelete();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 bg-gray-50 rounded-lg shadow-sm"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {title}
          <span className="ml-2 text-sm text-gray-500">({emails.length})</span>
        </h3>

        {id !== "uncategorized" && (
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onEdit}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                    >
                      Edit Category
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block px-4 py-2 text-sm text-red-600 w-full text-left`}
                    >
                      Delete Category
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        )}
      </div>

      <div className="p-4 space-y-4">
        {emails.map((email) => (
          <KanbanItem
            key={email.id}
            email={email}
            onClick={() => onEmailClick(email)}
          />
        ))}

        {emails.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No emails in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
