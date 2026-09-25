import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { HugoHomePage } from './pages/HugoHomePage'
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
            {/* Home matching exact Hugo Home Hero & Highlighted Content */}
            <Route index element={<HugoHomePage />} />

            {/* Main Tabs matching 03-gh_pages */}
            <Route path="about" element={<StaticPage pageName="about" title="About" />} />
            <Route path="about/" element={<StaticPage pageName="about" title="About" />} />
            <Route path="agents" element={<StaticPage pageName="agents" title="Agents" />} />
            <Route path="agents/" element={<StaticPage pageName="agents" title="Agents" />} />
            <Route path="blogs" element={<StaticPage pageName="blogs" title="Blogs" />} />
            <Route path="blogs/" element={<StaticPage pageName="blogs" title="Blogs" />} />
            <Route path="publications" element={<StaticPage pageName="publications" title="Publications" />} />
            <Route path="publications/" element={<StaticPage pageName="publications" title="Publications" />} />
            <Route path="geolayers" element={<StaticPage pageName="geolayers" title="GeoLayers" />} />
            <Route path="geolayers/" element={<StaticPage pageName="geolayers" title="GeoLayers" />} />
            <Route path="gallery" element={<StaticPage pageName="gallery" title="Gallery" />} />
            <Route path="gallery/" element={<StaticPage pageName="gallery" title="Gallery" />} />
            <Route path="tools" element={<StaticPage pageName="tools" title="Tools" />} />
            <Route path="tools/" element={<StaticPage pageName="tools" title="Tools" />} />
            <Route path="search" element={<StaticPage pageName="search" title="Search" />} />
            <Route path="search/" element={<StaticPage pageName="search" title="Search" />} />

            {/* Individual Item Subpaths */}
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

            {/* Next-gen Local AI & Mini PC Diagnostics */}
            <Route path="ai-chat" element={<ChatPage />} />
            <Route path="ai-chat/" element={<ChatPage />} />
            <Route path="status" element={<StatusPage />} />
            <Route path="status/" element={<StatusPage />} />

            {/* Fallback */}
            <Route path="*" element={<StaticPage pageName="blogs" title="Blogs" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
