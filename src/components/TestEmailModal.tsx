import React, { useState } from "react";
import { X } from "lucide-react";
import { emailApi } from "../services/api";

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TestEmailModal: React.FC<TestEmailModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    subject: "",
    sender: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      subject: formData.subject,
      sender: {
        emailAddress: {
          address: formData.sender,
        },
      },
      body: {
        content: formData.body,
      },
      id: Math.random().toString(36).substring(2, 22),
    };

    try {
      await emailApi.createTest(payload);
      onSuccess();
      onClose();
      setFormData({ subject: "", sender: "", body: "" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create test email");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Create Test Email
              </h3>

              {error && (
                <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sender
                    </label>
                    <input
                      type="email"
                      name="sender"
                      id="sender"
                      value={formData.sender}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="body"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message Body
                    </label>
                    <textarea
                      name="body"
                      id="body"
                      rows={4}
                      value={formData.body}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Test Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEmailModal;
