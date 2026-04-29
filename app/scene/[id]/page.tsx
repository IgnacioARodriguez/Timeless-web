import { notFound } from "next/navigation"
import { getSceneById, getAllScenes } from "@/lib/scenes"
import { SceneExperienceShell } from "@/components/experience/scene-experience-shell"
import type { Metadata } from "next"

interface ScenePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return getAllScenes().map((scene) => ({ id: scene.id }))
}

export async function generateMetadata({ params }: ScenePageProps): Promise<Metadata> {
  const { id } = await params
  const scene = getSceneById(id)
  if (!scene) return { title: "Scene not found — Timeless" }

  return {
    title: `${scene.title} — Timeless`,
    description: scene.description,
  }
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { id } = await params
  const scene = getSceneById(id)

  if (!scene) notFound()

  return <SceneExperienceShell scene={scene} />
}
