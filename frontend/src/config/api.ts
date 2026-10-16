// Configuration helpers for API URLs and settings
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://ollama.guilhermeviegas.dev'
).replace(/\/$/, '')

export const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'gemma4:latest'
export const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'Gui13go'
