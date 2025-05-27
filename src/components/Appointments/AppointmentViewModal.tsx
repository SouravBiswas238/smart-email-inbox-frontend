import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, User, Mail, Phone, Calendar, MapPin, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";

interface AppointmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: number;
    name: string;
    email_address: string | null;
    phone: string | null;
    appointment_datetime: string;
    appointment_type: string | null;
    appointment_location: string | null;
    appointment_notes: string | null;
    status: string;
  } | null;
}

const AppointmentViewModal: React.FC<AppointmentViewModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  if (!appointment) return null;

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                      className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                    >
                      Appointment Details
                    </Dialog.Title>

                    <div className="mt-4 space-y-6">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Name
                          </p>
                          <p className="text-base text-gray-900">
                            {appointment.name}
                          </p>
                        </div>
                      </div>

                      {appointment.email_address && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Email
                            </p>
                            <p className="text-base text-gray-900">
                              {appointment.email_address}
                            </p>
                          </div>
                        </div>
                      )}

                      {appointment.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Phone
                            </p>
                            <p className="text-base text-gray-900">
                              {appointment.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Date & Time
                          </p>
                          <p className="text-base text-gray-900">
                            {format(
                              parseISO(appointment.appointment_datetime),
                              "PPpp"
                            )}
                          </p>
                        </div>
                      </div>

                      {appointment.appointment_type && (
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Type
                            </p>
                            <p className="text-base text-gray-900">
                              {appointment.appointment_type}
                            </p>
                          </div>
                        </div>
                      )}

                      {appointment.appointment_location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Location
                            </p>
                            <p className="text-base text-gray-900">
                              {appointment.appointment_location}
                            </p>
                          </div>
                        </div>
                      )}

                      {appointment.appointment_notes && (
                        <div className="mt-6">
                          <p className="text-sm font-medium text-gray-500 mb-2">
                            Notes
                          </p>
                          <p className="text-base text-gray-900 whitespace-pre-wrap">
                            {appointment.appointment_notes}
                          </p>
                        </div>
                      )}

                      <div className="mt-6">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                          Status
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
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

export default AppointmentViewModal;
