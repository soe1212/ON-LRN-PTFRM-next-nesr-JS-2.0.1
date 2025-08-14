import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: any; tokens: any }>>('/auth/login', { email, password }),
  
  register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
    api.post<ApiResponse<{ user: any; tokens: any }>>('/auth/register', data),
  
  getMe: () =>
    api.get<ApiResponse<any>>('/auth/me'),
  
  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),
};

// Courses API
export const coursesApi = {
  getAll: (params?: { category?: string; level?: string; page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<any[]>>('/courses', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/courses/${id}`),
  
  getFeatured: () =>
    api.get<ApiResponse<any[]>>('/courses/featured/list'),
  
  create: (data: any) =>
    api.post<ApiResponse<any>>('/courses', data),
};

// Progress API
export const progressApi = {
  getUserProgress: (userId: string) =>
    api.get<ApiResponse<any[]>>(`/progress/user/${userId}`),
  
  getCourseProgress: (userId: string, courseId: string) =>
    api.get<ApiResponse<any>>(`/progress/user/${userId}/course/${courseId}`),
  
  updateProgress: (data: { courseId: string; lectureId?: string; timeSpent?: number }) =>
    api.post<ApiResponse<any>>('/progress/update', data),
};

// Reviews API
export const reviewsApi = {
  getCourseReviews: (courseId: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<{ reviews: any[]; averageRating: number; totalReviews: number }>>(`/reviews/course/${courseId}`, { params }),
  
  createReview: (data: { courseId: string; rating: number; title?: string; comment: string }) =>
    api.post<ApiResponse<any>>('/reviews', data),
  
  updateReview: (id: string, data: { rating?: number; title?: string; comment?: string }) =>
    api.put<ApiResponse<any>>(`/reviews/${id}`, data),
  
  deleteReview: (id: string) =>
    api.delete<ApiResponse<any>>(`/reviews/${id}`),
};

// Search API
export const searchApi = {
  searchCourses: (params: { q?: string; category?: string; level?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<{ courses: any[]; total: number; filters: any }>>('/search/courses', { params }),
  
  getSuggestions: (q: string) =>
    api.get<ApiResponse<{ suggestions: string[] }>>('/search/suggestions', { params: { q } }),
};

// Users API
export const usersApi = {
  getProfile: () =>
    api.get<ApiResponse<any>>('/users/profile'),
  
  updateProfile: (data: any) =>
    api.put<ApiResponse<any>>('/users/profile', data),
  
  getById: (id: string) =>
    api.get<ApiResponse<any>>(`/users/${id}`),
};