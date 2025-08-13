# 🎓 EduPlatform - Complete Microservices Education Platform

A production-ready education platform built with modern microservices architecture, inspired by Coursera and Udemy.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                           Client Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App (SSR/SSG)  │  Mobile App  │  Admin Dashboard      │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                              │
│  • Authentication & Authorization  • Rate Limiting             │
│  • Request Routing & Aggregation  • Circuit Breaker           │
│  • Response Caching               • Request Validation         │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                      Service Discovery                          │
│                        (Consul)                                │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                     Microservices Mesh                          │
├─────────────────┬─────────────────┬─────────────────┬────────────┤
│   Core Services │  Content Mgmt   │  Communication  │  Analytics │
│                 │                 │                 │            │
│ • User Service  │ • Course Service│ • Notification  │ • Analytics│
│ • Auth Service  │ • Content Mgmt  │ • Discussion    │ • Progress │
│ • Profile Mgmt  │ • Media Process │ • Review System │ • Reports  │
└─────────────────┴─────────────────┴─────────────────┴────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                    Message Broker (RabbitMQ)                   │
│  • Event-Driven Communication  • Async Processing              │
│  • Dead Letter Queues         • Message Persistence           │
└─────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                │
├─────────────────┬─────────────────┬─────────────────┬────────────┤
│   PostgreSQL    │    MongoDB      │  Elasticsearch  │   Redis    │
│ (Structured)    │ (Documents)     │   (Search)      │  (Cache)   │
│                 │                 │                 │            │
│ • Users         │ • Reviews       │ • Course Index  │ • Sessions │
│ • Courses       │ • Discussions   │ • Search Logs   │ • Cache    │
│ • Orders        │ • Content Meta  │ • Analytics     │ • Tokens   │
└─────────────────┴─────────────────┴─────────────────┴────────────┘
```

## 🎯 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **State Management**: Zustand + React Query
- **Video Player**: Shaka Player (HLS)
- **Charts**: Recharts
- **Internationalization**: next-intl
- **SEO**: next-seo

### Backend
- **Framework**: NestJS 10+
- **Language**: TypeScript
- **API Documentation**: OpenAPI/Swagger
- **Authentication**: JWT + Passport
- **Validation**: class-validator + Zod
- **ORM**: Prisma (PostgreSQL) + Mongoose (MongoDB)
- **Message Queue**: RabbitMQ
- **Service Discovery**: Consul

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **Object Storage**: MinIO (S3-compatible)
- **Search Engine**: Elasticsearch + Kibana
- **Cache**: Redis
- **Video Streaming**: Nginx HLS
- **Monitoring**: Prometheus + Grafana
- **Logging**: Loki + Promtail
- **Tracing**: Jaeger (OpenTelemetry)

### DevOps
- **Build Tool**: Turborepo + pnpm
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint + Prettier + Husky
- **Testing**: Jest + Playwright

## 📊 Services Overview

| Service | Responsibility | Database | Port | Health Check |
|---------|---------------|----------|------|--------------|
| **API Gateway** | Request routing, auth, rate limiting | Redis | 4000 | `/health` |
| **User Service** | Authentication, profiles, roles | PostgreSQL | 4001 | `/api/users/health` |
| **Course Service** | Course CRUD, categories, levels | PostgreSQL | 4002 | `/api/courses/health` |
| **Content Service** | File upload, HLS streaming | MongoDB + MinIO | 4003 | `/api/content/health` |
| **Progress Service** | Learning progress, certificates | PostgreSQL | 4004 | `/api/progress/health` |
| **Ecommerce Service** | Cart, checkout, pricing | PostgreSQL | 4005 | `/api/ecommerce/health` |
| **Payment Service** | Payment processing, refunds | PostgreSQL | 4006 | `/api/payments/health` |
| **Review Service** | Course reviews, ratings | MongoDB | 4007 | `/api/reviews/health` |
| **Discussion Service** | Q&A, forums, comments | MongoDB | 4008 | `/api/discussions/health` |
| **Notification Service** | Push, email, in-app notifications | MongoDB + Redis | 4009 | `/api/notifications/health` |
| **Search Service** | Course search, autocomplete | Elasticsearch | 4010 | `/api/search/health` |
| **Recommendation Service** | Personalized recommendations | PostgreSQL | 4011 | `/api/recommendations/health` |
| **Analytics Service** | Usage analytics, reports | PostgreSQL | 4012 | `/api/analytics/health` |
| **Session Tracking Service** | Real-time activity tracking | MongoDB | 4013 | `/api/sessions/health` |
| **Admin Service** | Admin operations, approvals | PostgreSQL | 4014 | `/api/admin/health` |
| **CMS Service** | Blog, static content | PostgreSQL | 4015 | `/api/cms/health` |
| **Marketing Service** | Campaigns, affiliates, A/B tests | PostgreSQL | 4016 | `/api/marketing/health` |
| **SEO Service** | Sitemaps, meta tags | MongoDB | 4017 | `/api/seo/health` |
| **AI Tutor Service** | AI-powered assistance | PostgreSQL (pgvector) | 4018 | `/api/ai/health` |
| **Plagiarism Service** | Content plagiarism detection | MongoDB | 4019 | `/api/plagiarism/health` |
| **Speech Service** | Speech-to-text, captions | MongoDB | 4020 | `/api/speech/health` |
| **Assessment Service** | Quizzes, exams, grading | PostgreSQL | 4021 | `/api/assessments/health` |
| **Audit Service** | Audit logs, compliance | MongoDB | 4022 | `/api/audit/health` |
| **Compliance Service** | GDPR, data protection | PostgreSQL | 4023 | `/api/compliance/health` |
| **Media Processing Service** | Video transcoding, thumbnails | MongoDB | 4024 | `/api/media/health` |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Docker** and **Docker Compose**
- **kubectl** (for Kubernetes deployment)

### Development Setup

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd edu-platform
pnpm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Infrastructure Services**
```bash
docker-compose up -d postgres mongodb redis rabbitmq elasticsearch kibana minio consul prometheus grafana loki promtail jaeger
```

4. **Run Database Migrations**
```bash
pnpm db:migrate
pnpm db:seed
```

5. **Start Development Servers**
```bash
pnpm dev
```

6. **Access the Application**
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:4000
- **API Documentation**: http://localhost:4000/docs
- **Admin Dashboard**: http://localhost:3000/admin

### Production Deployment

#### Docker Compose
```bash
# Build and deploy all services
make docker:build
make docker:up

