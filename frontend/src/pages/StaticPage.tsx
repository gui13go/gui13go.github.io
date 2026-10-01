import React, { useEffect } from 'react'
import { useRenderedContent } from '../hooks/useRenderedContent'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ContentRenderer } from '../components/ContentRenderer'

interface StaticPageProps {
  pageName: string
}

export const StaticPage: React.FC<StaticPageProps> = ({ pageName }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pageName])

  const { data, isLoading, isError, error } = useRenderedContent(
    pageName ? `/rendered_pages/${pageName}.html` : null
  )

  const fallbackTitle = pageName
    ? pageName.charAt(0).toUpperCase() + pageName.slice(1)
    : undefined

  useDocumentMeta({
    title: data?.title || fallbackTitle,
    description: data?.description,
    image: data?.image,
  })

  return (
    <ContentRenderer
      htmlContent={data?.htmlContent || ''}
      loading={isLoading}
      error={isError}
      errorMessage={error?.message || `The requested page (${pageName}) could not be loaded.`}
    />
  )
}
