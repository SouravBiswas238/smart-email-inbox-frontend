import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

interface Category {
  id?: number;
  name: string;
  description: string;
  instructions?: string;
  target_emails?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Category) => void;
  category?: Category;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Category>({
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      target_emails: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset(category);
    } else {
      reset({
        name: "",
        description: "",
        instructions: "",
        target_emails: "",
      });
    }
  }, [category, reset]);

  const onSubmit = (data: Category) => {
    // Clean up target emails - remove any extra spaces and empty entries
    const cleanedEmails = data.target_emails
      ? data.target_emails
          .split(",")
          .map((email) => email.trim())
          .filter((email) => email)
          .join(",")
      : "";

    onSave({
      ...data,
      target_emails: cleanedEmails,
    });
    reset();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
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
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      {category ? "Edit Category" : "Create New Category"}
                    </Dialog.Title>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-6 space-y-6"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Category Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...register("name", {
                            required: "Category name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.name
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          {...register("description", {
                            required: "Description is required",
                            minLength: {
                              value: 10,
                              message:
                                "Description must be at least 10 characters",
                            },
                          })}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.description
                              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="target_emails"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Target Emails (comma-separated)
                        </label>
                        <input
                          type="text"
                          id="target_emails"
                          {...register("target_emails")}
                          placeholder="email1@example.com, email2@example.com"
                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Enter multiple email addresses separated by commas
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="instructions"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Instructions (Optional)
                        </label>
                        <textarea
                          id="instructions"
                          rows={3}
                          {...register("instructions")}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                          {category ? "Save Changes" : "Create Category"}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => {
                            onClose();
                            reset();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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

export default CategoryModal;
