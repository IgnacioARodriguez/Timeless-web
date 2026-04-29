import type { TimelessCity } from "@/types/city"

export const timelessCities: TimelessCity[] = [
  {
    id: "malaga",
    name: "Málaga",
    country: "España",
    regionLabel: "Centro histórico",
    description:
      "Explora murallas, Atarazanas y Malaca romana desde puntos reales de activación en el centro histórico.",
    highlights: ["Carretería", "Atarazanas", "Teatro Romano"],
    scenesCount: 3,
    status: "available",
    href: "/cities/malaga",
    coverImage: "/assets/carreteria/hero-malaga.png",
    accentLabel: "Disponible ahora",
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
  },
]

export function getCityById(id: string) {
  return timelessCities.find((city) => city.id === id)
}

export function getAvailableCities() {
  return timelessCities.filter((city) => city.status === "available")
}
