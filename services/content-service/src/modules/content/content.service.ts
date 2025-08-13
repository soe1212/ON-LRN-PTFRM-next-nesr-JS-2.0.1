import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { Content, ContentDocument } from './schemas/content.schema';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  private minioClient: Minio.Client;

  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    private configService: ConfigService,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('minio.endpoint'),
      port: this.configService.get('minio.port'),
      useSSL: this.configService.get('minio.useSSL'),
      accessKey: this.configService.get('minio.accessKey'),
      secretKey: this.configService.get('minio.secretKey'),
    });

    this.initializeBucket();
  }

  async create(createContentDto: CreateContentDto) {
    const content = new this.contentModel(createContentDto);
    return content.save();
  }

  async uploadFile(file: Express.Multer.File, courseId: string, lectureId: string) {
    const bucketName = this.configService.get('minio.bucketName');
    const fileName = `${courseId}/${lectureId}/${Date.now()}-${file.originalname}`;

    try {
      // Upload file to MinIO
      await this.minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });

      // Generate presigned URL for access
      const fileUrl = await this.minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60); // 24 hours

      // Save content metadata to database
      const content = new this.contentModel({
        courseId,
        lectureId,
        fileName: file.originalname,
        fileUrl,
        mimeType: file.mimetype,
        size: file.size,
        storageKey: fileName,
        status: 'uploaded',
      });

      await content.save();

      return {
        id: content._id,
        fileName: file.originalname,
        fileUrl,
        size: file.size,
        mimeType: file.mimetype,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async findAll(filters: { courseId?: string; lectureId?: string }) {
    const query: any = {};

    if (filters.courseId) {
      query.courseId = filters.courseId;
    }

    if (filters.lectureId) {
      query.lectureId = filters.lectureId;
    }

    return this.contentModel.find(query).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const content = await this.contentModel.findById(id);

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    const content = await this.contentModel.findByIdAndUpdate(
      id,
      updateContentDto,
      { new: true },
    );

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async remove(id: string) {
    const content = await this.contentModel.findById(id);

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    // Delete file from MinIO
    if (content.storageKey) {
      try {
        await this.minioClient.removeObject(
          this.configService.get('minio.bucketName'),
          content.storageKey,
        );
      } catch (error) {
        console.error('Failed to delete file from storage:', error);
      }
    }

    // Delete content record
    await this.contentModel.findByIdAndDelete(id);

    return { message: 'Content deleted successfully' };
  }

  private async initializeBucket() {
    const bucketName = this.configService.get('minio.bucketName');

    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        console.log(`Created bucket: ${bucketName}`);
      }
    } catch (error) {
      console.error('Error initializing bucket:', error);
    }
  }
}