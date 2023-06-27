export type DecodeAnkiApkgReturn = {
  cards: {
    term: string;
    definition: string;
    index: number;
  }[],
  mediaLegend: string[][]
}
