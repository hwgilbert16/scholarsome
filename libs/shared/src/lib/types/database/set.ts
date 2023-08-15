import { Prisma } from "@prisma/client";

const setWithRelations = Prisma.validator<Prisma.SetArgs>()({
  include: { cards: true, author: {
    select: {
      id: true,
      username: true,
      createdAt: true,
      updatedAt: true
    }
  } }
});

export type Set = Prisma.SetGetPayload<typeof setWithRelations>;
