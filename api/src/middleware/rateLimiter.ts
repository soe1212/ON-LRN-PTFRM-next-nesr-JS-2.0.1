import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || 'unknown';
  const now = Date.now();
  
  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
  } else {
    store[key].count++;
  }

  const remaining = Math.max(0, MAX_REQUESTS - store[key].count);
  const resetTime = Math.ceil((store[key].resetTime - now) / 1000);

  res.set({
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  });

  if (store[key].count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
      },
      retryAfter: resetTime,
    });
  }

  next();
};