export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  consul: {
    host: process.env.CONSUL_HOST || 'localhost',
    port: parseInt(process.env.CONSUL_PORT, 10) || 8500,
  },
  services: {
    user: {
      url: process.env.USER_SERVICE_URL || 'http://localhost:4001',
    },
    course: {
      url: process.env.COURSE_SERVICE_URL || 'http://localhost:4002',
    },
    content: {
      url: process.env.CONTENT_SERVICE_URL || 'http://localhost:4003',
    },
    progress: {
      url: process.env.PROGRESS_SERVICE_URL || 'http://localhost:4004',
    },
    ecommerce: {
      url: process.env.ECOMMERCE_SERVICE_URL || 'http://localhost:4005',
    },
    payment: {
      url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:4006',
    },
    review: {
      url: process.env.REVIEW_SERVICE_URL || 'http://localhost:4007',
    },
    discussion: {
      url: process.env.DISCUSSION_SERVICE_URL || 'http://localhost:4008',
    },
    notification: {
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4009',
    },
    search: {
      url: process.env.SEARCH_SERVICE_URL || 'http://localhost:4010',
    },
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
});