// api.js - API integration service for all backend calls
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/users/auth/register/', userData),
  login: (credentials) => api.post('/users/auth/login/', credentials),
  logout: () => api.post('/users/auth/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (userData) => api.put('/users/profile/update_profile/', userData),
  getUserHistory: () => api.get('/users/profile/history/'),
};

// Aadhar APIs
export const aadharAPI = {
  verify: (aadharNumber) => api.post('/users/aadhar/verify_aadhar/', { aadhar_number: aadharNumber }),
  getVerificationStatus: () => api.get('/users/aadhar/verification_status/'),
};

// User Preferences APIs
export const preferencesAPI = {
  getPreferences: () => api.get('/users/preferences/get_preferences/'),
  updatePreferences: (preferences) => api.put('/users/preferences/update_preferences/', preferences),
};

// Schemes APIs
export const schemesAPI = {
  getAllSchemes: () => api.get('/schemes/schemes/'),
  getSchemeDetails: (id) => api.get(`/schemes/schemes/${id}/`),
  getPersonalizedSchemes: () => api.get('/schemes/schemes/personalized/'),
  getSavedSchemes: () => api.get('/schemes/schemes/saved_schemes/'),
  saveScheme: (schemeId) => api.post('/schemes/schemes/save_scheme/', { scheme_id: schemeId }),
  trackView: (schemeId) => api.post('/schemes/schemes/track_view/', { scheme_id: schemeId }),
  searchSchemes: (params) => api.get('/schemes/schemes/', { params }),
};

// Document Checklist APIs
export const documentAPI = {
  generateChecklist: (schemeId) => api.post('/schemes/documents/generate_checklist/', { scheme_id: schemeId }),
  getUserChecklists: () => api.get('/schemes/documents/user_checklists/'),
  updateChecklist: (checklistId, documents) => api.put('/schemes/documents/update_checklist/', {
    checklist_id: checklistId,
    documents,
  }),
};

// Scheme History APIs
export const historyAPI = {
  getUserHistory: () => api.get('/schemes/history/user_history/'),
  getAppliedSchemes: () => api.get('/schemes/history/applied_schemes/'),
};

// Reminder APIs
export const reminderAPI = {
  createReminder: (schemeId, reminderDate, reminderType = 'deadline') =>
    api.post('/schemes/reminders/create_reminder/', {
      scheme_id: schemeId,
      reminder_date: reminderDate,
      reminder_type: reminderType,
    }),
  getUserReminders: () => api.get('/schemes/reminders/user_reminders/'),
  markReminderSent: (reminderId) => api.put('/schemes/reminders/mark_sent/', { reminder_id: reminderId }),
};

// Chat APIs
export const chatAPI = {
  createSession: () => api.post('/chatbot/sessions/', {}),
  getSessions: () => api.get('/chatbot/sessions/'),
  sendMessage: (message, sessionId, language = 'en', category = 'general') =>
    api.post('/chatbot/chatbot/send_message/', {
      message,
      session_id: sessionId,
      language,
      category,
    }),
  sendVoiceMessage: (voiceFile, sessionId, language = 'en') => {
    const formData = new FormData();
    formData.append('voice_file', voiceFile);
    formData.append('session_id', sessionId);
    formData.append('language', language);
    return api.post('/chatbot/chatbot/voice_input/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  rateResponse: (logId, rating) => api.post('/chatbot/chatbot/rate_response/', { log_id: logId, rating }),
};

export default api;
