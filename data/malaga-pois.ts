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
    iconImage: "/assets/carreteria/poi-muralla.png",
    directions: {
      latitude: 36.723456,
      longitude: -4.423008,
      label: "Muralla de Carretería",
    },
    coordinates: { latitude: 36.723456, longitude: -4.423008 },
    mapPosition: { x: 18.0, y: 17.4 },
    i18n: {
      en: {
        title: "Almohad Wall of Carretería",
        period: "Almohad wall · 13th century",
        shortDescription:
          "Immersive reconstruction of the Almohad phase of the wall, tower, barbican and defensive corridor preserved at Calle Carretería 62–64.",
        locationLabel: "Calle Carretería 62–64",
        directionsLabel: "Carretería wall",
      },
    },
  },
  {
    id: "plaza-constitucion",
    title: "Plaza de la Constitución",
    period: "Centro histórico",
    shortDescription:
      "Punto central del trazado urbano histórico de Málaga. Escena futura.",
    locationLabel: "Plaza de la Constitución",
    status: "coming-soon",
    coordinates: { latitude: 36.72025, longitude: -4.42162 },
    mapPosition: { x: 26.5, y: 38.5 },
    i18n: {
      en: {
        title: "Plaza de la Constitución",
        period: "Historic centre",
        shortDescription: "Central point of Málaga’s historic urban layout. Future scene.",
        locationLabel: "Plaza de la Constitución",
      },
    },
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
    previewImage: "/assets/atarazanas/reconstruccion-atarazanas-v2.png",
    iconImage: "/assets/atarazanas/poi-atarazanas.png",
    directions: {
      latitude: 36.718676,
      longitude: -4.424228,
      label: "Mercado de Atarazanas",
    },
    coordinates: { latitude: 36.718676, longitude: -4.424228 },
    mapPosition: { x: 9.6, y: 63.3 },
    i18n: {
      en: {
        title: "Atarazanas",
        period: "Medieval port infrastructure",
        shortDescription:
          "Immersive reconstruction of the area around the medieval Atarazanas before its transformation into the modern market.",
        locationLabel: "Atarazanas Market",
        directionsLabel: "Atarazanas Market",
      },
    },
  },
  {
    id: "calle-larios",
    title: "Calle Larios",
    period: "Málaga burguesa · 1891",
    shortDescription:
      "Reconstrucción inmersiva de Calle Larios en su etapa inicial como gran avenida moderna, comercial y burguesa del centro de Málaga.",
    locationLabel: "Calle Marqués de Larios",
    status: "available",
    sceneId: "calle-larios-1891",
    previewImage: "/assets/calle-larios/larios-1891-reconstruction.png",
    iconImage: "/assets/calle-larios/poi-calle-larios.png",
    directions: {
      latitude: 36.718271,
      longitude: -4.421444,
      label: "Calle Larios",
    },
    coordinates: { latitude: 36.718271, longitude: -4.421444 },
    mapPosition: { x: 28.1, y: 64.5 },
    i18n: {
      en: {
        title: "Calle Larios",
        period: "Bourgeois Málaga · 1891",
        shortDescription:
          "Immersive reconstruction of Calle Larios in its early stage as Málaga centre's modern, commercial and bourgeois avenue.",
        locationLabel: "Calle Marqués de Larios",
        directionsLabel: "Calle Larios",
      },
    },
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
    iconImage: "/assets/teatro-romano/poi-teatro.png",
    directions: {
      latitude: 36.72125299697328,
      longitude: -4.4172272713502485,
      label: "Teatro Romano de Málaga",
    },
    coordinates: {
      latitude: 36.72125299697328,
      longitude: -4.4172272713502485,
    },
    mapPosition: { x: 49.3, y: 37.3 },
    i18n: {
      en: {
        title: "Roman Theatre",
        period: "Roman Malaca",
        shortDescription:
          "Immersive reconstruction of the Roman Theatre area in Roman times, beside the slope of the Alcazaba.",
        locationLabel: "Calle Alcazabilla",
        directionsLabel: "Roman Theatre of Málaga",
      },
    },
  },
  {
    id: "plaza-merced",
    title: "Plaza de la Merced",
    period: "Espacio urbano histórico",
    shortDescription:
      "Entorno histórico destacado del centro de Málaga. Escena futura.",
    locationLabel: "Plaza de la Merced",
    status: "coming-soon",
    coordinates: { latitude: 36.72324, longitude: -4.41573 },
    mapPosition: { x: 47.4, y: 24.1 },
    i18n: {
      en: {
        title: "Plaza de la Merced",
        period: "Historic urban space",
        shortDescription: "A notable historic setting in central Málaga. Future scene.",
        locationLabel: "Plaza de la Merced",
      },
    },
  },
]
