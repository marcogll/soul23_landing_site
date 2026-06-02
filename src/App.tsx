import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Layout from './components/Layout'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import SurveyServicePage from './pages/SurveyServicePage'
import ContactSurveyPage from './pages/ContactSurveyPage'
import ClientOnboardingPage from './pages/ClientOnboardingPage'
import RsvpPage from './pages/RsvpPage'
import StaffEvaluationPage from './pages/StaffEvaluationPage'
import ProjectFeedbackPage from './pages/ProjectFeedbackPage'
import PricingPage from './pages/PricingPage'
import DemosPage from './pages/DemosPage'
import ServicesPage from './pages/ServicesPage'
import CompetencyEvaluationPage from './pages/CompetencyEvaluationPage'

import Section1Hero from './sections/Section1Hero'
import Section2Problem from './sections/Section2Problem'
import Section3HowItWorks from './sections/Section3HowItWorks'
import SectionTimeControl from './sections/SectionTimeControl'
import SectionSurveyDemo from './sections/SectionSurveyDemo'
import Section4Projects from './sections/Section4Projects'
import Section5Testimonials from './sections/Section5Testimonials'
import SectionDashboardDemos from './sections/SectionDashboardDemos'
import SectionCompetencyHighlight from './sections/SectionCompetencyHighlight'
import Section9Contact from './sections/Section9Contact'
import Section10Footer from './sections/Section10Footer'

gsap.registerPlugin(ScrollTrigger)

const HOME_SCROLL_KEY = 's23-home-scroll-y-v3'

interface HomeRouteState {
  scrollTo?: string
}

function scrollToElementWithRetry(id: string, maxWait = 3000, interval = 100): number {
  const start = Date.now()
  const timer = window.setInterval(() => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
      window.clearInterval(timer)
      window.history.replaceState(null, '', '/')
      ScrollTrigger.refresh()
    } else if (Date.now() - start > maxWait) {
      window.clearInterval(timer)
    }
  }, interval)
  return timer
}

function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const routeState = location.state as HomeRouteState | null
    const targetSection = routeState?.scrollTo
    const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const shouldRestoreSavedPosition = navigationEntry?.type === 'back_forward'
    let ready = false
    let scrollTimer: number | undefined

    if (window.location.hash) {
      window.history.replaceState(null, '', '/')
    }

    const restoreTimer = window.setTimeout(() => {
      if (targetSection) {
        scrollTimer = scrollToElementWithRetry(targetSection)
      } else if (shouldRestoreSavedPosition) {
        const savedY = Number(window.sessionStorage.getItem(HOME_SCROLL_KEY) || '0')
        window.scrollTo({ top: Number.isFinite(savedY) ? savedY : 0, behavior: 'auto' })
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
      ready = true
      ScrollTrigger.refresh()
    }, 160)

    let ticking = false
    const saveScroll = () => {
      if (!ready || ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        window.sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.max(0, Math.round(window.scrollY))))
        ticking = false
      })
    }

    window.addEventListener('scroll', saveScroll, { passive: true })
    window.addEventListener('pagehide', saveScroll)

    return () => {
      window.clearTimeout(restoreTimer)
      if (scrollTimer) window.clearInterval(scrollTimer)
      window.removeEventListener('scroll', saveScroll)
      window.removeEventListener('pagehide', saveScroll)
    }
  }, [location.state])

  return (
    <>
      <Section1Hero />
      <Section2Problem />
      <Section3HowItWorks />
      <SectionTimeControl />
      <SectionSurveyDemo showLiveForms={false} />
      <SectionCompetencyHighlight />
      <Section4Projects />
      <Section5Testimonials />
      <SectionDashboardDemos />
      <Section9Contact />
      <Section10Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/reembolso" element={<RefundPolicy />} />
        <Route path="/terminos" element={<TermsAndConditions />} />
        <Route path="/survey-service" element={<SurveyServicePage />} />
        <Route path="/contact-survey" element={<ContactSurveyPage />} />
        <Route path="/onboarding" element={<ClientOnboardingPage />} />
        <Route path="/rsvp" element={<RsvpPage />} />
        <Route path="/evaluate" element={<StaffEvaluationPage />} />
        <Route path="/project-feedback" element={<ProjectFeedbackPage />} />
        <Route path="/precios" element={<PricingPage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/competencias" element={<CompetencyEvaluationPage />} />
      </Route>
    </Routes>
  )
}
