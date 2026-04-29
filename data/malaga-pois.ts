import type { MapPoi } from "@/types/poi"

export const malagaCenterPois: MapPoi[] = [
  {
    id: "carreteria-62-64",
    title: "Muralla de Carretería",
    period: "Sistema defensivo islámico",
    shortDescription:
      "Reconstrucción inmersiva del lienzo, torre, barbacana y liza conservados en calle Carretería 62–64.",
    locationLabel: "Calle Carretería 62–64",
    status: "available",
    sceneId: "carreteria-1487",
    previewImage: "/assets/carreteria/panorama.jpg",
    directions: {
      lat: 36.723456,
      lng: -4.423008,
      label: "Muralla de Carretería",
    },
    mapPosition: { x: 34, y: 36 },
  },
  {
    id: "plaza-merced",
    title: "Plaza de la Merced",
    period: "Espacio urbano histórico",
    shortDescription:
      "Punto previsto para una futura escena del crecimiento urbano y el borde noreste del centro histórico.",
    locationLabel: "Plaza de la Merced",
    status: "coming-soon",
    mapPosition: { x: 66, y: 28 },
  },
  {
    id: "alcazaba",
    title: "Alcazaba",
    period: "Fortificación palatina",
    shortDescription:
      "Punto previsto para una futura escena del sistema defensivo y palatino de Málaga.",
    locationLabel: "Calle Alcazabilla",
    status: "coming-soon",
    mapPosition: { x: 76, y: 45 },
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
      lat: 36.721207,
      lng: -4.416538,
      label: "Teatro Romano de Málaga",
    },
    mapPosition: { x: 69, y: 51 },
  },
  {
    id: "catedral",
    title: "Catedral de Málaga",
    period: "Edad Moderna",
    shortDescription:
      "Punto previsto para una futura escena sobre la transformación urbana tras la conquista castellana.",
    locationLabel: "Entorno de la Catedral",
    status: "coming-soon",
    mapPosition: { x: 58, y: 59 },
  },
  {
    id: "plaza-constitucion",
    title: "Plaza de la Constitución",
    period: "Centro cívico histórico",
    shortDescription:
      "Punto previsto como nodo central para conectar Larios, Catedral, Carretería y el entorno comercial histórico.",
    locationLabel: "Plaza de la Constitución",
    status: "coming-soon",
    mapPosition: { x: 48, y: 51 },
  },
  {
    id: "calle-larios",
    title: "Calle Larios",
    period: "Eje urbano moderno",
    shortDescription:
      "Punto previsto para explicar la lectura urbana del centro actual y su relación con el casco histórico.",
    locationLabel: "Calle Marqués de Larios",
    status: "coming-soon",
    mapPosition: { x: 46, y: 64 },
  },
  {
    id: "atarazanas",
    title: "Atarazanas",
    period: "Infraestructura portuaria medieval",
    shortDescription:
      "Reconstrucción inmersiva del entorno de las Atarazanas medievales de Málaga antes de su transformación en mercado moderno.",
    locationLabel: "Mercado de Atarazanas",
    status: "available",
    sceneId: "atarazanas-nazari",
    previewImage: "/assets/atarazanas/panorama.png",
    directions: {
      lat: 36.718676,
      lng: -4.424228,
      label: "Mercado de Atarazanas",
    },
    mapPosition: { x: 34, y: 67 },
  },
  {
    id: "parque-puerto",
    title: "Parque y Puerto",
    period: "Borde marítimo histórico",
    shortDescription:
      "Punto previsto para conectar el centro histórico con el frente marítimo y la evolución del puerto.",
    locationLabel: "Parque de Málaga / Muelle Uno",
    status: "coming-soon",
    mapPosition: { x: 72, y: 86 },
  },
]

export function getAvailablePois() {
  return malagaCenterPois.filter((poi) => poi.status === "available")
}
