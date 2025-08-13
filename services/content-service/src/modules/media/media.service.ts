import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProcessVideoDto } from './dto/process-video.dto';

@Injectable()
export class MediaService {
  private processingJobs = new Map<string, any>();

  constructor(private configService: ConfigService) {}

  async processVideo(processVideoDto: ProcessVideoDto) {
    const jobId = this.generateJobId();
    
    // Simulate video processing
    this.processingJobs.set(jobId, {
      id: jobId,
      status: 'processing',
      progress: 0,
      startedAt: new Date(),
      ...processVideoDto,
    });

    // Simulate async processing
    this.simulateProcessing(jobId);

    return {
      jobId,
      status: 'processing',
      message: 'Video processing started',
    };
  }

  async getProcessingStatus(jobId: string) {
    const job = this.processingJobs.get(jobId);

    if (!job) {
      return {
        jobId,
        status: 'not_found',
        message: 'Job not found',
      };
    }

    return job;
  }

  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private async simulateProcessing(jobId: string) {
    const job = this.processingJobs.get(jobId);
    if (!job) return;

    // Simulate processing progress
    const intervals = [25, 50, 75, 100];
    
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      job.progress = progress;
      job.updatedAt = new Date();

      if (progress === 100) {
        job.status = 'completed';
        job.completedAt = new Date();
        job.hlsUrl = `https://cdn.example.com/${job.contentId}/playlist.m3u8`;
        job.thumbnailUrl = `https://cdn.example.com/${job.contentId}/thumbnail.jpg`;
        job.duration = 1200; // 20 minutes
      }

      this.processingJobs.set(jobId, job);
    }

    // Clean up job after 1 hour
    setTimeout(() => {
      this.processingJobs.delete(jobId);
    }, 60 * 60 * 1000);
  }
}