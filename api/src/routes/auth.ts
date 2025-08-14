import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Mock user database (replace with real database)
const users: any[] = [
  {
    id: '1',
    email: 'admin@eduplatform.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // secret123
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'instructor@eduplatform.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // secret123
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'INSTRUCTOR',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'student@eduplatform.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // secret123
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date().toISOString(),
  },
];

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw createError('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'STUDENT',
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate tokens
    const tokens = generateTokens(newUser.id);

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        tokens,
      },
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const user = users.find(u => u.id === req.user?.id);
    if (!user) {
      throw createError('User not found', 404);
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token required', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;
    const tokens = generateTokens(decoded.id);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    throw createError('Invalid refresh token', 401);
  }
});

export { router as authRoutes };