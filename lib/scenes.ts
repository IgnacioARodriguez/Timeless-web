import type { Scene } from "@/types/scene"
import scenesData from "@/data/scenes.json"

const scenes = scenesData as Scene[]

export function getSceneById(id: string): Scene | undefined {
  return scenes.find((s) => s.id === id)
}

export function getAllScenes(): Scene[] {
  return scenes
}

export function getFeaturedScene(): Scene | undefined {
  return scenes[0]
}
