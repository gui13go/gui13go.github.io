// Configuration helpers for API URLs and settings
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
export const DEFAULT_MODEL = import.meta.env.VITE_DEFAULT_MODEL || 'llama3.2:latest'
export const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'Gui13go'
