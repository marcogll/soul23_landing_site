import { Outlet } from 'react-router-dom'
import FrameOverlay from './FrameOverlay'
import GrainOverlay from './GrainOverlay'
import Navigation from './Navigation'
import TaliaChatbot from './TaliaChatbot'
import NewsletterDiscountPopup from './NewsletterDiscountPopup'

export default function Layout() {
  return (
    <div className="relative bg-dark-primary min-h-screen">
      <FrameOverlay />
      <GrainOverlay />
      <Navigation />
      <main className="relative">
        <Outlet />
      </main>
      <TaliaChatbot />
      <NewsletterDiscountPopup />
    </div>
  )
}
