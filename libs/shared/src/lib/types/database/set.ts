import { Prisma } from "@prisma/client";

const setWithRelations = Prisma.validator<Prisma.SetArgs>()({
  include: { cards: true, author: true }
});

export type Set = Prisma.SetGetPayload<typeof setWithRelations>;
