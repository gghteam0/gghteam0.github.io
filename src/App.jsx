import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import MatrixCanvas from './components/MatrixCanvas.jsx'
import Home from './pages/Home.jsx'
import Roadmap from './pages/Roadmap.jsx'
import PracticalLabs from './pages/PracticalLabs.jsx'
import { Tools, ToolsDetail } from './pages/Tools.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'
import { Programming, Networking, CyberBasics, PentestBasics, ActiveDirectory, MalwareAnalysis, MalwareCourses, WebProgrammingBasics } from './pages/courses.jsx'
import { LinuxMain, LinuxCourses, WhatIsLinux, WebPentestMain, WebPentestResources } from './pages/linux.jsx'
import { Websites, YoutubeChannels } from './pages/resources.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MatrixCanvas />
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/programming" element={<Programming />} />
          <Route path="/roadmap/networking" element={<Networking />} />
          <Route path="/roadmap/linux" element={<LinuxMain />} />
          <Route path="/roadmap/linux/courses" element={<LinuxCourses />} />
          <Route path="/roadmap/linux/what-is-linux" element={<WhatIsLinux />} />
          <Route path="/roadmap/cybersecurity-basics" element={<CyberBasics />} />
          <Route path="/roadmap/pentest-basics" element={<PentestBasics />} />
          <Route path="/roadmap/web-pentest" element={<WebPentestMain />} />
          <Route path="/roadmap/web-pentest-resources" element={<WebPentestResources />} />
          <Route path="/roadmap/web-programming-basics" element={<WebProgrammingBasics />} />
          <Route path="/roadmap/active-directory" element={<ActiveDirectory />} />
          <Route path="/roadmap/malware-analysis" element={<MalwareAnalysis />} />
          <Route path="/roadmap/malware-analysis/courses" element={<MalwareCourses />} />
          <Route path="/practical-labs" element={<PracticalLabs />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:id" element={<ToolsDetail />} />
          <Route path="/resources/websites" element={<Websites />} />
          <Route path="/resources/youtube-channels" element={<YoutubeChannels />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
