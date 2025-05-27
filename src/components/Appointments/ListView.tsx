import React from "react";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  MapPin,
  CalendarIcon,
  Edit2,
  Eye,
  Trash2,
} from "lucide-react";

interface Appointment {
  id: number;
  name: string;
  email_address: string | null;
  phone: string | null;
  appointment_datetime: string;
  appointment_type: string | null;
  appointment_location: string | null;
  status: string;
}

interface ListViewProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onView: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
  getStatusColor: (status: string) => string;
}

const ListView: React.FC<ListViewProps> = ({
  appointments,
  onEdit,
  onView,
  onDelete,
  getStatusColor,
}) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col\"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date & Time (UTC)
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {appointment.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex flex-col">
                  {appointment.email_address && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-1" />
                      {appointment.email_address}
                    </div>
                  )}
                  {appointment.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-1" />
                      {appointment.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                  {appointment.appointment_datetime.slice(0, -1)} UTC
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {appointment.appointment_type || "-"}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {appointment.appointment_location ? (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    {appointment.appointment_location}
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onView(appointment)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(appointment)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
