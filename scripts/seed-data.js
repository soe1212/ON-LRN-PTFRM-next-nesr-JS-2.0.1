const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// Generate sample course data
const generateCourses = (count = 12) => {
  const categories = [
    'Web Development',
    'Data Science',
    'Mobile Development',
    'DevOps',
    'Machine Learning',
    'Cybersecurity',
    'UI/UX Design',
    'Cloud Computing',
  ];

  const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'];
  
  const courses = [];

  for (let i = 0; i < count; i++) {
    const course = {
      id: faker.string.uuid(),
      title: faker.lorem.words(4),
      description: faker.lorem.paragraphs(3),
      shortDescription: faker.lorem.sentence(),
      thumbnail: `https://images.pexels.com/photos/${faker.number.int({ min: 1000000, max: 9999999 })}/pexels-photo-${faker.number.int({ min: 1000000, max: 9999999 })}.jpeg?auto=compress&cs=tinysrgb&w=800`,
      price: faker.number.float({ min: 29.99, max: 199.99, precision: 2 }),
      currency: 'USD',
      level: faker.helpers.arrayElement(levels),
      category: faker.helpers.arrayElement(categories),
      tags: faker.lorem.words(5).split(' '),
      requirements: Array.from({ length: 3 }, () => faker.lorem.sentence()),
      learningObjectives: Array.from({ length: 4 }, () => faker.lorem.sentence()),
      instructorId: faker.string.uuid(),
      rating: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
      totalRatings: faker.number.int({ min: 50, max: 2000 }),
      totalStudents: faker.number.int({ min: 100, max: 10000 }),
      duration: faker.number.int({ min: 120, max: 1200 }), // minutes
      totalLectures: faker.number.int({ min: 10, max: 100 }),
      createdAt: faker.date.past().toISOString(),
      publishedAt: faker.date.recent().toISOString(),
    };

    courses.push(course);
  }

  return courses;
};

// Generate sample user data
const generateUsers = (count = 50) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const user = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatar: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      role: faker.helpers.arrayElement(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
      isActive: true,
      language: 'en',
      timezone: 'UTC',
      theme: 'dark',
      createdAt: faker.date.past().toISOString(),
      lastLogin: faker.date.recent().toISOString(),
    };

    users.push(user);
  }

  return users;
};

// Generate sample reviews
const generateReviews = (courses, users, count = 100) => {
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const course = faker.helpers.arrayElement(courses);
    const user = faker.helpers.arrayElement(users);

    const review = {
      id: faker.string.uuid(),
      courseId: course.id,
      userId: user.id,
      rating: faker.number.int({ min: 3, max: 5 }),
      title: faker.lorem.sentence(),
      comment: faker.lorem.paragraphs(2),
      helpful: faker.number.int({ min: 0, max: 50 }),
      createdAt: faker.date.past().toISOString(),
    };

    reviews.push(review);
  }

  return reviews;
};

// Generate HLS playlist for video streaming
const generateHLSPlaylist = () => {
  return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:10.0,
segment-00001.ts
#EXTINF:10.0,
segment-00002.ts
#EXTINF:10.0,
segment-00003.ts
#EXTINF:8.5,
segment-00004.ts
#EXT-X-ENDLIST`;
};

// Main function to generate all seed data
const generateSeedData = () => {
  console.log('🌱 Generating seed data...');

  const courses = generateCourses(12);
  const users = generateUsers(50);
  const reviews = generateReviews(courses, users, 100);

  // Ensure output directory exists
  const outputDir = path.join(__dirname, 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write JSON files
  fs.writeFileSync(
    path.join(outputDir, 'courses.json'),
    JSON.stringify(courses, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'users.json'),
    JSON.stringify(users, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'reviews.json'),
    JSON.stringify(reviews, null, 2)
  );

  // Generate HLS playlist
  fs.writeFileSync(
    path.join(outputDir, 'sample-playlist.m3u8'),
    generateHLSPlaylist()
  );

  console.log('✅ Seed data generated successfully!');
  console.log(`📊 Generated ${courses.length} courses`);
  console.log(`👥 Generated ${users.length} users`);
  console.log(`⭐ Generated ${reviews.length} reviews`);
  console.log(`🎥 Generated HLS playlist`);
};

// Run if called directly
if (require.main === module) {
  generateSeedData();
}

module.exports = {
  generateCourses,
  generateUsers,
  generateReviews,
  generateSeedData,
};