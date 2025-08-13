'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Star } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '2M+',
    label: 'Active Students',
    description: 'Learning worldwide',
  },
  {
    icon: BookOpen,
    value: '10K+',
    label: 'Courses',
    description: 'Expert-led content',
  },
  {
    icon: Award,
    value: '500K+',
    label: 'Certificates',
    description: 'Issued to learners',
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'Average Rating',
    description: 'From our students',
  },
];

export function Stats() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}