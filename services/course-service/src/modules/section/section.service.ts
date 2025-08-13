import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto) {
    return this.prisma.section.create({
      data: createSectionDto,
      include: {
        lectures: {
          include: {
            resources: true,
          },
        },
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.section.findMany({
      where: { courseId },
      include: {
        lectures: {
          include: {
            resources: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: {
        lectures: {
          include: {
            resources: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
      include: {
        lectures: {
          include: {
            resources: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const section = await this.prisma.section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await this.prisma.section.delete({
      where: { id },
    });

    return { message: 'Section deleted successfully' };
  }
}