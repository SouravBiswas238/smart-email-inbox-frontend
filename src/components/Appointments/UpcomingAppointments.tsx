import React from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, MapPin } from 'lucide-react';

interface Appointment {
  id: number;
  name: string;
  appointment_datetime: string;
  appointment_location: string | null;
  status: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  getStatusColor
}) => {
  return (
    <div className="w-80 border-l border-gray-200 p-6 overflow-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
      <div className="space-y-4">
        {appointments.map(appointment => (
          <div
            key={appointment.id}
            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <h3 className="font-medium text-gray-900">{appointment.name}</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {format(parseISO(appointment.appointment_datetime), 'PPpp')}
              </div>
              {appointment.appointment_location && (
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {appointment.appointment_location}
                </div>
              )}
            </div>
            <div className="mt-2">
              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No upcoming appointments
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;