import React, { useState, useEffect } from "react";
import {
  Search,
  Trash,
  Archive,
  Star,
  Tag,
  Filter,
  RefreshCw,
  MailOpen,
  Plus,
} from "lucide-react";
import { emailApi, emailCategoryApi } from "../services/api";
import TestEmailModal from "../components/TestEmailModal";

interface Email {
  id: number;
  subject: string;
  sender: string;
  body: string;
  status: string;
  category?: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

const EmailInbox: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);

  useEffect(() => {
    fetchEmails();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [searchQuery, selectedCategory]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category_id = selectedCategory;

      const response = await emailApi.getAll(params);
      setEmails(response.data);
    } catch (err) {
      console.error("Failed to fetch emails", err);
      setError("Failed to load emails. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await emailCategoryApi.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleEmailClick = async (email: Email) => {
    try {
      const response = await emailApi.getById(email.id);
      setSelectedEmail(response.data);
      setShowEmailDetail(true);

      // Update status to read if not already
      if (email.status !== "read") {
        await emailApi.update(email.id, { status: "read" });
        fetchEmails(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to fetch email details", err);
    }
  };

  const handleDelete = async (emailId: number) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      await emailApi.delete(emailId);
      setEmails(emails.filter((email) => email.id !== emailId));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
        setShowEmailDetail(false);
      }
    } catch (err) {
      console.error("Failed to delete email", err);
    }
  };

  const handleArchive = async (emailId: number) => {
    try {
      await emailApi.update(emailId, { status: "archived" });
      fetchEmails();
    } catch (err) {
      console.error("Failed to archive email", err);
    }
  };

  const handleCategoryChange = async (emailId: number, categoryId: number) => {
    try {
      await emailApi.update(emailId, { category: categoryId });
      fetchEmails();
    } catch (err) {
      console.error("Failed to update email category", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full bg-white rounded-lg shadow">
      {/* Email header */}
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>

          <div className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center gap-4">
            <button
              onClick={() => setIsTestEmailModalOpen(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Test Email
            </button>

            <div className="relative rounded-md w-full sm:w-64 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={fetchEmails}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">{emails.length} messages</div>
        </div>
      </div>

      {/* Email content */}
      <div className="relative h-[calc(100vh-13rem)]">
        {/* Email list */}
        <div
          className={`overflow-y-auto h-full ${
            showEmailDetail ? "hidden md:block md:w-1/3" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : emails.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No emails found</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {emails.map((email) => (
                <li
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    email.status !== "read" ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center">
                        <p
                          className={`text-sm font-medium ${
                            email.status !== "read"
                              ? "text-gray-900 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {email.sender}
                        </p>
                      </div>

                      <p
                        className={`mt-1 text-sm ${
                          email.status !== "read"
                            ? "text-gray-900 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {email.subject}
                      </p>

                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {email.body.substring(0, 100)}
                        {email.body.length > 100 ? "..." : ""}
                      </p>
                    </div>

                    <div className="ml-3 flex-shrink-0 flex flex-col items-end">
                      <span className="text-xs text-gray-500">
                        {formatDate(email.created_at)}
                      </span>

                      {email.status !== "read" && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Email detail view */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-white md:static md:w-2/3 transition-all transform ${
            showEmailDetail
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0 hidden md:block"
          }`}
        >
          {selectedEmail ? (
            <div className="h-full flex flex-col border-l border-gray-200">
              <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setShowEmailDetail(false)}
                  className="md:hidden text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleArchive(selectedEmail.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEmail.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  <select
                    onChange={(e) =>
                      handleCategoryChange(
                        selectedEmail.id,
                        Number(e.target.value)
                      )
                    }
                    value={selectedEmail.category || ""}
                    className="text-sm border-gray-300 rounded-md"
                  >
                    <option value="">No Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedEmail.subject}
                    </h2>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedEmail.sender}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedEmail.created_at)}
                  </p>
                </div>

                <div className="mt-6 prose max-w-none">
                  {selectedEmail.body.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="my-4 text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MailOpen className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2">Select an email to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <TestEmailModal
        isOpen={isTestEmailModalOpen}
        onClose={() => setIsTestEmailModalOpen(false)}
        onSuccess={fetchEmails}
      />
    </div>
  );
};

export default EmailInbox;
