import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Mock users data (same as in auth.ts - in real app, use shared database)
const users: any[] = [
  {
    id: '1',
    email: 'admin@eduplatform.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Platform administrator',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'instructor@eduplatform.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'INSTRUCTOR',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Senior Full Stack Developer with 8+ years of experience',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'student@eduplatform.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'STUDENT',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Aspiring web developer',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Get user profile
router.get('/profile', authenticateToken, (req: AuthenticatedRequest, res, next) => {
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

// Update user profile
router.put('/profile', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user?.id);
    if (userIndex === -1) {
      throw createError('User not found', 404);
    }

    const { email, password, role, ...updateData } = req.body;
    
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      throw createError('User not found', 404);
    }

    const { password: _, email: __, ...publicUserData } = user;

    res.json({
      success: true,
      data: publicUserData,
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };