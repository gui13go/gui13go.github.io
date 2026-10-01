import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { StaticPage } from './pages/StaticPage'
import { DynamicItemPage } from './pages/DynamicItemPage'

// Lazy-loaded routes for optimal initial bundle size
const StatusPage = lazy(() =>
  import('./pages/StatusPage').then((m) => ({ default: m.StatusPage }))
)
const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((m) => ({ default: m.SearchPage }))
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* The Ultimate Portfolio Home Dashboard */}
            <Route index element={<HomePage />} />

            {/* Core Portfolio Sections */}
            <Route path="about" element={<StaticPage pageName="about" />} />
            <Route path="about/" element={<StaticPage pageName="about" />} />
            <Route path="agents" element={<StaticPage pageName="agents" />} />
            <Route path="agents/" element={<StaticPage pageName="agents" />} />
            <Route path="blogs" element={<StaticPage pageName="blogs" />} />
            <Route path="blogs/" element={<StaticPage pageName="blogs" />} />
            <Route path="publications" element={<StaticPage pageName="publications" />} />
            <Route path="publications/" element={<StaticPage pageName="publications" />} />
            <Route path="geolayers" element={<StaticPage pageName="geolayers" />} />
            <Route path="geolayers/" element={<StaticPage pageName="geolayers" />} />
            <Route path="gallery" element={<StaticPage pageName="gallery" />} />
            <Route path="gallery/" element={<StaticPage pageName="gallery" />} />
            <Route path="tools" element={<StaticPage pageName="tools" />} />
            <Route path="tools/" element={<StaticPage pageName="tools" />} />

            {/* Dedicated Interactive Full-Text Search & Taxonomy */}
            <Route path="search" element={<SearchPage />} />
            <Route path="search/" element={<SearchPage />} />
            <Route path="tags" element={<SearchPage />} />
            <Route path="tags/" element={<SearchPage />} />
            <Route path="tags/:tag" element={<SearchPage />} />
            <Route path="tags/:tag/" element={<SearchPage />} />

            {/* Versus Battles Gallery Sub-Routes */}
            <Route path="gallery/versus/:slug" element={<DynamicItemPage section="rendered_versus" />} />
            <Route path="gallery/versus/:slug/" element={<DynamicItemPage section="rendered_versus" />} />

            {/* Individual Interactive Items and Articles */}
            <Route path="blogs/:slug" element={<DynamicItemPage section="rendered_blogs" />} />
            <Route path="blogs/:slug/" element={<DynamicItemPage section="rendered_blogs" />} />
            <Route path="tools/:slug" element={<DynamicItemPage section="rendered_tools" />} />
            <Route path="tools/:slug/" element={<DynamicItemPage section="rendered_tools" />} />
            <Route path="gallery/:slug" element={<DynamicItemPage section="rendered_gallery" />} />
            <Route path="gallery/:slug/" element={<DynamicItemPage section="rendered_gallery" />} />
            <Route path="geolayers/:slug" element={<DynamicItemPage section="rendered_geolayers" />} />
            <Route path="geolayers/:slug/" element={<DynamicItemPage section="rendered_geolayers" />} />
            <Route path="publications/:slug" element={<DynamicItemPage section="rendered_publications" />} />
            <Route path="publications/:slug/" element={<DynamicItemPage section="rendered_publications" />} />

            {/* Hardware Telemetry & Node Status */}
            <Route path="status" element={<StatusPage />} />
            <Route path="status/" element={<StatusPage />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
