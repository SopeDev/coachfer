"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/all"
import "./Quote.scss"

gsap.registerPlugin(ScrollTrigger)

export default function Quote() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const splitTextRef = useRef(null)
  const scrollTriggerRef = useRef(null)
  const parallaxRef = useRef(null)

  useEffect(() => {
    if (!textRef.current || !sectionRef.current) return

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      // Use SplitText to split text into characters and words
      splitTextRef.current = new SplitText(textRef.current, {
        type: "chars,words"
      })

      // Set initial color for all characters (light gray)
      splitTextRef.current.chars.forEach((char) => {
        gsap.set(char, {
          color: "#b0b0b0"
        })
      })

      // Create ScrollTrigger for letter-by-letter animation
      // Start: when text bottom is 20% from viewport bottom (80% from top)
      // End: when text top is 60% from viewport bottom (40% from top)
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%", // Text bottom at 20% from viewport bottom
        end: "top top", // Text top at 60% from viewport bottom
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Animate each letter with stagger - letters animate sequentially
          splitTextRef.current.chars.forEach((char, index) => {
            // Calculate when this letter should start animating
            // Spread animation across all letters
            const letterStart = index / splitTextRef.current.chars.length
            const letterEnd = (index + 1) / splitTextRef.current.chars.length
            
            // Calculate this letter's progress (0 to 1)
            let letterProgress = 0
            if (progress >= letterEnd) {
              letterProgress = 1
            } else if (progress > letterStart) {
              letterProgress = (progress - letterStart) / (letterEnd - letterStart)
            }
            
            // Interpolate color from light gray to dark indigo
            const color = gsap.utils.interpolate("#b0b0b0", "#2a0f7d", letterProgress)
            gsap.set(char, {
              color: color
            })
          })
        }
      })

      // Parallax effect for the quote text
      // Text is at 0% transform when section is centered in viewport (accounting for navbar)
      const navbar = document.querySelector('.navbar')
      const navbarHeight = navbar ? navbar.offsetHeight : 0
      const viewportHeight = window.innerHeight
      const adjustedCenter = viewportHeight / 2 + navbarHeight / 2
      
      parallaxRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom", // Start when section enters viewport
        end: "bottom top", // End when section leaves viewport
        scrub: true,
        onUpdate: (self) => {
          // Get current position of section center relative to viewport
          const triggerRect = sectionRef.current.getBoundingClientRect()
          const sectionCenter = triggerRect.top + triggerRect.height / 2
          
          // Calculate progress where 0.5 = section center at adjustedCenter
          // When section enters: sectionCenter ≈ viewportHeight (progress should be close to 0)
          // When section centered: sectionCenter = adjustedCenter (progress should be 0.5)
          // When section exits: sectionCenter ≈ -sectionHeight/2 (progress should be close to 1)
          
          const sectionHeight = triggerRect.height
          const totalRange = viewportHeight + sectionHeight / 2
          
          // Raw progress: 0 when section enters, 1 when section exits
          const rawProgress = (viewportHeight - sectionCenter + sectionHeight / 2) / totalRange
          
          // Adjust: shift so that when sectionCenter = adjustedCenter, progress = 0.5
          const centerProgress = (viewportHeight - adjustedCenter + sectionHeight / 2) / totalRange
          const adjustedProgress = rawProgress + (0.5 - centerProgress)
          const progress = Math.max(0, Math.min(1, adjustedProgress))
          
          // When progress is 0.5 (section centered accounting for navbar), yPercent should be 0
          // Range: -30% to +30%, with 0 at center
          const yPercent = (progress - 0.5) * 60 // Maps 0-1 progress to -30 to +30
          gsap.set(textRef.current, {
            yPercent: yPercent
          })
        }
      })
    })

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
        scrollTriggerRef.current = null
      }
      if (parallaxRef.current?.scrollTrigger) {
        parallaxRef.current.scrollTrigger.kill()
        parallaxRef.current = null
      }
      if (splitTextRef.current) {
        splitTextRef.current.revert()
        splitTextRef.current = null
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="quote">
      <div className="quote__container">
        <p ref={textRef} className="quote__text">
          Después de más de 26 años acompañando a miles de personas en su proceso de transformación...
        </p>
      </div>
    </section>
  )
}

