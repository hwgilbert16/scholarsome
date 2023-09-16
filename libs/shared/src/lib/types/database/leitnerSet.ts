import { Prisma } from "@prisma/client";

const leitnerSetWithRelations = Prisma.validator<Prisma.LeitnerSetArgs>()({
  include: {
    set: true,
    user: {
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    },
    leitnerCards: {
      select: {
        card: true,
        cardId: true,
        box: true,
        due: true
      }
    },
    studySession: {
      select: {
        startedAt: true,
        learnedCards: true
      }
    }
  }
});

export type LeitnerSet = Prisma.LeitnerSetGetPayload<typeof leitnerSetWithRelations>;
