"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type Language = "es" | "en"

export const copy = {
  es: {
    navDemo: "Demo",
    navPilot: "Piloto Málaga",
    navContact: "Contacto",
    languageLabel: "Idioma",
    heroLabel: "Piloto cultural · Málaga",
    heroTitle: "Ver el pasado desde el lugar real",
    heroText:
      "Timeless convierte puntos históricos de la ciudad en experiencias inmersivas 180° accesibles desde el móvil, permitiendo visualizar cómo pudieron haber sido en una época concreta.",
    heroPrimary: "Ver demo",
    heroSecondary: "Conocer el piloto Málaga",
    heroWhatTitle: "Qué es",
    heroWhatText: "Visualización histórica 180° en el lugar real.",
    heroForTitle: "Para quién",
    heroForText: "Visitantes, guías, instituciones y rutas culturales.",
    heroDiffTitle: "Diferencial",
    heroDiffText: "No solo explica el patrimonio: permite verlo.",
    demoAvailable: "Demo disponible",
    openExperience: "Abrir experiencia 180°",
    heroSceneTitle: "Teatro Romano de Málaga",
    problemLabel: "Problema",
    problemTitle: "El patrimonio no siempre se entiende a simple vista.",
    problemText:
      "Muchos visitantes recorren restos arqueológicos, murallas, edificios transformados o espacios históricos parcialmente desaparecidos sin poder imaginar cómo eran originalmente ni qué papel tuvieron dentro de la ciudad. La información existe, pero la experiencia visual suele limitarse a carteles, audioguías o explicaciones abstractas.",
    solutionLabel: "Solución",
    solutionTitle: "Una reconstrucción inmersiva asociada a un punto real de la ciudad.",
    solutionText:
      "Timeless permite acceder desde el móvil a una reconstrucción histórica inmersiva asociada a un punto real de la ciudad. La experiencia ayuda al visitante a comprender el patrimonio de forma visual, directa y contextualizada, sin necesidad de instalar una app ni utilizar gafas VR.",
    demoLabel: "Demo visible",
    demoTitle: "Abre una experiencia 180° ahora.",
    demoText:
      "La demo muestra el flujo real del prototipo: entrada desde móvil, permisos de cámara y movimiento, alineación y visualización inmersiva de la escena histórica.",
    pilotLabel: "Caso piloto Málaga",
    pilotTitle: "Tres escenas para demostrar valor cultural real.",
    seeScene: "Ver escena",
    diffLabel: "Diferencial",
    diffTitle:
      "A diferencia de una audioguía, una app cultural o una visita virtual tradicional, Timeless no solo explica el patrimonio: permite verlo desde el lugar real.",
    techLabel: "Tecnología",
    techTitle: "Web mobile-first con visualización 180°.",
    techText:
      "Timeless utiliza una arquitectura web mobile-first basada en React / Next.js y visualización inmersiva con Three.js / WebGL. El prototipo permite mostrar escenas históricas en formato 180° monoscópico equirectangular desde navegador móvil.",
    businessLabel: "Modelo de negocio",
    businessTitle: "B2B/B2G para rutas, instituciones y patrimonio.",
    businessText:
      "Timeless plantea un modelo B2B/B2G basado en pilotos por punto histórico, paquetes de rutas inmersivas y licencias anuales de mantenimiento, soporte y actualización de contenidos.",
    finalUsersLabel: "Usuarios finales",
    clientsLabel: "Clientes potenciales",
    contactLabel: "Contacto",
    contactHeadline: "Timeless permite ver el pasado desde el lugar real.",
    founderRole: "Founder & Product Lead",
    cityLocation: "Málaga, España",
    viewPilotMap: "Ver mapa del piloto Málaga",
    sceneRomanTheatre: "Teatro Romano de Málaga",
    sceneRomanTheatreDescription: "Reconstrucción visual del teatro en época romana para facilitar su comprensión histórica.",
    sceneWall: "Muralla medieval de Calle Carretería",
    sceneWallDescription: "Reconstrucción 180° de un sector de la muralla occidental medieval de Málaga.",
    sceneAtarazanas: "Atarazanas medievales",
    sceneAtarazanasDescription: "Visualización del antiguo espacio marítimo y defensivo asociado a las Atarazanas.",
    diffNoNative: "No requiere app nativa.",
    diffNoVr: "No requiere gafas VR.",
    diffBrowser: "Funciona desde navegador móvil.",
    diffRoutes: "Se adapta a rutas culturales.",
    diffScalable: "Es escalable por escenas y ciudades.",
    diffFragmented: "Está pensado para patrimonio perdido, fragmentado o difícil de imaginar.",
    userTourists: "Turistas culturales",
    userResidents: "Residentes",
    userStudents: "Estudiantes",
    userVisitors: "Visitantes de centros históricos",
    userGuides: "Guías turísticos",
    clientCityHalls: "Ayuntamientos",
    clientMuseums: "Museos",
    clientTourism: "Oficinas de turismo",
    clientFoundations: "Fundaciones patrimoniales",
    clientTours: "Empresas de visitas guiadas",
    clientEducation: "Instituciones educativas",
    backToMalagaMap: "Volver al mapa de Málaga",
    backPrevious: "Volver a la vista anterior",
    beginExperience: "Comenzar la experiencia",
    permissionsRequired: "Se requiere acceso para cámara y detección de movimiento",
    beforeStart: "Antes de empezar",
    permissionsTitle: "Acepta los permisos para iniciar la experiencia de cámara y movimiento",
    requesting: "Solicitando...",
    acceptPermissions: "Aceptar permisos e iniciar",
    cameraRequiredError: "El acceso a la cámara es necesario para la calibración. Permite el acceso desde la configuración del navegador e inténtalo de nuevo.",
    calibration: "Calibración",
    calibrationWithOverlay: "Mueve el móvil hasta alinear la referencia histórica con el lugar actual. Ajusta la transparencia si hace falta.",
    calibrationWithoutOverlay: "Colócate mirando hacia el punto histórico y pulsa listo para entrar en el visor inmersivo.",
    ready: "Listo",
    preparing: "Preparando…",
    cameraAccessError: "No se ha podido acceder a la cámara. Permite el acceso e inténtalo de nuevo.",
    somethingWrong: "Algo salió mal",
    unableContinue: "No se ha podido continuar",
    tryAgain: "Intentar de nuevo",
    unexpectedError: "Ocurrió un error inesperado.",
    preparingExperience: "Preparando experiencia",
    playbackError: "Error de reproducción",
    retry: "Reintentar",
    videoLoadError: "No se ha podido cargar el vídeo de la experiencia.",
    imageLoadError: "No se ha podido cargar la imagen panorámica.",
    nowViewing: "Viendo ahora",
    openInfo: "Abrir información",
    historicalPoint: "Punto histórico",
    closeHistoricalPoint: "Cerrar punto histórico",
    explanatoryAudio: "Audio explicativo",
    help: "Ayuda",
    helpGyro: "Gira el móvil para mirar alrededor. También puedes arrastrar con el dedo para ajustar la vista.",
    helpDrag: "Arrastra con el dedo para mirar alrededor de la escena.",
    helpCalibrationAnchor: "La vista queda anclada a la calibración inicial.",
    gotIt: "Entendido",
    closeHelp: "Cerrar ayuda",
    ambientSound: "Sonido ambiente",
    soundOn: "Sonido",
    soundOff: "Silencio",
    mute: "Silencio",
    unmute: "Sonido",
    replay: "Repetir",
    exitExperience: "Salir de la experiencia",
    mapBack: "Volver al inicio",
    mapLabel: "Mapa de experiencias",
    mapDescription: "Selecciona una escena, entra al visor 180° o abre la ruta hasta el punto exacto de activación.",
    availableScenes: "Escenas disponibles",
    scenes: "escenas",
    scene: "escena",
    northUp: "Norte arriba",
    selectPoi: "Seleccionar",
    available: "Disponible",
    comingSoon: "Próximamente",
    openViewer: "Entrar al visor 180°",
    howToArrive: "Cómo llegar",
    exactPoint: "Punto de activación",
    futureScene: "Escena futura",
    cityCountry: "España",
    cityRegion: "Centro histórico",
  },
  en: {
    navDemo: "Demo",
    navPilot: "Málaga pilot",
    navContact: "Contact",
    languageLabel: "Language",
    heroLabel: "Cultural pilot · Málaga",
    heroTitle: "See the past from the real place",
    heroText:
      "Timeless turns historical points in the city into mobile-accessible 180° immersive experiences, helping visitors visualize how they may have looked in a specific period.",
    heroPrimary: "View demo",
    heroSecondary: "Explore the Málaga pilot",
    heroWhatTitle: "What it is",
    heroWhatText: "180° historical visualization from the real location.",
    heroForTitle: "Who it is for",
    heroForText: "Visitors, guides, institutions and cultural routes.",
    heroDiffTitle: "Difference",
    heroDiffText: "It does not just explain heritage: it lets people see it.",
    demoAvailable: "Demo available",
    openExperience: "Open 180° experience",
    heroSceneTitle: "Roman Theatre of Málaga",
    problemLabel: "Problem",
    problemTitle: "Heritage is not always easy to understand at first glance.",
    problemText:
      "Many visitors walk through archaeological remains, walls, transformed buildings or partially vanished historic spaces without being able to imagine how they originally looked or what role they played in the city. The information exists, but the visual experience is often limited to signs, audio guides or abstract explanations.",
    solutionLabel: "Solution",
    solutionTitle: "An immersive reconstruction linked to a real point in the city.",
    solutionText:
      "Timeless lets visitors access a historical immersive reconstruction from their mobile phone, linked to a real point in the city. The experience helps people understand heritage visually, directly and in context, without installing an app or using VR headsets.",
    demoLabel: "Visible demo",
    demoTitle: "Open a 180° experience now.",
    demoText:
      "The demo shows the real prototype flow: mobile entry, camera and motion permissions, alignment and immersive visualization of the historical scene.",
    pilotLabel: "Málaga pilot case",
    pilotTitle: "Three scenes to demonstrate real cultural value.",
    seeScene: "View scene",
    diffLabel: "Differentiator",
    diffTitle:
      "Unlike an audio guide, a cultural app or a traditional virtual tour, Timeless does not just explain heritage: it lets people see it from the real place.",
    techLabel: "Technology",
    techTitle: "Mobile-first web with 180° visualization.",
    techText:
      "Timeless uses a mobile-first web architecture based on React / Next.js and immersive visualization with Three.js / WebGL. The prototype displays historical scenes in monoscopic 180° equirectangular format from a mobile browser.",
    businessLabel: "Business model",
    businessTitle: "B2B/B2G for routes, institutions and heritage sites.",
    businessText:
      "Timeless proposes a B2B/B2G model based on pilots per historical point, immersive route packages and annual licenses for maintenance, support and content updates.",
    finalUsersLabel: "End users",
    clientsLabel: "Potential clients",
    contactLabel: "Contact",
    contactHeadline: "Timeless lets people see the past from the real place.",
    founderRole: "Founder & Product Lead",
    cityLocation: "Málaga, Spain",
    viewPilotMap: "View Málaga pilot map",
    sceneRomanTheatre: "Roman Theatre of Málaga",
    sceneRomanTheatreDescription: "Visual reconstruction of the theatre in Roman times to make its historical use easier to understand.",
    sceneWall: "Medieval wall of Calle Carretería",
    sceneWallDescription: "180° reconstruction of a sector of Málaga's western medieval wall.",
    sceneAtarazanas: "Medieval Atarazanas",
    sceneAtarazanasDescription: "Visualization of the former maritime and defensive space linked to the Atarazanas.",
    diffNoNative: "No native app required.",
    diffNoVr: "No VR headset required.",
    diffBrowser: "Works from a mobile browser.",
    diffRoutes: "Adapts to cultural routes.",
    diffScalable: "Scalable by scenes and cities.",
    diffFragmented: "Designed for lost, fragmented or hard-to-imagine heritage.",
    userTourists: "Cultural tourists",
    userResidents: "Residents",
    userStudents: "Students",
    userVisitors: "Historic city centre visitors",
    userGuides: "Tour guides",
    clientCityHalls: "City councils",
    clientMuseums: "Museums",
    clientTourism: "Tourism offices",
    clientFoundations: "Heritage foundations",
    clientTours: "Guided tour companies",
    clientEducation: "Educational institutions",
    backToMalagaMap: "Back to Málaga map",
    backPrevious: "Back to previous view",
    beginExperience: "Start experience",
    permissionsRequired: "Camera and motion access required",
    beforeStart: "Before starting",
    permissionsTitle: "Accept permissions to start the camera and motion experience",
    requesting: "Requesting...",
    acceptPermissions: "Accept permissions and start",
    cameraRequiredError: "Camera access is required for calibration. Please allow camera access in your browser settings and try again.",
    calibration: "Calibration",
    calibrationWithOverlay: "Move your phone until the historical reference aligns with the current place. Adjust transparency if needed.",
    calibrationWithoutOverlay: "Stand facing the historical point and tap ready to enter the immersive viewer.",
    ready: "Ready",
    preparing: "Preparing…",
    cameraAccessError: "Could not access the camera. Please allow access and try again.",
    somethingWrong: "Something went wrong",
    unableContinue: "Unable to continue",
    tryAgain: "Try again",
    unexpectedError: "An unexpected error occurred.",
    preparingExperience: "Preparing experience",
    playbackError: "Playback error",
    retry: "Retry",
    videoLoadError: "Unable to load the experience video.",
    imageLoadError: "Unable to load the panoramic image.",
    nowViewing: "Now viewing",
    openInfo: "Open information",
    historicalPoint: "Historical point",
    closeHistoricalPoint: "Close historical point",
    explanatoryAudio: "Explanatory audio",
    help: "Help",
    helpGyro: "Move your phone to look around. You can also drag with your finger to adjust the view.",
    helpDrag: "Drag with your finger to look around the scene.",
    helpCalibrationAnchor: "The view remains anchored to the initial calibration.",
    gotIt: "Got it",
    closeHelp: "Close help",
    ambientSound: "Ambient sound",
    soundOn: "Sound",
    soundOff: "Silence",
    mute: "Mute",
    unmute: "Unmute",
    replay: "Replay",
    exitExperience: "Exit experience",
    mapBack: "Back to home",
    mapLabel: "Experience map",
    mapDescription: "Select a scene, enter the 180° viewer or open directions to the exact activation point.",
    availableScenes: "Available scenes",
    scenes: "scenes",
    scene: "scene",
    northUp: "North up",
    selectPoi: "Select",
    available: "Available",
    comingSoon: "Coming soon",
    openViewer: "Enter 180° viewer",
    howToArrive: "How to get there",
    exactPoint: "Activation point",
    futureScene: "Future scene",
    cityCountry: "Spain",
    cityRegion: "Historic centre",
  },
} as const

export type CopyKey = keyof typeof copy.es

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: CopyKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "es"
  const stored = window.localStorage.getItem("timeless-language")
  return stored === "en" || stored === "es" ? stored : "es"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  useEffect(() => {
    setLanguageState(getInitialLanguage())
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem("timeless-language", language)
  }, [language])

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage: setLanguageState,
      t: (key) => copy[language][key] ?? copy.es[key],
    }
  }, [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
