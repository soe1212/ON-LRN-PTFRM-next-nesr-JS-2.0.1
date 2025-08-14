import { Router } from 'express';

const router = Router();

// Mock search data (using courses from courses.ts)
const searchableContent = [
  {
    id: '1',
    type: 'course',
    title: 'Complete Web Development Bootcamp',
    description: 'Master modern web development with React, Node.js, and more',
    category: 'Web Development',
    level: 'BEGINNER',
    tags: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS'],
    rating: 4.9,
    students: 15420,
    price: 89.99,
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    type: 'course',
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning with Python',
    category: 'Data Science',
    level: 'INTERMEDIATE',
    tags: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Visualization'],
    rating: 4.8,
    students: 8750,
    price: 79.99,
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    type: 'course',
    title: 'React Native Mobile Development',
    description: 'Build cross-platform mobile apps with React Native',
    category: 'Mobile Development',
    level: 'INTERMEDIATE',
    tags: ['React Native', 'JavaScript', 'iOS', 'Android', 'Mobile'],
    rating: 4.7,
    students: 6230,
    price: 94.99,
    thumbnail: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Search courses
router.get('/courses', (req, res) => {
  const { q, category, level, page = 1, limit = 10 } = req.query;
  
  let results = [...searchableContent];

  // Text search
  if (q) {
    const searchTerm = (q as string).toLowerCase();
    results = results.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      item.category.toLowerCase().includes(searchTerm)
    );
  }

  // Category filter
  if (category) {
    results = results.filter(item => 
      item.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  // Level filter
  if (level) {
    results = results.filter(item => 
      item.level.toLowerCase() === (level as string).toLowerCase()
    );
  }

  // Pagination
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedResults = results.slice(startIndex, endIndex);

  // Generate aggregations for filters
  const categories = [...new Set(searchableContent.map(item => item.category))]
    .map(cat => ({
      name: cat,
      count: searchableContent.filter(item => item.category === cat).length,
    }));

  const levels = [...new Set(searchableContent.map(item => item.level))]
    .map(level => ({
      name: level,
      count: searchableContent.filter(item => item.level === level).length,
    }));

  res.json({
    success: true,
    data: {
      courses: paginatedResults,
      total: results.length,
      filters: {
        categories,
        levels,
        priceRanges: [
          { name: 'Free', count: 0 },
          { name: '$1-$50', count: 0 },
          { name: '$50-$100', count: 3 },
          { name: '$100+', count: 0 },
        ],
      },
    },
    meta: {
      page: pageNum,
      limit: limitNum,
      total: results.length,
      pages: Math.ceil(results.length / limitNum),
      hasNext: endIndex < results.length,
      hasPrev: pageNum > 1,
    },
  });
});

// Get search suggestions
router.get('/suggestions', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json({
      success: true,
      data: { suggestions: [] },
    });
  }

  const searchTerm = (q as string).toLowerCase();
  const suggestions = new Set<string>();

  searchableContent.forEach(item => {
    // Add matching titles
    if (item.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(item.title);
    }

    // Add matching tags
    item.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag);
      }
    });

    // Add matching categories
    if (item.category.toLowerCase().includes(searchTerm)) {
      suggestions.add(item.category);
    }
  });

  res.json({
    success: true,
    data: {
      suggestions: Array.from(suggestions).slice(0, 10),
    },
  });
});

export { router as searchRoutes };