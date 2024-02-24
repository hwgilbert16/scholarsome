import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { FoldersService } from "./folders.service";
import { Request as ExpressRequest } from "express";
import { ApiResponse, ApiResponseOptions, Folder } from "@scholarsome/shared";
import { UserIdParam } from "../users/param/userId.param";
import { UsersService } from "../users/users.service";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { HtmlDecodePipe } from "../sets/pipes/html-decode.pipe";
import { CreateFolderDto } from "./dto/createFolder.dto";
import { FolderIdParam } from "./param/folderId.param";
import { UpdateFolderDto } from "./dto/updateFolder.dto";
import { SetsService } from "../sets/sets.service";

@ApiTags("Sets")
@Controller("sets/folders")
export class FoldersController {
  constructor(
    private readonly authService: AuthService,
    private readonly foldersService: FoldersService,
    private readonly usersService: UsersService,
    private readonly setsService: SetsService
  ) {
  }

  /**
   * Gets the folders of the authenticated user
   *
   * @returns Array of `Folder` objects that belong to the authenticated user
   * @remarks This MUST be placed before the "user/:userId" route to ensure this is mapped
   */
  @ApiOperation({
    summary: "Get the folders of the authenticated user",
    description: "Gets all of the folders of the user that is currently authenticated"
  })
  @UseGuards(AuthenticatedGuard)
  @Get("user/me")
  async myFolders(@Request() req: ExpressRequest): Promise<ApiResponse<Folder[]>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) {
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource"
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.foldersService.folders({
        where: {
          authorId: user.id
        }
      })
    };
  }

  /**
   * Gets the folders of a user given an author ID
   *
   * @returns Array of `Folder` objects that belong to the user
   */
  @ApiOperation({
    summary: "Get the folders of a user"
  })
  @Get("user/:userId")
  async folders(@Request() req: ExpressRequest, @Param() params: UserIdParam): Promise<ApiResponse<Folder[]>> {
    const userCookie = await this.authService.getUserInfo(req);

    // if a user is requesting their own folders -> don't filter private sets
    if (userCookie && params.userId === userCookie.id) {
      return {
        status: ApiResponseOptions.Success,
        data: await this.foldersService.folders({
          where: {
            authorId: params.userId
          }
        })
      };
    }

    const user = await this.usersService.user({
      id: params.userId
    });
    if (!user) {
      throw new NotFoundException({ status: "fail", message: "User not found" });
    }

    const folders = await this.foldersService.folders({
      where: {
        authorId: params.userId
      }
    });

    for (let i = 0; i < folders.length; i++) {
      folders[i].sets = folders[i].sets.filter((s) => !s.private);
    }

    return {
      status: ApiResponseOptions.Success,
      data: folders
    };
  }

  /**
   * Gets a folder given a folder ID
   *
   * @returns `Folder` object
   */
  @ApiOperation({
    summary: "Get a folder"
  })
  @Get(":folderId")
  async folder(@Param() params: FolderIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Folder>> {
    const folder = await this.foldersService.folder({
      id: params.folderId
    });
    if (!folder) throw new NotFoundException({ status: "fail", message: "Folder not found" });

    if (folder.private) {
      const userCookie = await this.authService.getUserInfo(req);

      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      if (folder.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: folder
    };
  }

  /**
   * Creates a folder
   *
   * @returns Created `Folder` object
   */
  @ApiOperation({
    summary: "Create a folder"
  })
  @UseGuards(AuthenticatedGuard)
  @Post()
  async createFolder(@Body(HtmlDecodePipe) body: CreateFolderDto, @Request() req: ExpressRequest): Promise<ApiResponse<Folder>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) {
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource"
      });
    }

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) {
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource"
      });
    }

    if (
      body.parentFolderId &&
      !author.folders.map((f) => f.id).includes(body.parentFolderId)
    ) {
      throw new NotFoundException({
        status: "fail",
        message: "Parent folder does not exist"
      });
    }

    for (const setId of body.sets) {
      const set = await this.setsService.set({
        id: setId
      });

      if (!set) {
        throw new NotFoundException({ status: "fail", message: `Set with ID ${setId} does not exist` });
      }
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.foldersService.createFolder({
        author: {
          connect: {
            email: author.email
          }
        },
        name: body.name,
        description: body.description,
        color: body.color,
        private: body.private,
        parentFolder: body.parentFolderId ? {
          connect: {
            id: body.parentFolderId
          }
        } : {},
        sets: {
          connect: body.sets.map((s) => {
            return { id: s };
          })
        }
      })
    };
  }

  /**
   * Updates a folder
   *
   * @returns Updated `Folder` object
   */
  @ApiOperation({
    summary: "Create a folder"
  })
  @UseGuards(AuthenticatedGuard)
  @Patch(":folderId")
  async updateFolder(@Param() params: FolderIdParam, @Body(HtmlDecodePipe) body: UpdateFolderDto, @Request() req: ExpressRequest): Promise<ApiResponse<Folder>> {
    const folder = await this.foldersService.folder({
      id: params.folderId
    });
    if (!folder) throw new NotFoundException({ status: "fail", message: "Folder not found" });

    if (!(await this.foldersService.verifyFolderOwnership(req, params.folderId))) {
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource"
      });
    }

    const currentSetIDs = folder.sets.map((s) => s.id);
    const removedSetIDs = currentSetIDs.filter((id) => !body.sets.includes(id));
    const newSetIDs = body.sets.filter((id) => !currentSetIDs.includes(id));

    const currentSubfolderIDs = folder.subfolders.map((f) => f.id);
    const removedSubfolderIDs = currentSubfolderIDs.filter((id) => !body.subfolders.includes(id));
    const newSubfolderIDs = body.subfolders.filter((id) => !currentSubfolderIDs.includes(id));

    return {
      status: ApiResponseOptions.Success,
      data: await this.foldersService.updateFolder({
        where: {
          id: params.folderId
        },
        data: {
          name: body.name,
          description: body.description,
          color: body.color,
          private: body.private,
          subfolders: {
            connect: newSubfolderIDs.map((s) => {
              return { id: s };
            }),
            disconnect: removedSubfolderIDs.map((s) => {
              return { id: s };
            })
          },
          sets: {
            connect: newSetIDs.map((s) => {
              return { id: s };
            }),
            disconnect: removedSetIDs.map((s) => {
              return { id: s };
            })
          }
        }
      })
    };
  }

  /**
   * Deletes a folder
   *
   * @returns Deleted `Folder` Object
   */
  @ApiOperation( {
    summary: "Delete a folder"
  })
  @UseGuards(AuthenticatedGuard)
  @Delete(":folderId")
  async deleteFolder(@Param() params: FolderIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Folder>> {
    if (!(await this.foldersService.verifyFolderOwnership(req, params.folderId))) {
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource"
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.foldersService.deleteFolder({
        id: params.folderId
      })
    };
  }
}
