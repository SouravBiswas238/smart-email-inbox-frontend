import React from 'react';
import { format, parseISO, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, Edit2, Trash2, Eye } from 'lucide-react';

interface Appointment {
  id: number;
  name: string;
  appointment_datetime: string;
  appointment_location: string | null;
  appointment_type: string | null;
  status: string;
}

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointments: Appointment[];
  selectedDateAppointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
  onView: (appointment: Appointment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateChange,
  appointments,
  selectedDateAppointments,
  onEdit,
  onDelete,
  onView
}) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const hasAppointment = appointments.some(apt => 
        isSameDay(parseISO(apt.appointment_datetime), currentDate)
      );
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentDate,
        hasAppointment,
        isToday: isToday(currentDate)
      });
    }
    
    return days;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-medium text-gray-900 mx-4">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={() => onDateChange(new Date())}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((dayInfo, index) => (
            <button
              key={index}
              onClick={() => dayInfo.day && onDateChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayInfo.day))}
              disabled={!dayInfo.isCurrentMonth}
              className={`
                aspect-square p-2 relative flex flex-col items-center justify-center
                ${dayInfo.isCurrentMonth ? 'hover:bg-gray-100' : 'text-gray-300'}
                ${dayInfo.isToday ? 'bg-blue-50' : ''}
                ${isSameDay(selectedDate, dayInfo.date || new Date()) ? 'bg-blue-100' : ''}
                ${dayInfo.hasAppointment ? 'bg-green-50' : ''}
                rounded-lg
              `}
            >
              {dayInfo.day && (
                <>
                  <span className={`text-sm ${dayInfo.isToday ? 'font-bold text-blue-600' : ''}`}>
                    {dayInfo.day}
                  </span>
                  {dayInfo.hasAppointment && (
                    <div className="absolute bottom-1 w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Date Appointments */}
      {selectedDateAppointments.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Appointments for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-4">
            {selectedDateAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{appointment.name}</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.appointment_datetime.slice(11, 16)} UTC
                    {appointment.appointment_location && (
                      <>
                        <MapPin className="h-4 w-4 ml-3 mr-1" />
                        {appointment.appointment_location}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(appointment)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(appointment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(appointment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;