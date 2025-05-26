import axios from "axios";

// Create an Axios instance with default config
export const api = axios.create({
  baseURL: "https://smart-email-inbox.aisetechnologies.com/api/", // Replace with your Django API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Email API endpoints

export const emailApi = {
  getAll: (params?: {
    search?: string;
    category_id?: number;
    status?: string;
  }) => api.get("/inbox/email/get-all", { params }),
  getById: (id: number) => api.get(`/inbox/email/get/${id}`),
  update: (id: number, data: any) => api.put(`/inbox/email/update/${id}`, data),
  delete: (id: number) => api.delete(`/inbox/email/delete/${id}`),
  createTest: (data: any) => api.post("/inbox/test-email-creation", data),
};

// Email Category API endpoints
export const emailCategoryApi = {
  getAll: () => api.get("/inbox/email-category/get-all"),
  create: (data: any) => api.post("/inbox/email-category/create", data),
  getById: (id: number) => api.get(`/inbox/email-category/get/${id}`),
  update: (id: number, data: any) =>
    api.put(`/inbox/email-category/update/${id}`, data),
  delete: (id: number) => api.delete(`/inbox/email-category/delete/${id}`),
};

// Appointment API endpoints
export const appointmentApi = {
  getAll: () => api.get("/appointment/get-all"),
  create: (data: any) => api.post("/appointment/create", data),
  getById: (id: number) => api.get(`/appointment/get/${id}`),
  update: (id: number, data: any) => api.put(`/appointment/update/${id}`, data),
  delete: (id: number) => api.delete(`/appointment/delete/${id}`),
};
