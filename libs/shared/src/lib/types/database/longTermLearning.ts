import { Prisma } from "@prisma/client";

const longTermLearningWithRelations = Prisma.validator<Prisma.LongTermLearningArgs>()({
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
    learningCards: true
  }
});

export type LongTermLearning = Prisma.LongTermLearningGetPayload<typeof longTermLearningWithRelations>;
