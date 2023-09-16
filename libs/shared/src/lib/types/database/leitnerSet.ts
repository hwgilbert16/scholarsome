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
    leitnerCards: true,
    studySession: {
      select: {
        startedAt: true,
        learnedCards: true
      }
    }
  }
});

export type LeitnerSet = Prisma.LeitnerSetGetPayload<typeof leitnerSetWithRelations>;
