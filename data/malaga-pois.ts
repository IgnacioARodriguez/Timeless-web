import type { MapPoi } from "@/types/poi"

export const malagaCenterPois: MapPoi[] = [
  {
    id: "muralla-carreteria",
    title: "Muralla almohade de Carretería",
    period: "Muralla almohade · siglo XIII",
    shortDescription:
      "Reconstrucción inmersiva de la fase almohade del lienzo, la torre, la barbacana y la liza conservados en calle Carretería 62–64.",
    locationLabel: "Calle Carretería 62–64",
    status: "available",
    sceneId: "carreteria-almohade",
    previewImage: "/assets/carreteria/panorama.png",
    directions: {
      latitude: 36.723456,
      longitude: -4.423008,
      label: "Muralla de Carretería",
    },
    mapPosition: { x: 18.0, y: 17.4 },
  },
  {
    id: "plaza-constitucion",
    title: "Plaza de la Constitución",
    period: "Centro histórico",
    shortDescription:
      "Punto central del trazado urbano histórico de Málaga. Escena futura.",
    locationLabel: "Plaza de la Constitución",
    status: "coming-soon",
    mapPosition: { x: 26.5, y: 38.5 },
  },
  {
    id: "atarazanas",
    title: "Atarazanas",
    period: "Infraestructura portuaria medieval",
    shortDescription:
      "Reconstrucción inmersiva del entorno de las Atarazanas medievales antes de su transformación en mercado moderno.",
    locationLabel: "Mercado de Atarazanas",
    status: "available",
    sceneId: "atarazanas-nazari",
    previewImage: "/assets/atarazanas/panorama.png",
    directions: {
      latitude: 36.718676,
      longitude: -4.424228,
      label: "Mercado de Atarazanas",
    },
    mapPosition: { x: 9.6, y: 63.3 },
  },
  {
    id: "calle-larios",
    title: "Calle Larios",
    period: "Málaga moderna e histórica",
    shortDescription:
      "Uno de los ejes urbanos más emblemáticos del centro histórico. Escena futura.",
    locationLabel: "Calle Larios",
    status: "coming-soon",
    mapPosition: { x: 28.1, y: 64.5 },
  },
  {
    id: "teatro-romano",
    title: "Teatro Romano",
    period: "Malaca romana",
    shortDescription:
      "Reconstrucción inmersiva del entorno del Teatro Romano en época romana, junto al frente de la Alcazaba.",
    locationLabel: "Calle Alcazabilla",
    status: "available",
    sceneId: "teatro-romano-malaca",
    previewImage: "/assets/teatro-romano/panorama.png",
    directions: {
      latitude: 36.72125299697328,
      longitude: -4.4172272713502485,
      label: "Teatro Romano de Málaga",
    },
    mapPosition: { x: 49.3, y: 37.3 },
  },
  {
    id: "plaza-merced",
    title: "Plaza de la Merced",
    period: "Espacio urbano histórico",
    shortDescription:
      "Entorno histórico destacado del centro de Málaga. Escena futura.",
    locationLabel: "Plaza de la Merced",
    status: "coming-soon",
    mapPosition: { x: 47.4, y: 24.1 },
  },
]