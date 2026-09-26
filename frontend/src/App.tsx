import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { StaticPage } from './pages/StaticPage'
import { DynamicItemPage } from './pages/DynamicItemPage'
import { ChatPage } from './pages/ChatPage'
import { StatusPage } from './pages/StatusPage'

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
            <Route path="search" element={<StaticPage pageName="search" />} />
            <Route path="search/" element={<StaticPage pageName="search" />} />

            {/* Individual Interactive Items and Articles */}
            <Route path="blogs/:slug" element={<DynamicItemPage section="rendered_posts" />} />
            <Route path="blogs/:slug/" element={<DynamicItemPage section="rendered_posts" />} />
            <Route path="tools/:slug" element={<DynamicItemPage section="rendered_tools" />} />
            <Route path="tools/:slug/" element={<DynamicItemPage section="rendered_tools" />} />
            <Route path="gallery/:slug" element={<DynamicItemPage section="rendered_gallery" />} />
            <Route path="gallery/:slug/" element={<DynamicItemPage section="rendered_gallery" />} />
            <Route path="geolayers/:slug" element={<DynamicItemPage section="rendered_geolayers" />} />
            <Route path="geolayers/:slug/" element={<DynamicItemPage section="rendered_geolayers" />} />
            <Route path="publications/:slug" element={<DynamicItemPage section="rendered_publications" />} />
            <Route path="publications/:slug/" element={<DynamicItemPage section="rendered_publications" />} />

            {/* Local AI Gateway & Hardware Telemetry */}
            <Route path="ai-chat" element={<ChatPage />} />
            <Route path="ai-chat/" element={<ChatPage />} />
            <Route path="status" element={<StatusPage />} />
            <Route path="status/" element={<StatusPage />} />

            {/* Fallback */}
            <Route path="*" element={<StaticPage pageName="blogs" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
