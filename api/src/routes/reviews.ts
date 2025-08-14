import { Router } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock reviews data
const reviews: any[] = [
  {
    id: '1',
    courseId: '1',
    userId: '3',
    rating: 5,
    title: 'Excellent course!',
    comment: 'This course completely transformed my understanding of web development. The instructor explains everything clearly and the projects are very practical.',
    helpful: 15,
    user: {
      id: '3',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    createdAt: '2023-11-10T10:00:00Z',
  },
  {
    id: '2',
    courseId: '1',
    userId: '4',
    rating: 5,
    title: 'Highly recommended',
    comment: 'Great content and well-structured curriculum. Perfect for beginners who want to get into web development.',
    helpful: 8,
    user: {
      id: '4',
      firstName: 'Alice',
      lastName: 'Smith',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    createdAt: '2023-11-08T10:00:00Z',
  },
];

// Get reviews for a course
router.get('/course/:courseId', (req, res) => {
  const { courseId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const courseReviews = reviews.filter(r => r.courseId === courseId);
  
  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedReviews = courseReviews.slice(startIndex, endIndex);

  // Calculate average rating
  const averageRating = courseReviews.length > 0
    ? courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length
    : 0;

  res.json({
    success: true,
    data: {
      reviews: paginatedReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: courseReviews.length,
    },
    meta: {
      page: pageNum,
      limit: limitNum,
      total: courseReviews.length,
      pages: Math.ceil(courseReviews.length / limitNum),
      hasNext: endIndex < courseReviews.length,
      hasPrev: pageNum > 1,
    },
  });
});

// Create review
router.post('/', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const { courseId, rating, title, comment } = req.body;

    if (!courseId || !rating || !comment) {
      throw createError('Course ID, rating, and comment are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw createError('Rating must be between 1 and 5', 400);
    }

    // Check if user already reviewed this course
    const existingReview = reviews.find(r => 
      r.courseId === courseId && r.userId === req.user?.id
    );

    if (existingReview) {
      throw createError('You have already reviewed this course', 409);
    }

    const newReview = {
      id: uuidv4(),
      courseId,
      userId: req.user?.id,
      rating,
      title: title || '',
      comment,
      helpful: 0,
      user: {
        id: req.user?.id,
        firstName: req.user?.firstName || 'Anonymous',
        lastName: req.user?.lastName || 'User',
        avatar: req.user?.avatar || null,
      },
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    res.status(201).json({
      success: true,
      data: newReview,
      message: 'Review created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Update review
router.put('/:id', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
    
    if (reviewIndex === -1) {
      throw createError('Review not found', 404);
    }

    const review = reviews[reviewIndex];

    // Users can only update their own reviews
    if (review.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    const { rating, title, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      throw createError('Rating must be between 1 and 5', 400);
    }

    reviews[reviewIndex] = {
      ...review,
      ...(rating && { rating }),
      ...(title && { title }),
      ...(comment && { comment }),
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: reviews[reviewIndex],
      message: 'Review updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Delete review
router.delete('/:id', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    const reviewIndex = reviews.findIndex(r => r.id === req.params.id);
    
    if (reviewIndex === -1) {
      throw createError('Review not found', 404);
    }

    const review = reviews[reviewIndex];

    // Users can only delete their own reviews
    if (review.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    reviews.splice(reviewIndex, 1);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };