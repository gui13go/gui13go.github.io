import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRenderedContent } from '../hooks/useRenderedContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ContentRenderer } from '../components/ContentRenderer'

interface DynamicItemProps {
  section:
    | 'rendered_blogs'
    | 'rendered_tools'
    | 'rendered_gallery'
    | 'rendered_geolayers'
    | 'rendered_publications'
    | 'rendered_versus'
}

const ALIASES: Record<string, string> = {
  'pomodoro-timer': 'pomodoro',
  'pomodoro-focus': 'pomodoro',
  'currency-charter': 'currency-chart',
  'egg-cooking': 'egg-cooking-timer',
  'egg-timer': 'egg-cooking-timer',
  'berlin-wall': 'berlin-wall-comparison',
  'ecosystems-world': 'ecosystems-of-the-world',
  'usa-nuked-greenland-1968': 'usa-dropped-nukes-on-greenland',
  'usa-nuked-spain-1966': 'usa-dropped-nukes-on-spain',
  'reveolution-os-review': 'revolution-os-review',
}

export const DynamicItemPage: React.FC<DynamicItemProps> = ({ section }) => {
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [section, slug])

  const resolvedSlug = slug ? ALIASES[slug] || slug : ''
  const contentUrl = resolvedSlug ? `/${section}/${resolvedSlug}.html` : null

  const { data, isLoading, isError, error } = useRenderedContent(contentUrl)

  useDocumentMeta({
    title: data?.title,
    description: data?.description,
    image: data?.image,
  })

  return (
    <ContentRenderer
      htmlContent={data?.htmlContent || ''}
      loading={isLoading}
      error={isError || !slug}
      errorMessage={error?.message || `The requested article or item (${slug}) could not be loaded.`}
    />
  )
}
