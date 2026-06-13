const imageMap: Record<string, string> = {
  Orion:
    "https://images-assets.nasa.gov/image/PIA01322/PIA01322~orig.jpg",

  "Ursa Major":
    "https://cdn.esahubble.org/archives/images/screen/heic0707a.jpg",

  Cassiopeia:
    "https://cdn.esahubble.org/archives/images/screen/heic0506a.jpg",

  Scorpius:
    "https://apod.nasa.gov/apod/image/1707/ScorpiusMilkyWay.jpg",

  Leo:
    "https://cdn.esahubble.org/archives/images/screen/heic1509a.jpg",

  Taurus:
    "https://cdn.esahubble.org/archives/images/screen/heic0910h.jpg",

  Cygnus:
    "https://cdn.esahubble.org/archives/images/screen/heic1608a.jpg",

  Crux:
    "https://cdn.esahubble.org/archives/images/screen/heic1501a.jpg",

  Gemini:
    "https://cdn.esahubble.org/archives/images/screen/heic1006a.jpg",

  Virgo:
    "https://cdn.esahubble.org/archives/images/screen/heic0817a.jpg",

  Sagittarius:
    "https://cdn.esahubble.org/archives/images/screen/heic1109a.jpg",

  Capricornus:
    "https://cdn.esahubble.org/archives/images/screen/heic0619a.jpg",

  Aquarius:
    "https://cdn.esahubble.org/archives/images/screen/heic0715a.jpg",

  Pisces:
    "https://cdn.esahubble.org/archives/images/screen/heic0406a.jpg",

  Aries:
    "https://cdn.esahubble.org/archives/images/screen/heic0503a.jpg",
};

export function getConstellationImage(
  name: string
): string {
  return (
    imageMap[name] ??
    "https://images-assets.nasa.gov/image/PIA01322/PIA01322~orig.jpg"
  );
}