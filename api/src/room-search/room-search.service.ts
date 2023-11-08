import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomSearchService {
  constructor(private prisma: PrismaService) {}

  //인기순 조회
  async PopularRooms(page: number, perPage: number, category: string) {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const QueryResults = await this.prisma.room.findMany({
      where: { category },
      orderBy: {
        count: 'desc',
      },
      take,
      skip,
    });
    const totalCount = await this.prisma.room.count();
    const nowCount = skip + take;
    const remainingCount = totalCount - nowCount;

    return {
      QueryResults,
      nowCount,
      remainingCount,
      totalCount,
    };
  }

  async LatestRooms(page: number, perPage: number, category: string) {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const QueryResults = await this.prisma.room.findMany({
      where: { category },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    });
    const totalCount = await this.prisma.room.count();
    const nowCount = skip + take;
    const remainingCount = totalCount - nowCount;

    return {
      QueryResults,
      nowCount,
      remainingCount,
      totalCount,
    };
  }

  //? Top10
  async PopularHobbyRoomsTop10() {
    return this.prisma.room.findMany({
      where: { category: 'hobby' },
      orderBy: {
        count: 'desc',
      },
      take: 10,
    });
  }
  async PopularStudyRoomsTop10() {
    return this.prisma.room.findMany({
      where: { category: 'study' },
      orderBy: {
        count: 'desc',
      },
      take: 10,
    });
  }

  async PopularRoomsTop10() {
    return this.prisma.room.findMany({
      orderBy: {
        count: 'desc',
      },
      take: 10,
    });
  }
  async LatestRoomsTop10() {
    return this.prisma.room.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  }

  async OwnersRooms(userId: number) {
    const rooms = await this.prisma.room.findMany({
      where: { ownerId: userId },
    });
    return rooms;
  }

  async searchRooms(
    filter: string,
    search: string,
    page: number,
    perPage: number,
    category: string,
  ) {
    //기본이 인기순
    const skip = (page - 1) * perPage;
    const take = perPage;
    let orderBy: Record<string, 'asc' | 'desc'> = { count: 'desc' };
    if (filter === 'latest') {
      orderBy = { createdAt: 'desc' };
    }
    const QueryResults = await this.prisma.room.findMany({
      where: {
        category,
        title: {
          contains: search,
        },
      },
      orderBy,
      take,
      skip,
    });
    const totalCount = await this.prisma.room.count();
    const nowCount = skip + take;
    const remainingCount = totalCount - nowCount;

    return {
      QueryResults,
      nowCount,
      remainingCount,
      totalCount,
    };
  }
}