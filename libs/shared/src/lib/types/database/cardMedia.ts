import { Prisma } from "@prisma/client";

const cardMediaWithRelations = Prisma.validator<Prisma.CardMediaArgs>()({
  include: { card: true }
});

export type CardMedia = Prisma.CardMediaGetPayload<typeof cardMediaWithRelations>;
