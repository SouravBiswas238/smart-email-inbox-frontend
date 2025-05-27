import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Mail, ChevronDown, ChevronRight } from "lucide-react";
import { emailApi } from "../../services/api";

interface Category {
  id: number;
  name: string;
  description: string;
  instructions?: string;
  email_count?: number;
}

interface Email {
  id: number;
  subject: string;
  sender: string;
  body: string;
  status: string;
  created_at: string;
  urgent_text: string | null;
  summary: string;
}

interface ListViewProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const ListView: React.FC<ListViewProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [categoryEmails, setCategoryEmails] = useState<Record<number, Email[]>>(
    {}
  );
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const toggleCategory = async (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(
        expandedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
      if (!categoryEmails[categoryId]) {
        await fetchEmailsForCategory(categoryId);
      }
    }
  };

  const fetchEmailsForCategory = async (categoryId: number) => {
    setLoading((prev) => ({ ...prev, [categoryId]: true }));
    try {
      const response = await emailApi.getAll({ category_id: categoryId });
      setCategoryEmails((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (error) {
      console.error("Failed to fetch emails for category:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Emails
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Instructions
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="flex items-center"
                        >
                          {expandedCategories.includes(category.id) ? (
                            <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          {category.name}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {category.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {categoryEmails[category.id]?.length || 0}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {category.instructions || "-"}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => onEdit(category)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedCategories.includes(category.id) && (
                      <tr>
                        <td colSpan={5} className="px-4 py-2 bg-gray-50">
                          {loading[category.id] ? (
                            <div className="flex justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                          ) : categoryEmails[category.id]?.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              No emails in this category
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-200">
                              {categoryEmails[category.id]?.map((email) => (
                                <div
                                  key={email.id}
                                  className={`px-4 py-3 ${
                                    email.status !== "read" ? "bg-blue-50" : ""
                                  } ${
                                    email.urgent_text
                                      ? "border-l-4 border-red-500"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {email.subject}
                                      </h4>
                                      <p className="text-sm text-gray-500">
                                        {email.sender}
                                      </p>
                                      {email.summary && (
                                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                          {email.summary}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatDate(email.created_at)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;
