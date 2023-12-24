export interface SavedSet {
  title: string;
  description: string;
  private: boolean;
  cards: {
    index: number;
    term: string;
    definition: string
  }[]
}
