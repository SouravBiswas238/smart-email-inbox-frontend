import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Mail, Clock, Tag, AlertTriangle } from 'lucide-react';

interface EmailDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
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
      description: string;
    } | null;
    reply_draft: Array<{
      id: number;
      reply_subject: string;
      reply_body: string;
      created_at: string;
    }>;
  } | null;
}

const EmailDetailModal: React.FC<EmailDetailModalProps> = ({ isOpen, onClose, email }) => {
  if (!email) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    {/* Email Header */}
                    <div className="border-b border-gray-200 pb-4">
                      <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 mb-2">
                        {email.subject}
                      </Dialog.Title>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{email.sender}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(email.created_at)}</span>
                        </div>
                        {email.category && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            <span>{email.category.name}</span>
                          </div>
                        )}
                      </div>

                      {email.urgent_text && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-md">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">{email.urgent_text}</span>
                        </div>
                      )}
                    </div>

                    {/* Email Content */}
                    <div className="mt-4 space-y-4">
                      {/* Summary */}
                      {email.summary && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Summary</h4>
                          <p className="text-sm text-gray-600">{email.summary}</p>
                        </div>
                      )}

                      {/* Body */}
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700">
                          {email.body}
                        </div>
                      </div>

                      {/* Reply Drafts */}
                      {email.reply_draft && email.reply_draft.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Reply Drafts</h4>
                          <div className="space-y-4">
                            {email.reply_draft.map(draft => (
                              <div key={draft.id} className="bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-900">
                                    {draft.reply_subject}
                                  </h5>
                                  <span className="text-xs text-gray-500">
                                    {new Date(draft.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                  {draft.reply_body}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmailDetailModal;