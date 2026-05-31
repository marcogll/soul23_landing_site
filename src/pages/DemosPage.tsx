import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SectionSurveyDemo from '@/sections/SectionSurveyDemo'
import SectionEmailTemplate from '@/sections/SectionEmailTemplate'
import Section9DemoDashboard from '@/sections/Section9DemoDashboard'
import Section10DemoBots from '@/sections/Section10DemoBots'
import Section10Footer from '@/sections/Section10Footer'

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-dark-primary pt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cream-muted text-[13px] font-mono uppercase tracking-wide hover:text-gold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </Link>
      </div>
      <SectionSurveyDemo />
      <SectionEmailTemplate />
      <Section9DemoDashboard />
      <Section10DemoBots />
      <Section10Footer />
    </div>
  )
}
