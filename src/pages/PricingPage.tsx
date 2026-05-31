import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SectionPricing from '@/sections/SectionPricing'
import Section10Footer from '@/sections/Section10Footer'

export default function PricingPage() {
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
      <SectionPricing />
      <Section10Footer />
    </div>
  )
}
