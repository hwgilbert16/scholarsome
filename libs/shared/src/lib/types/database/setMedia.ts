import { Prisma } from "@prisma/client";

const setMediaWithRelations = Prisma.validator<Prisma.SetMediaArgs>()({
  include: { set: true }
});

export type SetMedia = Prisma.SetMediaGetPayload<typeof setMediaWithRelations>;
