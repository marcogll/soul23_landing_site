import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Layout from './components/Layout'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import SurveyServicePage from './pages/SurveyServicePage'
import ContactSurveyPage from './pages/ContactSurveyPage'
import ClientOnboardingPage from './pages/ClientOnboardingPage'
import RsvpPage from './pages/RsvpPage'
import StaffEvaluationPage from './pages/StaffEvaluationPage'
import ProjectFeedbackPage from './pages/ProjectFeedbackPage'

import Section1Hero from './sections/Section1Hero'
import Section2Problem from './sections/Section2Problem'
import Section3HowItWorks from './sections/Section3HowItWorks'
import SectionSurveyDemo from './sections/SectionSurveyDemo'
import SectionEmailTemplate from './sections/SectionEmailTemplate'
import Section4Projects from './sections/Section4Projects'
import Section5Testimonials from './sections/Section5Testimonials'
import Section9DemoDashboard from './sections/Section9DemoDashboard'
import Section10DemoBots from './sections/Section10DemoBots'
import Section9Contact from './sections/Section9Contact'
import Section10Footer from './sections/Section10Footer'

gsap.registerPlugin(ScrollTrigger)

const HOME_SCROLL_KEY = 's23-home-scroll-y-v3'

interface HomeRouteState {
  scrollTo?: string
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

    if (window.location.hash) {
      window.history.replaceState(null, '', '/')
    }

    const restoreTimer = window.setTimeout(() => {
      if (targetSection) {
        document.getElementById(targetSection)?.scrollIntoView({ behavior: 'auto', block: 'start' })
        window.history.replaceState(null, '', '/')
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
      window.removeEventListener('scroll', saveScroll)
      window.removeEventListener('pagehide', saveScroll)
    }
  }, [location.state])

  return (
    <>
      <Section1Hero />
      <Section2Problem />
      <Section3HowItWorks />
      <SectionSurveyDemo />
      <SectionEmailTemplate />
      <Section4Projects />
      <Section5Testimonials />
      <Section9DemoDashboard />
      <Section10DemoBots />
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
        <Route path="/survey-service" element={<SurveyServicePage />} />
        <Route path="/contact-survey" element={<ContactSurveyPage />} />
        <Route path="/onboarding" element={<ClientOnboardingPage />} />
        <Route path="/rsvp" element={<RsvpPage />} />
        <Route path="/evaluate" element={<StaffEvaluationPage />} />
        <Route path="/project-feedback" element={<ProjectFeedbackPage />} />
      </Route>
    </Routes>
  )
}
