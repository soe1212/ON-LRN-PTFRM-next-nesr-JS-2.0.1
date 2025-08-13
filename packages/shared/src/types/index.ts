// Common types used across services

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// User Types
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isActive: boolean;
  language: string;
  timezone: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Course Types
export enum CourseStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ALL_LEVELS = 'ALL_LEVELS',
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  previewVideo?: string;
  price: number;
  discountPrice?: number;
  currency: string;
  level: CourseLevel;
  status: CourseStatus;
  language: string;
  category: string;
  subcategory?: string;
  tags: string[];
  requirements: string[];
  learningObjectives: string[];
  instructorId: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  duration: number; // in minutes
  totalLectures: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Content Types
export enum ContentType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  RESOURCE = 'RESOURCE',
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  duration: number;
  videoUrl?: string;
  hlsUrl?: string;
  thumbnailUrl?: string;
  articleContent?: string;
  resources: Resource[];
  isPreview: boolean;
  order: number;
  sectionId: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  courseId: string;
  lectures: Lecture[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'zip' | 'link' | 'other';
  url: string;
  size?: number;
}

// Progress Types
export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  completedLectures: string[];
  currentLecture?: string;
  progressPercentage: number;
  timeSpent: number; // in minutes
  lastAccessedAt: string;
  startedAt: string;
  completedAt?: string;
}

// Order Types
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
  discountPrice?: number;
}

// Review Types
export interface Review {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// Search Types
export interface SearchFilters {
  category?: string;
  subcategory?: string;
  level?: CourseLevel;
  price?: 'free' | 'paid';
  rating?: number;
  language?: string;
  features?: string[];
}

export interface SearchResult {
  courses: Course[];
  instructors: User[];
  total: number;
  filters: {
    categories: { name: string; count: number }[];
    levels: { name: string; count: number }[];
    languages: { name: string; count: number }[];
    priceRanges: { name: string; count: number }[];
  };
}

// Notification Types
export enum NotificationType {
  COURSE_PUBLISHED = 'COURSE_PUBLISHED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  PROGRESS_MILESTONE = 'PROGRESS_MILESTONE',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateUrl: string;
  verificationId: string;
  issuedAt: string;
  course?: {
    id: string;
    title: string;
    instructor: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}