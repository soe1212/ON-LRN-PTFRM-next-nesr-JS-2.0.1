import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Mock courses data
const courses = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Master modern web development with React, Node.js, and more. Build real-world projects and launch your career.',
    shortDescription: 'Master web development with React, Node.js, and more',
    instructor: {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      title: 'Senior Full Stack Developer',
    },
    rating: 4.9,
    totalRatings: 2847,
    students: 15420,
    duration: 2520, // minutes
    totalLectures: 42,
    price: 89.99,
    originalPrice: 199.99,
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'BEGINNER',
    category: 'Web Development',
    tags: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
    bestseller: true,
    status: 'PUBLISHED',
    language: 'English',
    requirements: [
      'Basic computer knowledge',
      'No programming experience required',
      'Willingness to learn',
    ],
    learningObjectives: [
      'Build responsive websites with HTML, CSS, and JavaScript',
      'Create dynamic web applications with React',
      'Develop backend APIs with Node.js and Express',
      'Deploy applications to the cloud',
    ],
    createdAt: '2023-10-01T10:00:00Z',
    publishedAt: '2023-10-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning with Python. Work with real datasets and build predictive models.',
    shortDescription: 'Master data science and machine learning with Python',
    instructor: {
      id: '4',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      title: 'Data Science Lead',
    },
    rating: 4.8,
    totalRatings: 1923,
    students: 8750,
    duration: 2280, // minutes
    totalLectures: 38,
    price: 79.99,
    originalPrice: 179.99,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'INTERMEDIATE',
    category: 'Data Science',
    tags: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Visualization'],
    bestseller: false,
    status: 'PUBLISHED',
    language: 'English',
    requirements: [
      'Basic Python knowledge',
      'High school mathematics',
      'Interest in data analysis',
    ],
    learningObjectives: [
      'Analyze data with Pandas and NumPy',
      'Create visualizations with Matplotlib and Seaborn',
      'Build machine learning models',
      'Work with real-world datasets',
    ],
    createdAt: '2023-09-15T10:00:00Z',
    publishedAt: '2023-10-01T10:00:00Z',
  },
  {
    id: '3',
    title: 'React Native Mobile Development',
    description: 'Build cross-platform mobile apps with React Native. Learn to create iOS and Android apps with a single codebase.',
    shortDescription: 'Create iOS and Android apps with React Native',
    instructor: {
      id: '5',
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      title: 'Mobile Development Expert',
    },
    rating: 4.7,
    totalRatings: 1456,
    students: 6230,
    duration: 2100, // minutes
    totalLectures: 35,
    price: 94.99,
    originalPrice: 189.99,
    thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'INTERMEDIATE',
    category: 'Mobile Development',
    tags: ['React Native', 'JavaScript', 'iOS', 'Android', 'Mobile'],
    bestseller: false,
    status: 'PUBLISHED',
    language: 'English',
    requirements: [
      'JavaScript fundamentals',
      'Basic React knowledge',
      'Mobile development interest',
    ],
    learningObjectives: [
      'Build cross-platform mobile apps',
      'Navigate between screens',
      'Handle user input and data',
      'Publish apps to app stores',
    ],
    createdAt: '2023-09-01T10:00:00Z',
    publishedAt: '2023-09-20T10:00:00Z',
  },
];

// Get all courses
router.get('/', (req, res) => {
  const { category, level, page = 1, limit = 10, search } = req.query;
  
  let filteredCourses = [...courses];

  // Apply filters
  if (category) {
    filteredCourses = filteredCourses.filter(course => 
      course.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (level) {
    filteredCourses = filteredCourses.filter(course => 
      course.level.toLowerCase() === (level as string).toLowerCase()
    );
  }

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedCourses,
    meta: {
      page: pageNum,
      limit: limitNum,
      total: filteredCourses.length,
      pages: Math.ceil(filteredCourses.length / limitNum),
      hasNext: endIndex < filteredCourses.length,
      hasPrev: pageNum > 1,
    },
  });
});

// Get course by ID
router.get('/:id', (req, res, next) => {
  try {
    const course = courses.find(c => c.id === req.params.id);
    
    if (!course) {
      throw createError('Course not found', 404);
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
});

// Get featured courses
router.get('/featured/list', (req, res) => {
  const featuredCourses = courses
    .filter(course => course.bestseller || course.rating >= 4.8)
    .slice(0, 4);

  res.json({
    success: true,
    data: featuredCourses,
  });
});

// Create course (instructor only)
router.post('/', authenticateToken, (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      throw createError('Only instructors can create courses', 403);
    }

    const newCourse = {
      id: uuidv4(),
      ...req.body,
      instructor: {
        id: req.user.id,
        name: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim(),
      },
      rating: 0,
      totalRatings: 0,
      students: 0,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };

    courses.push(newCourse);

    res.status(201).json({
      success: true,
      data: newCourse,
      message: 'Course created successfully',
    });
  } catch (error) {
    next(error);
  }
});

export { router as courseRoutes };