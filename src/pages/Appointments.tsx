import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { appointmentApi } from '../services/api';

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  description: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '09:00',
    duration: 30,
    location: '',
    attendees: '',
    description: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from your API
      // const response = await appointmentApi.getAll();
      // setAppointments(response.data);
      
      // For demo purposes, using mock data
      setAppointments([
        {
          id: 1,
          title: 'Team Meeting',
          date: '2023-06-15',
          time: '10:00',
          duration: 60,
          location: 'Conference Room A',
          attendees: ['john@example.com', 'sarah@example.com', 'mike@example.com'],
          description: 'Weekly team sync-up to discuss project progress.'
        },
        {
          id: 2,
          title: 'Client Call',
          date: '2023-06-15',
          time: '14:30',
          duration: 45,
          location: 'Zoom Meeting',
          attendees: ['client@example.com', 'manager@example.com'],
          description: 'Follow-up call with the client to review the latest deliverables.'
        },
        {
          id: 3,
          title: 'Project Planning',
          date: '2023-06-16',
          time: '09:00',
          duration: 120,
          location: 'Meeting Room B',
          attendees: ['team@example.com'],
          description: 'Planning session for the upcoming project phase.'
        },
        {
          id: 4,
          title: 'Training Session',
          date: '2023-06-17',
          time: '11:00',
          duration: 90,
          location: 'Training Center',
          attendees: ['newemployees@example.com', 'trainer@example.com'],
          description: 'Training session for new employees on the company\'s systems.'
        },
        {
          id: 5,
          title: 'Dentist Appointment',
          date: '2023-06-18',
          time: '15:00',
          duration: 60,
          location: 'Dental Clinic',
          attendees: [],
          description: 'Regular dental check-up.'
        }
      ]);
    } catch (err) {
      console.error('Failed to fetch appointments', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
      const dateString = currentDate.toISOString().split('T')[0];
      
      const hasAppointment = appointments.some(apt => apt.date === dateString);
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date: currentDate,
        hasAppointment
      });
    }
    
    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const openCreateModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      date: today,
      time: '09:00',
      duration: 30,
      location: '',
      attendees: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.date) {
      return;
    }
    
    try {
      // In a real app, you'd create via API
      // const response = await appointmentApi.create(formData);
      
      // For demo purposes, creating locally
      const newAppointment: Appointment = {
        id: Math.max(...appointments.map(a => a.id), 0) + 1,
        title: formData.title,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration.toString()),
        location: formData.location,
        attendees: formData.attendees.split(',').map(email => email.trim()).filter(email => email),
        description: formData.description
      };
      
      setAppointments([...appointments, newAppointment]);
      closeModal();
    } catch (err) {
      console.error('Failed to create appointment', err);
      setError('Failed to create appointment. Please try again later.');
    }
  };

  const appointmentsForSelectedDate = appointments.filter(apt => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return apt.date === selectedDateStr;
  });

  const formatAppointmentTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  return (
    <div className="h-full bg-white rounded-lg shadow">
      {/* Appointments header */}
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Appointments content */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="md:col-span-2 bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    onClick={previousMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <h2 className="text-lg font-medium text-gray-900 mx-2">
                    {getMonthName(selectedDate)} {selectedDate.getFullYear()}
                  </h2>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Today
                </button>
              </div>
              <div className="p-3">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((dayInfo, index) => (
                    <button
                      key={index}
                      onClick={() => dayInfo.day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayInfo.day))}
                      disabled={!dayInfo.isCurrentMonth || !dayInfo.day}
                      className={`aspect-square flex flex-col items-center justify-center rounded-md p-1 relative ${
                        dayInfo.isCurrentMonth
                          ? 'hover:bg-gray-100'
                          : 'text-gray-300'
                      } ${
                        dayInfo.day === selectedDate.getDate() && dayInfo.isCurrentMonth
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : ''
                      }`}
                    >
                      {dayInfo.day && (
                        <>
                          <span>{dayInfo.day}</span>
                          {dayInfo.hasAppointment && (
                            <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600"></div>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Appointments for selected date */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <div className="p-4 overflow-y-auto max-h-96">
                {appointmentsForSelectedDate.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2">No appointments for this day</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointmentsForSelectedDate
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(appointment => (
                        <div key={appointment.id} className="p-3 rounded-md border border-gray-200 hover:bg-gray-50">
                          <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              {formatAppointmentTime(appointment.time, appointment.duration)}
                            </div>
                            {appointment.location && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                {appointment.location}
                              </div>
                            )}
                            {appointment.attendees.length > 0 && (
                              <div className="flex items-start text-sm text-gray-600">
                                <Users className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                                <div>
                                  {appointment.attendees.join(', ')}
                                </div>
                              </div>
                            )}
                            {appointment.description && (
                              <div className="mt-2 text-sm text-gray-700">
                                {appointment.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating appointments */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Create New Appointment
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter appointment title"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                              Date
                            </label>
                            <input
                              type="date"
                              name="date"
                              id="date"
                              value={formData.date}
                              onChange={handleFormChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                              Time
                            </label>
                            <input
                              type="time"
                              name="time"
                              id="time"
                              value={formData.time}
                              onChange={handleFormChange}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                            Duration (minutes)
                          </label>
                          <select
                            name="duration"
                            id="duration"
                            value={formData.duration}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="90">1 hour 30 minutes</option>
                            <option value="120">2 hours</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter location (optional)"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
                            Attendees (comma-separated emails)
                          </label>
                          <input
                            type="text"
                            name="attendees"
                            id="attendees"
                            value={formData.attendees}
                            onChange={handleFormChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="email1@example.com, email2@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            rows={3}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter description (optional)"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;