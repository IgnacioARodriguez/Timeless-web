import type { TimelessCity } from "@/types/city"

export const timelessCities: TimelessCity[] = [
  {
    id: "malaga",
    name: "Málaga",
    country: "España",
    regionLabel: "Centro histórico",
    description:
      "Explora murallas, Atarazanas, el puerto histórico, Calle Larios y Malaca romana desde puntos reales de activación en el centro histórico.",
    highlights: ["Carretería", "Atarazanas", "Puerto 1791", "Calle Larios", "Teatro Romano"],
    scenesCount: 5,
    status: "available",
    href: "/",
    coverImage: "/assets/carreteria/panorama.png",
    accentLabel: "Disponible ahora",
    i18n: {
      en: {
        country: "Spain",
        regionLabel: "Historic centre",
        description:
          "Explore walls, the Atarazanas, the historic port, Calle Larios and Roman Malaca from real activation points in the historic centre.",
        highlights: ["Carretería", "Atarazanas", "Port 1791", "Calle Larios", "Roman Theatre"],
        accentLabel: "Available now",
      },
    },
  },
  {
    id: "roma",
    name: "Roma",
    country: "Italia",
    regionLabel: "Antigua Roma",
    description:
      "Foro, Coliseo y espacios monumentales pensados como futuras experiencias inmersivas.",
    highlights: ["Foro Romano", "Coliseo", "Vía Sacra"],
    scenesCount: 0,
    status: "coming-soon",
    accentLabel: "Próximamente",
    i18n: {
      en: {
        country: "Italy",
        regionLabel: "Ancient Rome",
        description:
          "Forum, Colosseum and monumental spaces designed as future immersive experiences.",
        highlights: ["Roman Forum", "Colosseum", "Via Sacra"],
        accentLabel: "Coming soon",
      },
    },
  },
  {
    id: "granada",
    name: "Granada",
    country: "España",
    regionLabel: "Ciudad nazarí",
    description:
      "Una futura colección para recorrer el paisaje urbano andalusí y sus puntos defensivos.",
    highlights: ["Albaicín", "Alhambra", "Puertas medievales"],
    scenesCount: 0,
    status: "coming-soon",
    accentLabel: "Próximamente",
    i18n: {
      en: {
        country: "Spain",
        regionLabel: "Nasrid city",
        description:
          "A future collection to explore the Andalusi urban landscape and its defensive points.",
        highlights: ["Albaicín", "Alhambra", "Medieval gates"],
        accentLabel: "Coming soon",
      },
    },
  },
  {
    id: "cordoba",
    name: "Córdoba",
    country: "España",
    regionLabel: "Capital califal",
    description:
      "Una futura ciudad para reconstruir capas romanas, visigodas e islámicas del centro histórico.",
    highlights: ["Mezquita", "Puente romano", "Medina"],
    scenesCount: 0,
    status: "coming-soon",
    accentLabel: "Próximamente",
    i18n: {
      en: {
        country: "Spain",
        regionLabel: "Caliphal capital",
        description:
          "A future city to reconstruct Roman, Visigothic and Islamic layers of the historic centre.",
        highlights: ["Mosque-Cathedral", "Roman bridge", "Medina"],
        accentLabel: "Coming soon",
      },
    },
  },
]

export function getCityById(id: string) {
  return timelessCities.find((city) => city.id === id)
}

export function getAvailableCities() {
  return timelessCities.filter((city) => city.status === "available")
}
