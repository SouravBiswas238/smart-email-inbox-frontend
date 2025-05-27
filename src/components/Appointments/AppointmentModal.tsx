import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

interface AppointmentFormData {
  name: string;
  email_address: string;
  phone: string;
  appointment_datetime: string;
  appointment_type: string;
  appointment_location: string;
  appointment_notes: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AppointmentFormData) => void;
  initialData?: {
    id: number;
    name: string;
    email_address: string | null;
    phone: string | null;
    appointment_datetime: string;
    appointment_type: string | null;
    appointment_location: string | null;
    appointment_notes: string | null;
    status: string;
  };
}

const appointmentTypes = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'check_up', label: 'Check-up' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'review', label: 'Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'other', label: 'Other' }
];

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AppointmentFormData>({
    defaultValues: initialData ? {
      name: initialData.name,
      email_address: initialData.email_address || '',
      phone: initialData.phone || '',
      appointment_datetime: format(new Date(initialData.appointment_datetime), "yyyy-MM-dd'T'HH:mm"),
      appointment_type: initialData.appointment_type || '',
      appointment_location: initialData.appointment_location || '',
      appointment_notes: initialData.appointment_notes || ''
    } : {
      name: '',
      email_address: '',
      phone: '',
      appointment_datetime: '',
      appointment_type: '',
      appointment_location: '',
      appointment_notes: ''
    }
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        email_address: initialData.email_address || '',
        phone: initialData.phone || '',
        appointment_datetime: format(new Date(initialData.appointment_datetime), "yyyy-MM-dd'T'HH:mm"),
        appointment_type: initialData.appointment_type || '',
        appointment_location: initialData.appointment_location || '',
        appointment_notes: initialData.appointment_notes || ''
      });
    } else {
      reset({
        name: '',
        email_address: '',
        phone: '',
        appointment_datetime: '',
        appointment_type: '',
        appointment_location: '',
        appointment_notes: ''
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: AppointmentFormData) => {
    onSave(data);
    reset();
  };

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
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {initialData ? 'Edit Appointment' : 'New Appointment'}
                    </Dialog.Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email_address"
                              {...register('email_address')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Phone
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              {...register('phone')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="appointment_datetime" className="block text-sm font-medium text-gray-700">
                            Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            id="appointment_datetime"
                            {...register('appointment_datetime', { required: 'Date and time are required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          />
                          {errors.appointment_datetime && (
                            <p className="mt-1 text-sm text-red-600">{errors.appointment_datetime.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="appointment_type" className="block text-sm font-medium text-gray-700">
                            Appointment Type
                          </label>
                          <select
                            id="appointment_type"
                            {...register('appointment_type', { required: 'Appointment type is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          >
                            <option value="">Select a type</option>
                            {appointmentTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          {errors.appointment_type && (
                            <p className="mt-1 text-sm text-red-600">{errors.appointment_type.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="appointment_location" className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            type="text"
                            id="appointment_location"
                            {...register('appointment_location')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          />
                        </div>

                        <div>
                          <label htmlFor="appointment_notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <textarea
                            id="appointment_notes"
                            rows={3}
                            {...register('appointment_notes')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          />
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        >
                          {initialData ? 'Save Changes' : 'Create Appointment'}
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

export default AppointmentModal;