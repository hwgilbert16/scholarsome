import { Prisma } from "@prisma/client";

const cardWithRelations = Prisma.validator<Prisma.CardArgs>()({
  include: { set: true, media: true }
});

export type Card = Prisma.CardGetPayload<typeof cardWithRelations>;
