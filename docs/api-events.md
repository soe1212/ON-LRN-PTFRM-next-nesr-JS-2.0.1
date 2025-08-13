# EduPlatform Event Architecture

This document describes the event-driven architecture and message contracts used across EduPlatform microservices.

## Event Bus Architecture

EduPlatform uses RabbitMQ as the message broker with the following exchange configuration:

- **Exchange Type**: Topic
- **Exchange Name**: `edu.events`
- **Routing Pattern**: `<domain>.<event_type>`

## Event Categories

### User Domain Events

#### user.created
Triggered when a new user registers on the platform.

```json
{
  "eventId": "uuid",
  "eventType": "user.created",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "user-service",
  "data": {
    "userId": "user123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

**Consumers:**
- notification-service (welcome email)
- analytics-service (user metrics)
- recommendation-service (profile setup)

#### user.updated
Triggered when user profile information is modified.

```json
{
  "eventId": "uuid",
  "eventType": "user.updated",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "user-service",
  "data": {
    "userId": "user123",
    "changes": {
      "firstName": "Jane",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### Course Domain Events

#### course.created
Triggered when a new course is created by an instructor.

```json
{
  "eventId": "uuid",
  "eventType": "course.created",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "course-service",
  "data": {
    "courseId": "course123",
    "title": "Complete Web Development",
    "instructorId": "instructor123",
    "category": "Web Development",
    "price": 99.99
  }
}
```

**Consumers:**
- search-service (index course)
- notification-service (notify admin)

#### course.published
Triggered when a course is published and becomes available to students.

```json
{
  "eventId": "uuid",
  "eventType": "course.published",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "course-service",
  "data": {
    "courseId": "course123",
    "title": "Complete Web Development",
    "instructorId": "instructor123",
    "publishedAt": "2023-11-20T10:30:00Z"
  }
}
```

**Consumers:**
- search-service (update search index)
- notification-service (notify followers)
- recommendation-service (update recommendations)
- marketing-service (trigger campaigns)

### Order Domain Events

#### order.created
Triggered when a user creates an order (adds courses to cart and initiates checkout).

```json
{
  "eventId": "uuid",
  "eventType": "order.created",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "ecommerce-service",
  "data": {
    "orderId": "order123",
    "userId": "user123",
    "courseIds": ["course123", "course456"],
    "totalAmount": 199.98,
    "currency": "USD"
  }
}
```

**Consumers:**
- payment-service (process payment)
- analytics-service (track conversion)

#### order.completed
Triggered when payment is successful and order is completed.

```json
{
  "eventId": "uuid",
  "eventType": "order.completed",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "payment-service",
  "data": {
    "orderId": "order123",
    "userId": "user123",
    "courseIds": ["course123", "course456"],
    "paymentId": "payment123",
    "completedAt": "2023-11-20T10:30:00Z"
  }
}
```

**Consumers:**
- progress-service (enroll user in courses)
- notification-service (send receipt and welcome)
- analytics-service (track sales)
- recommendation-service (update preferences)

### Progress Domain Events

#### progress.updated
Triggered when a user completes a lecture or makes progress in a course.

```json
{
  "eventId": "uuid",
  "eventType": "progress.updated",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "progress-service",
  "data": {
    "userId": "user123",
    "courseId": "course123",
    "lectureId": "lecture456",
    "progressPercentage": 75.5,
    "completedAt": "2023-11-20T10:30:00Z"
  }
}
```

**Consumers:**
- analytics-service (engagement metrics)
- notification-service (milestone notifications)
- recommendation-service (update preferences)

#### certificate.issued
Triggered when a user completes a course and receives a certificate.

```json
{
  "eventId": "uuid",
  "eventType": "certificate.issued",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "progress-service",
  "data": {
    "certificateId": "cert123",
    "userId": "user123",
    "courseId": "course123",
    "issuedAt": "2023-11-20T10:30:00Z"
  }
}
```

**Consumers:**
- notification-service (congratulations email)
- analytics-service (completion metrics)

### Content Domain Events

#### media.processed
Triggered when video content is successfully processed and HLS streams are ready.

```json
{
  "eventId": "uuid",
  "eventType": "media.processed",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "media-processing-service",
  "data": {
    "mediaId": "media123",
    "courseId": "course123",
    "lectureId": "lecture456",
    "fileUrl": "https://storage.example.com/video.mp4",
    "hlsUrl": "https://cdn.example.com/playlist.m3u8",
    "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
    "duration": 1200,
    "status": "completed"
  }
}
```

**Consumers:**
- course-service (update lecture metadata)
- content-service (update content URLs)

### Review Domain Events

#### review.created
Triggered when a user submits a course review.

```json
{
  "eventId": "uuid",
  "eventType": "review.created",
  "timestamp": "2023-11-20T10:30:00Z",
  "version": "1.0",
  "source": "review-service",
  "data": {
    "reviewId": "review123",
    "courseId": "course123",
    "userId": "user123",
    "rating": 5,
    "comment": "Excellent course!"
  }
}
```

**Consumers:**
- course-service (update course rating)
- notification-service (notify instructor)
- analytics-service (review metrics)

## Dead Letter Queue

Failed events are routed to a dead letter queue for manual inspection and retry:

- **Queue Name**: `edu.events.dlq`
- **TTL**: 7 days
- **Max Retries**: 3

## Event Versioning

Events use semantic versioning in the format `major.minor`:

- **Major version**: Breaking changes to event structure
- **Minor version**: Backward-compatible additions

Consumers must handle both current and previous major versions during migration periods.

## Best Practices

1. **Idempotency**: All event handlers should be idempotent
2. **Timeout**: Event processing should complete within 30 seconds
3. **Error Handling**: Use exponential backoff for retries
4. **Logging**: Log all event processing with correlation IDs
5. **Monitoring**: Track event processing metrics and latency

## Implementation Example

### Publishing Events (TypeScript)

```typescript
import { EventPublisher } from '@edu-platform/shared';

class UserService {
  constructor(private eventPublisher: EventPublisher) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({ data: userData });

    // Publish event
    await this.eventPublisher.publish({
      eventId: generateUUID(),
      eventType: 'user.created',
      timestamp: new Date().toISOString(),
      version: '1.0',
      source: 'user-service',
      data: {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    return user;
  }
}
```

### Consuming Events (TypeScript)

```typescript
import { EventHandler } from '@edu-platform/shared';

@Injectable()
export class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    try {
      // Send welcome email
      await this.emailService.sendWelcomeEmail(
        event.data.email,
        event.data.firstName
      );

      // Track analytics
      await this.analyticsService.trackUserRegistration(event.data.userId);

      logger.info('User created event processed', {
        eventId: event.eventId,
        userId: event.data.userId,
      });
    } catch (error) {
      logger.error('Failed to process user created event', {
        eventId: event.eventId,
        error: error.message,
      });
      throw error; // Will trigger retry mechanism
    }
  }
}
```

## Monitoring

Event processing is monitored using:

- **Prometheus metrics**: Event count, processing time, error rate
- **Jaeger tracing**: End-to-end event flow tracing
- **Grafana dashboards**: Real-time event processing visualization

Key metrics tracked:

- `events_published_total`
- `events_consumed_total`
- `event_processing_duration_seconds`
- `event_processing_errors_total`
- `dlq_message_count`