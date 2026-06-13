import { Constellation } from "@/types/constellation";

export interface ConstellationStats {
  total: number;
  northern: number;
  southern: number;
  zodiac: number;

  largestConstellation: string;
  smallestConstellation: string;

  averageStars: number;
}

export const getFeaturedConstellation = (
  constellations: Constellation[]
): Constellation | null => {
  if (!constellations.length) return null;

  const randomIndex = Math.floor(
    Math.random() * constellations.length
  );

  return constellations[randomIndex];
};

export const getRandomFact = (
  constellations: Constellation[]
): string => {
  if (!constellations.length) return "";

  const randomIndex = Math.floor(
    Math.random() * constellations.length
  );

  return constellations[randomIndex].funFact;
};

export const getConstellationStats = (
  constellations: Constellation[]
): ConstellationStats => {
  if (!constellations.length) {
    return {
      total: 0,
      northern: 0,
      southern: 0,
      zodiac: 0,
      largestConstellation: "-",
      smallestConstellation: "-",
      averageStars: 0,
    };
  }

  const largest =
    [...constellations].sort(
      (a, b) => b.area - a.area
    )[0];

  const smallest =
    [...constellations].sort(
      (a, b) => a.area - b.area
    )[0];

  const averageStars =
    constellations.reduce(
      (sum, c) => sum + c.stars,
      0
    ) / constellations.length;

  return {
    total: constellations.length,

    northern: constellations.filter(
      (c) => c.hemisphere === "Northern"
    ).length,

    southern: constellations.filter(
      (c) => c.hemisphere === "Southern"
    ).length,

    zodiac: constellations.filter(
      (c) => c.zodiac
    ).length,

    largestConstellation: largest.name,

    smallestConstellation: smallest.name,

    averageStars:
      Math.round(averageStars),
  };
};

export const groupBySeason = (
  constellations: Constellation[]
) => {
  return {
    Spring: constellations.filter(
      (c) => c.season === "Spring"
    ),

    Summer: constellations.filter(
      (c) => c.season === "Summer"
    ),

    Autumn: constellations.filter(
      (c) => c.season === "Autumn"
    ),

    Winter: constellations.filter(
      (c) => c.season === "Winter"
    ),
  };
};

export const searchConstellations = (
  constellations: Constellation[],
  query: string
): Constellation[] => {
  if (!query.trim()) return constellations;

  return constellations.filter((constellation) =>
    constellation.name
      .toLowerCase()
      .includes(query.toLowerCase())
  );
};

export const filterConstellations = (
  constellations: Constellation[],
  filter: string
): Constellation[] => {
  switch (filter) {
    case "Northern":
      return constellations.filter(
        (c) => c.hemisphere === "Northern"
      );

    case "Southern":
      return constellations.filter(
        (c) => c.hemisphere === "Southern"
      );

    case "Zodiac":
      return constellations.filter(
        (c) => c.zodiac
      );

    case "Spring":
    case "Summer":
    case "Autumn":
    case "Winter":
      return constellations.filter(
        (c) => c.season === filter
      );

    default:
      return constellations;
  }
};

export const astronomyFacts = [
  "The International Astronomical Union officially recognizes 88 constellations.",
  "Orion contains the famous red supergiant Betelgeuse.",
  "Ursa Major contains the Big Dipper asterism.",
  "Cassiopeia is easily recognized by its W shape.",
  "Crux is the smallest constellation in the sky.",
  "Virgo is the largest zodiac constellation.",
  "Scorpius contains the bright red star Antares.",
  "Cygnus lies along the Milky Way.",
  "Taurus contains the Pleiades star cluster.",
  "Sagittarius points toward the center of the Milky Way.",
  "Gemini represents the twins Castor and Pollux.",
  "Leo represents the Nemean Lion from Greek mythology.",
  "Aquarius is known as the Water Bearer.",
  "Pisces is one of the oldest known constellations.",
  "Aries represents the golden ram of Greek mythology.",
  "Constellations help astronomers divide the sky into regions.",
  "Ancient civilizations used constellations for navigation.",
  "Many constellations originate from Greek mythology.",
  "The Sun passes through zodiac constellations every year.",
  "Not all stars in a constellation are physically related."
];

export const getRandomAstronomyFact = (): string => {
  const index = Math.floor(
    Math.random() * astronomyFacts.length
  );

  return astronomyFacts[index];
};