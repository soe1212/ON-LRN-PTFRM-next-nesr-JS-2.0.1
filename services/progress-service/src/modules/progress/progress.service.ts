import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    return this.prisma.progress.findMany({
      where: { userId },
      orderBy: { lastAccessedAt: 'desc' },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    let progress = await this.prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!progress) {
      // Create initial progress record
      progress = await this.prisma.progress.create({
        data: {
          userId,
          courseId,
          completedLectures: [],
          progressPercentage: 0,
          timeSpent: 0,
        },
      });
    }

    return progress;
  }

  async updateProgress(updateProgressDto: UpdateProgressDto) {
    const { userId, courseId, lectureId, timeSpent } = updateProgressDto;

    const existingProgress = await this.prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    let completedLectures: string[] = [];
    let newTimeSpent = timeSpent || 0;

    if (existingProgress) {
      completedLectures = existingProgress.completedLectures;
      newTimeSpent = existingProgress.timeSpent + (timeSpent || 0);
    }

    // Add lecture to completed if not already there
    if (lectureId && !completedLectures.includes(lectureId)) {
      completedLectures.push(lectureId);
    }

    // Calculate progress percentage (simplified - in real app, get total lectures from course service)
    const progressPercentage = Math.min((completedLectures.length / 20) * 100, 100);

    const progress = await this.prisma.progress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        completedLectures,
        currentLecture: lectureId,
        progressPercentage,
        timeSpent: newTimeSpent,
        lastAccessedAt: new Date(),
        completedAt: progressPercentage === 100 ? new Date() : null,
      },
      create: {
        userId,
        courseId,
        completedLectures,
        currentLecture: lectureId,
        progressPercentage,
        timeSpent: newTimeSpent,
      },
    });

    // Update learning streak
    await this.updateLearningStreak(userId);

    return progress;
  }

  async getCourseAnalytics(courseId: string) {
    const progressRecords = await this.prisma.progress.findMany({
      where: { courseId },
    });

    const totalEnrolled = progressRecords.length;
    const completed = progressRecords.filter(p => p.completedAt).length;
    const inProgress = progressRecords.filter(p => !p.completedAt && p.progressPercentage > 0).length;
    const notStarted = progressRecords.filter(p => p.progressPercentage === 0).length;

    const averageProgress = totalEnrolled > 0 
      ? progressRecords.reduce((sum, p) => sum + p.progressPercentage, 0) / totalEnrolled 
      : 0;

    const averageTimeSpent = totalEnrolled > 0
      ? progressRecords.reduce((sum, p) => sum + p.timeSpent, 0) / totalEnrolled
      : 0;

    return {
      courseId,
      totalEnrolled,
      completed,
      inProgress,
      notStarted,
      completionRate: totalEnrolled > 0 ? (completed / totalEnrolled) * 100 : 0,
      averageProgress,
      averageTimeSpent,
    };
  }

  private async updateLearningStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streak = await this.prisma.learningStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      await this.prisma.learningStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: today,
        },
      });
      return;
    }

    const lastStudyDate = streak.lastStudyDate;
    if (!lastStudyDate) {
      await this.prisma.learningStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak),
          lastStudyDate: today,
        },
      });
      return;
    }

    const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, no update needed
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      const newStreak = streak.currentStreak + 1;
      await this.prisma.learningStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastStudyDate: today,
        },
      });
    } else {
      // Streak broken
      await this.prisma.learningStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          lastStudyDate: today,
        },
      });
    }
  }
}