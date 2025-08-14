import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Mock progress data
const progressData: any[] = [
  {
    id: '1',
    userId: '3',
    courseId: '1',
    completedLectures: ['1', '2', '3'],
    currentLecture: '4',
    progressPercentage: 25,
    timeSpent: 180, // minutes
    lastAccessedAt: new Date().toISOString(),
    startedAt: '2023-11-01T10:00:00Z',
  },
  {
    id: '2',
    userId: '3',
    courseId: '2',
    completedLectures: ['1', '2'],
    currentLecture: '3',
    progressPercentage: 15,
    timeSpent: 120, // minutes
    lastAccessedAt: new Date().toISOString(),
    startedAt: '2023-11-05T10:00:00Z',
  },
];

// Get user progress for all courses
router.get('/user/:userId', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const { userId } = req.params;
    
    // Users can only access their own progress, admins can access any
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    const userProgress = progressData.filter(p => p.userId === userId);

    res.json({
      success: true,
      data: userProgress,
    });
  } catch (error) {
    next(error);
  }
});

// Get progress for specific course
router.get('/user/:userId/course/:courseId', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const { userId, courseId } = req.params;
    
    // Users can only access their own progress
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    const progress = progressData.find(p => p.userId === userId && p.courseId === courseId);

    if (!progress) {
      // Return default progress if not found
      const defaultProgress = {
        id: null,
        userId,
        courseId,
        completedLectures: [],
        currentLecture: null,
        progressPercentage: 0,
        timeSpent: 0,
        lastAccessedAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
      };

      return res.json({
        success: true,
        data: defaultProgress,
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
});

// Update progress
router.post('/update', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const { courseId, lectureId, timeSpent } = req.body;
    const userId = req.user?.id;

    if (!courseId) {
      throw createError('Course ID is required', 400);
    }

    let progress = progressData.find(p => p.userId === userId && p.courseId === courseId);

    if (!progress) {
      // Create new progress record
      progress = {
        id: `progress_${Date.now()}`,
        userId,
        courseId,
        completedLectures: [],
        currentLecture: null,
        progressPercentage: 0,
        timeSpent: 0,
        lastAccessedAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
      };
      progressData.push(progress);
    }

    // Update progress
    if (lectureId && !progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
    }

    if (lectureId) {
      progress.currentLecture = lectureId;
    }

    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }

    // Calculate progress percentage (assuming 42 total lectures for demo)
    progress.progressPercentage = Math.min((progress.completedLectures.length / 42) * 100, 100);
    progress.lastAccessedAt = new Date().toISOString();

    if (progress.progressPercentage === 100) {
      progress.completedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      data: progress,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

export { router as progressRoutes };