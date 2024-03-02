import { Prisma } from "@prisma/client";

const userWithRelations = Prisma.validator<Prisma.UserArgs>()({
  include: {
    sets: true,
    folders: true
  }
});

export type User = Prisma.UserGetPayload<typeof userWithRelations>;
