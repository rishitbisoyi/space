export type Hemisphere = "Northern" | "Southern";

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";

export interface Constellation {
  id: number;
  name: string;

  image: string;

  brightestStar: string;

  hemisphere: Hemisphere;

  season: Season;

  area: number;

  stars: number;

  mythology: string;

  description: string;

  zodiac: boolean;

  bestViewingMonth: string;

  funFact: string;
}