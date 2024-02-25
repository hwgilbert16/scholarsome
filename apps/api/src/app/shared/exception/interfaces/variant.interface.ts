export interface Variant {
  new (): {};
}

export interface CustomizableVariant {
  new (customDetail?: string): {};
}
