import { Prisma } from "@prisma/client";

const leitnerCardWithRelations = Prisma.validator<Prisma.LeitnerCardArgs>()({
  select: {
    card: true,
    cardId: true,
    box: true,
    due: true
  }
});

export type LeitnerCard = Prisma.LeitnerCardGetPayload<typeof leitnerCardWithRelations>;
