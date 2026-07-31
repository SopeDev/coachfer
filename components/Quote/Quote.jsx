"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/all"
import { useGSAP } from "@gsap/react"
import "./Quote.scss"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export default function Quote({ containerAnimation = null, className = "" }) {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const splitTextRef = useRef(null)

  useGSAP(() => {
    if (!textRef.current || !sectionRef.current) return

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      // Use SplitText to split text into characters and words
      splitTextRef.current = new SplitText(textRef.current, {
        type: "chars,words"
      })

      const chars = splitTextRef.current.chars

      // Start all letters as light gray
      gsap.set(chars, { color: "#eeeeee" })

      // Use containerAnimation if provided (horizontal scroll), otherwise use vertical scroll
      const scrollTriggerConfig = containerAnimation
        ? {
            trigger: sectionRef.current,
            containerAnimation: containerAnimation,
            start: "left 100%",
            end: "left 50%",
            scrub: 1
          }
        : {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "center center",
            scrub: true
          }

      const tl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig
      })

      // Timeline that ScrollTrigger will scrub
      tl.to(chars, {
        color: "#2a0f7d",
        ease: "none",
        stagger: {
          each: 1 / chars.length // spread over entire timeline
        }
      })
    })

    // Parallax effect for the quote text (only for vertical scroll, not horizontal)
    if (!containerAnimation) {
      const navbar = document.querySelector('.navbar')
      const navbarHeight = navbar ? navbar.offsetHeight : 0
      const viewportHeight = window.innerHeight
      const adjustedCenter = viewportHeight / 2 + navbarHeight / 2
      
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom", // Start when section enters viewport
        end: "bottom top", // End when section leaves viewport
        scrub: true,
        onUpdate: () => {
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
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className={`quote ${className}`}>
      <div className="quote__container">
        <p ref={textRef} className="quote__text">
        Estos patrones son tus contratos, lealtades y programaciones kármicas de vidas pasadas... <br/><br/> y tu misión es reconocerlos, integrarlos y reprogramarlos para convertirlos en impulso de tu ascensión
        </p>
      </div>
    </section>
  )
}





