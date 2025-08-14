'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/components/providers/auth-provider';
import { progressApi } from '@/lib/api';
import { formatDuration } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProgress();
    }
  }, [isAuthenticated, user]);

  const fetchProgress = async () => {
    try {
      const response = await progressApi.getUserProgress(user!.id);
      if (response.data.success) {
        setProgress(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Courses Enrolled',
      value: progress.length,
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      title: 'Hours Learned',
      value: Math.round(progress.reduce((sum, p) => sum + p.timeSpent, 0) / 60),
      icon: Clock,
      color: 'text-green-500',
    },
    {
      title: 'Courses Completed',
      value: progress.filter(p => p.completedAt).length,
      icon: Award,
      color: 'text-purple-500',
    },
    {
      title: 'Average Progress',
      value: `${Math.round(progress.reduce((sum, p) => sum + p.progressPercentage, 0) / (progress.length || 1))}%`,
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey and achieve your goals.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                Track your progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded h-20"></div>
                    </div>
                  ))}
                </div>
              ) : progress.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start learning by enrolling in your first course
                  </p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {progress.map((courseProgress) => (
                    <div
                      key={courseProgress.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Course {courseProgress.courseId}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>{formatDuration(courseProgress.timeSpent)} watched</span>
                          <span>{courseProgress.completedLectures.length} lectures completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={courseProgress.progressPercentage} className="flex-1" />
                          <span className="text-sm font-medium">
                            {Math.round(courseProgress.progressPercentage)}%
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {courseProgress.completedAt ? (
                          <Badge variant="secondary">
                            <Award className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Continue
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}