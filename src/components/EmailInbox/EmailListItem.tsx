import React from "react";
import { Mail, AlertTriangle } from "lucide-react";

interface EmailListItemProps {
  email: {
    id: number;
    subject: string;
    sender: string;
    body: string;
    status: string;
    urgent_text: string | null;
    summary: string;
    created_at: string;
    category: {
      id: number;
      name: string;
    } | null;
  };
  onClick: () => void;
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, onClick }) => {
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
    <div
      onClick={onClick}
      className={`px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors bg-blue-50  ${
        email.urgent_text ? "border-l-4  !border-l-red-500 " : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Mail
              className={`h-5 w-5 ${
                email.status !== "processing"
                  ? "text-blue-500"
                  : "text-gray-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                email?.status !== "processing"
                  ? "text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {email?.sender}
              {/* if status is processing show a loading  */}
              {email?.status === "processing" && (
                <span className="ml-2 animate-spin inline-block h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></span>
              )}
            </p>
            {email?.urgent_text && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                <AlertTriangle className="h-3 w-3" />
                Urgent
              </span>
            )}
          </div>

          <p
            className={`mt-1 text-sm ${
              email?.status !== "read"
                ? "text-gray-900 font-semibold"
                : "text-gray-600"
            }`}
          >
            {email?.subject}
          </p>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {email?.summary || email?.body}
          </p>

          <div className="mt-2 flex items-center gap-2">
            {email?.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {email?.category?.name}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatDate(email?.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailListItem;
