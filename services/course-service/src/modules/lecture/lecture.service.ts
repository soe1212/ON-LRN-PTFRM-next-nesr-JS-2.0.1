import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Injectable()
export class LectureService {
  constructor(private prisma: PrismaService) {}

  async create(createLectureDto: CreateLectureDto) {
    return this.prisma.lecture.create({
      data: createLectureDto,
      include: {
        resources: true,
      },
    });
  }

  async findBySection(sectionId: string) {
    return this.prisma.lecture.findMany({
      where: { sectionId },
      include: {
        resources: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id },
      include: {
        resources: true,
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return lecture;
  }

  async update(id: string, updateLectureDto: UpdateLectureDto) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    return this.prisma.lecture.update({
      where: { id },
      data: updateLectureDto,
      include: {
        resources: true,
      },
    });
  }

  async remove(id: string) {
    const lecture = await this.prisma.lecture.findUnique({
      where: { id },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    await this.prisma.lecture.delete({
      where: { id },
    });

    return { message: 'Lecture deleted successfully' };
  }
}