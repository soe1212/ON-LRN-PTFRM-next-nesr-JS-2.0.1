// Event definitions for microservices communication

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
  source: string;
}

// User Events
export interface UserCreatedEvent extends BaseEvent {
  eventType: 'user.created';
  data: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface UserUpdatedEvent extends BaseEvent {
  eventType: 'user.updated';
  data: {
    userId: string;
    changes: Record<string, any>;
  };
}

export interface UserDeletedEvent extends BaseEvent {
  eventType: 'user.deleted';
  data: {
    userId: string;
  };
}

// Course Events
export interface CourseCreatedEvent extends BaseEvent {
  eventType: 'course.created';
  data: {
    courseId: string;
    title: string;
    instructorId: string;
    category: string;
    price: number;
  };
}

export interface CoursePublishedEvent extends BaseEvent {
  eventType: 'course.published';
  data: {
    courseId: string;
    title: string;
    instructorId: string;
    publishedAt: string;
  };
}

export interface CourseUpdatedEvent extends BaseEvent {
  eventType: 'course.updated';
  data: {
    courseId: string;
    changes: Record<string, any>;
  };
}

// Order Events
export interface OrderCreatedEvent extends BaseEvent {
  eventType: 'order.created';
  data: {
    orderId: string;
    userId: string;
    courseIds: string[];
    totalAmount: number;
    currency: string;
  };
}

export interface OrderCompletedEvent extends BaseEvent {
  eventType: 'order.completed';
  data: {
    orderId: string;
    userId: string;
    courseIds: string[];
    paymentId: string;
    completedAt: string;
  };
}

// Progress Events
export interface ProgressUpdatedEvent extends BaseEvent {
  eventType: 'progress.updated';
  data: {
    userId: string;
    courseId: string;
    lectureId: string;
    progressPercentage: number;
    completedAt?: string;
  };
}

export interface CertificateIssuedEvent extends BaseEvent {
  eventType: 'certificate.issued';
  data: {
    certificateId: string;
    userId: string;
    courseId: string;
    issuedAt: string;
  };
}

// Content Events
export interface MediaProcessedEvent extends BaseEvent {
  eventType: 'media.processed';
  data: {
    mediaId: string;
    courseId: string;
    lectureId: string;
    fileUrl: string;
    hlsUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    status: 'completed' | 'failed';
  };
}

// Review Events
export interface ReviewCreatedEvent extends BaseEvent {
  eventType: 'review.created';
  data: {
    reviewId: string;
    courseId: string;
    userId: string;
    rating: number;
    comment: string;
  };
}

// Notification Events
export interface NotificationSentEvent extends BaseEvent {
  eventType: 'notification.sent';
  data: {
    notificationId: string;
    userId: string;
    type: 'email' | 'push' | 'in-app';
    status: 'sent' | 'failed';
  };
}

// Union type for all events
export type DomainEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserDeletedEvent
  | CourseCreatedEvent
  | CoursePublishedEvent
  | CourseUpdatedEvent
  | OrderCreatedEvent
  | OrderCompletedEvent
  | ProgressUpdatedEvent
  | CertificateIssuedEvent
  | MediaProcessedEvent
  | ReviewCreatedEvent
  | NotificationSentEvent;

// Event publisher interface
export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

// Event handler interface
export interface EventHandler<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
}