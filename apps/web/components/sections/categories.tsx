'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Code, 
  Database, 
  Smartphone, 
  Cloud, 
  Brain, 
  Shield, 
  Palette, 
  TrendingUp 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    icon: Code,
    name: 'Web Development',
    description: 'Build modern web applications',
    courseCount: 1250,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: Database,
    name: 'Data Science',
    description: 'Analyze and visualize data',
    courseCount: 890,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: Smartphone,
    name: 'Mobile Development',
    description: 'Create iOS and Android apps',
    courseCount: 650,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    icon: Cloud,
    name: 'Cloud Computing',
    description: 'Master cloud platforms',
    courseCount: 420,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    icon: Brain,
    name: 'Machine Learning',
    description: 'AI and ML fundamentals',
    courseCount: 380,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
  },
  {
    icon: Shield,
    name: 'Cybersecurity',
    description: 'Protect digital assets',
    courseCount: 290,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  {
    icon: Palette,
    name: 'UI/UX Design',
    description: 'Design beautiful interfaces',
    courseCount: 520,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-950/20',
  },
  {
    icon: TrendingUp,
    name: 'Business',
    description: 'Grow your business skills',
    courseCount: 340,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
];

export function Categories() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
          >
            Explore Categories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover courses across various domains and advance your career
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${category.bgColor}`}>
                      <category.icon className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {category.courseCount.toLocaleString()} courses
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}