# View logs
make logs

# Stop services
make docker:down
```

#### Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -A

# Access via ingress
kubectl get ingress
```

## 📁 Project Structure

```
edu-platform/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api-gateway/         # NestJS API gateway
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── shared/              # Shared types, DTOs, events
│   ├── tsconfig/            # Shared TypeScript configs
│   └── eslint-config/       # Shared ESLint configs
├── services/                # All microservices
│   ├── user-service/
│   ├── course-service/
│   ├── content-service/
│   └── ... (24 services)
├── k8s/                     # Kubernetes manifests
├── scripts/                 # Database seeds, utilities
├── docs/                    # Documentation
├── compose.yaml             # Docker Compose configuration
├── Makefile                # Common commands
└── turbo.json              # Turborepo configuration
```

## 🔧 Development Workflow

### Common Commands

```bash
# Development
pnpm dev                     # Start all services in development
pnpm build                   # Build all packages
pnpm test                    # Run all tests
pnpm lint                    # Lint all code

# Database
pnpm db:migrate              # Run database migrations
pnpm db:seed                 # Seed database with sample data
pnpm db:reset                # Reset and reseed database

# Docker
make docker:build            # Build all Docker images
make docker:up               # Start all containers
make docker:down             # Stop all containers
make logs                    # View all container logs

# Kubernetes
make k8s:apply               # Apply all Kubernetes manifests
make k8s:delete              # Delete all Kubernetes resources
```

### Code Quality

The project uses automated code quality tools:

- **ESLint** + **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks
- **commitlint** for commit message format
- **Jest** for unit testing

### API Documentation

Each service generates OpenAPI documentation:

- **Gateway**: http://localhost:4000/docs
- **User Service**: http://localhost:4001/api/users/docs
- **Course Service**: http://localhost:4002/api/courses/docs
- And so on...

## 🎥 Demo Content

The seed script creates:

- **Users**: Students, instructors, admins
- **Courses**: 12+ courses across categories
- **Content**: Sample videos with HLS streaming
- **Reviews**: Course reviews and ratings
- **Orders**: Purchase history
- **Progress**: Learning progress data
- **Discussions**: Q&A threads

## 📊 Monitoring & Observability

### Dashboards

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Jaeger**: http://localhost:16686
- **Kibana**: http://localhost:5601

### Key Metrics

- API response times and error rates
- Service health and uptime
- Database performance
- Message queue status
- Resource utilization

## 🔒 Security Features

- **JWT-based authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Rate limiting** on API endpoints
- **CORS configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Input validation** and sanitization
- **SQL injection prevention**
- **XSS protection**

## 🌍 Internationalization

The platform supports multiple languages:

- English (default)
- Spanish
- French
- German
- Chinese (Simplified)

Content is managed through next-intl with namespace organization.

## 📱 Mobile Support

The frontend is fully responsive and PWA-ready:

- **Responsive design** for all screen sizes
- **Touch-friendly** interactions
- **Offline capability** for downloaded content
- **Push notifications** support

## 🔄 Event-Driven Architecture

Services communicate via RabbitMQ events:

- `user.created` - User registration
- `course.published` - Course publication
- `order.completed` - Purchase completion
- `progress.updated` - Learning progress
- `media.processed` - Video processing complete

## 🎯 Next Steps

1. **Configure environment variables** in `.env`
2. **Set up external integrations** (Stripe, SendGrid, etc.)
3. **Customize branding** and styling
4. **Add custom course content**
5. **Configure monitoring alerts**
6. **Set up CI/CD pipelines**

## 📞 Support

For issues and questions:

- **Documentation**: `/docs`
- **API Reference**: Service-specific `/docs` endpoints
- **GitHub Issues**: For bug reports and feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using modern technologies and best practices**