/* eslint-disable no-unused-vars */

/*
Enum for the number of days to increment each box when a card is successfully learned.

i.e. if going from box 3 to box 4, +3 until next study session
 */

export enum LeitnerIncrements {
  BOX_2 = 1,
  BOX_3 = 2,
  BOX_4 = 3,
  BOX_5 = 5,
  BOX_6 = 10,
  BOX_7 = 25,
  BOX_8 = 40
}
