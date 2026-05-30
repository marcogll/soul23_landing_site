import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PinnedSection {
  start: number
  end: number
  center: number
}

export function useScrollSnap() {
  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start)

      const maxScroll = ScrollTrigger.maxScroll(window)
      if (!maxScroll || pinned.length === 0) return

      // Build pinned ranges with settle centers (default settleRatio = 0.5)
      const pinnedRanges: PinnedSection[] = pinned.map((st) => {
        const start = st.start / maxScroll
        const end = (st.end ?? st.start) / maxScroll
        const settleRatio = 0.5
        const center = start + (end - start) * settleRatio
        return { start, end, center }
      })

      // Global snap
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            )
            if (!inPinned) return value // Flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            )

            return target
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      })
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])
}
