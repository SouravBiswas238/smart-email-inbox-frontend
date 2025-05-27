import React, { useState, useEffect } from "react";
import {
  format,
  parseISO,
  isToday,
  isSameDay,
  addDays,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from "date-fns";
import { toast, Toaster } from "react-hot-toast";
import { Plus, List, Calendar } from "lucide-react";
import { appointmentApi } from "../services/api";

// Components
import AppointmentModal from "../components/Appointments/AppointmentModal";
import AppointmentViewModal from "../components/Appointments/AppointmentViewModal";
import CalendarView from "../components/Appointments/CalendarView";
import ListView from "../components/Appointments/ListView";
import UpcomingAppointments from "../components/Appointments/UpcomingAppointments";

interface Appointment {
  id: number;
  name: string;
  email_address: string | null;
  phone: string | null;
  status: string;
  appointment_datetime: string;
  appointment_type: string | null;
  appointment_location: string | null;
  appointment_notes: string | null;
}

const Appointments: React.FC = () => {
  const [view, setView] = useState<"list" | "calendar">("calendar");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] =
    useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const dateAppointments = appointments.filter((apt) =>
        isSameDay(parseISO(apt.appointment_datetime), selectedDate)
      );
      setSelectedDateAppointments(dateAppointments);
    }
  }, [selectedDate, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentApi.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAppointments = () => {
    const today = startOfDay(new Date());
    const nextWeek = endOfDay(addDays(today, 7));

    return appointments
      .filter((apt) => {
        const aptDate = parseISO(apt.appointment_datetime);
        return isAfter(aptDate, today) && isBefore(aptDate, nextWeek);
      })
      .sort(
        (a, b) =>
          parseISO(a.appointment_datetime).getTime() -
          parseISO(b.appointment_datetime).getTime()
      );
  };

  const handleView = (appointment: Appointment) => {
    setViewingAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await appointmentApi.delete(id);
      setAppointments(appointments.filter((apt) => apt.id !== id));
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error("Failed to delete appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const handleSave = async (data: Omit<Appointment, "id" | "status">) => {
    try {
      if (editingAppointment) {
        const response = await appointmentApi.update(
          editingAppointment.id,
          data
        );
        setAppointments(
          appointments.map((apt) =>
            apt.id === editingAppointment.id ? response.data : apt
          )
        );
        toast.success("Appointment updated successfully");
      } else {
        const response = await appointmentApi.create(data);
        setAppointments([...appointments, response.data]);
        toast.success("Appointment created successfully");
      }
      setIsModalOpen(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error("Failed to save appointment:", error);
      toast.error("Failed to save appointment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full bg-white rounded-lg shadow">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg shadow-sm">
              <button
                onClick={() => setView("list")}
                className={`inline-flex items-center px-4 py-2 rounded-l-lg ${
                  view === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300"
                }`}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`inline-flex items-center px-4 py-2 rounded-r-lg ${
                  view === "calendar"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:text-gray-900 border border-gray-300"
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </button>
            </div>
            <button
              onClick={() => {
                setEditingAppointment(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : view === "calendar" ? (
            <CalendarView
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              appointments={appointments}
              selectedDateAppointments={selectedDateAppointments}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ) : (
            <ListView
              appointments={appointments}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
            />
          )}
        </div>

        {/* Upcoming Appointments Sidebar */}
        <UpcomingAppointments
          appointments={getUpcomingAppointments()}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppointment(null);
        }}
        onSave={handleSave}
        initialData={editingAppointment || undefined}
      />

      {/* View Modal */}
      <AppointmentViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingAppointment(null);
        }}
        appointment={viewingAppointment}
      />
    </div>
  );
};

export default Appointments;
