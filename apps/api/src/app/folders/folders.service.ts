import { Injectable } from "@nestjs/common";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { Folder } from "@scholarsome/shared";
import { Request as ExpressRequest } from "express";
import { AuthService } from "../auth/auth.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class FoldersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  /**
   * Verifies whether a folder belongs to a user given their access token cookie
   *
   * @param req Request object of the user
   * @param folderId ID of the set to check against
   *
   * @returns Whether the folder belongs to the user
   */
  public async verifyFolderOwnership(req: ExpressRequest, folderId: string): Promise<boolean> {
    const userCookie = await this.authService.getUserInfo(req);
    if (!userCookie) return false;

    const user = await this.usersService.user({
      id: userCookie.id
    });

    const folder = await this.folder({
      id: folderId
    });

    if (!folder || !user) return false;

    return folder.author.id === user.id;
  }

  /**
   * Queries the database for a unique folder
   *
   * @param folderWhereUniqueInput Prisma `FolderWhereUniqueInput` selector
   *
   * @returns Queried `Folder` object
   */
  async folder(
      folderWhereUniqueInput: Prisma.FolderWhereUniqueInput
  ): Promise<Folder | null> {
    return this.prisma.folder.findUnique({
      where: folderWhereUniqueInput,
      include: {
        sets: true,
        subfolders: true,
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Queries the database for multiple folders
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `Folder` objects
   */
  async folders(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FolderWhereUniqueInput;
    where?: Prisma.FolderWhereInput;
    orderBy?: Prisma.FolderOrderByWithRelationInput;
  }): Promise<Folder[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.folder.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        sets: true,
        subfolders: true,
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Creates a folder in the database
   *
   * @param data Prisma `FolderCreateInput` selector
   *
   * @returns Created `Folder` object
   */
  async createFolder(data: Prisma.FolderCreateInput): Promise<Folder> {
    return this.prisma.folder.create({
      data,
      include: {
        sets: true,
        subfolders: true,
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Updates a folder in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `Folder` object
   */
  async updateFolder(params: {
    where: Prisma.FolderWhereUniqueInput;
    data: Prisma.FolderUpdateInput;
  }): Promise<Folder> {
    const { where, data } = params;
    return this.prisma.folder.update({
      data,
      where,
      include: {
        sets: true,
        subfolders: true,
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Deletes a folder from the database
   *
   * @param where Prisma `FolderWhereUniqueInput` selector
   *
   * @returns `Folder` object that was deleted
   */
  async deleteFolder(where: Prisma.FolderWhereUniqueInput): Promise<Folder> {
    // disconnect subfolders
    await this.prisma.folder.update({
      where,
      data: {
        subfolders: {
          set: []
        }
      }
    });

    return this.prisma.folder.delete({
      where,
      include: {
        sets: true,
        subfolders: true,
        author: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }
}
