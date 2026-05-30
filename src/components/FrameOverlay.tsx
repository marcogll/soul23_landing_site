import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function FrameOverlay() {
  const frameRef = useRef<HTMLDivElement>(null)
  const cornersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for frame and corners
      gsap.fromTo(
        frameRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.1, ease: 'power2.out' }
      )

      const corners = cornersRef.current?.querySelectorAll('.corner-line')
      if (corners) {
        gsap.fromTo(
          corners,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0, ease: 'power2.out' }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Frame border */}
      <div
        ref={frameRef}
        className="frame-overlay opacity-0"
      />

      {/* Corner marks */}
      <div ref={cornersRef} className="pointer-events-none">
        {/* Top-left corner */}
        <div className="corner-mark" style={{ top: '6px', left: '6px' }}>
          <div className="corner-line absolute" style={{ width: '8px', height: '1px', top: 0, left: 0, background: 'rgba(244,242,234,0.35)' }} />
          <div className="corner-line absolute" style={{ width: '1px', height: '8px', top: 0, left: 0, background: 'rgba(244,242,234,0.35)' }} />
        </div>
        {/* Top-right corner */}
        <div className="corner-mark" style={{ top: '6px', right: '6px' }}>
          <div className="corner-line absolute" style={{ width: '8px', height: '1px', top: 0, right: 0, background: 'rgba(244,242,234,0.35)' }} />
          <div className="corner-line absolute" style={{ width: '1px', height: '8px', top: 0, right: 0, background: 'rgba(244,242,234,0.35)' }} />
        </div>
        {/* Bottom-left corner */}
        <div className="corner-mark" style={{ bottom: '6px', left: '6px' }}>
          <div className="corner-line absolute" style={{ width: '8px', height: '1px', bottom: 0, left: 0, background: 'rgba(244,242,234,0.35)' }} />
          <div className="corner-line absolute" style={{ width: '1px', height: '8px', bottom: 0, left: 0, background: 'rgba(244,242,234,0.35)' }} />
        </div>
        {/* Bottom-right corner */}
        <div className="corner-mark" style={{ bottom: '6px', right: '6px' }}>
          <div className="corner-line absolute" style={{ width: '8px', height: '1px', bottom: 0, right: 0, background: 'rgba(244,242,234,0.35)' }} />
          <div className="corner-line absolute" style={{ width: '1px', height: '8px', bottom: 0, right: 0, background: 'rgba(244,242,234,0.35)' }} />
        </div>
      </div>
    </>
  )
}
