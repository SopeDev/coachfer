/**
 * CONSTELLATION SVG ANIMATION REFERENCE
 * 
 * This is a working reference implementation of a constellation SVG background
 * with sequential line drawing animation using GSAP DrawSVGPlugin.
 * 
 * Features:
 * - SVG constellation pattern from bottom-left to top-right
 * - Sequential line animation (one line completes before next starts)
 * - Works with DrawSVGPlugin or fallback to stroke-dasharray
 * - ScrollTrigger integration for scroll-based animation
 * 
 * Usage: Import this code into any component that needs a constellation background animation
 */

"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DrawSVGPlugin } from "gsap/all"

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

export default function ConstellationAnimationExample() {
  const sectionRef = useRef(null)
  const constellationRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current) return

    // Constellation line animation
    const constellationLines = constellationRef.current?.querySelectorAll('.constellation-line')
    let constellationAnimation = null
    
    if (constellationLines && constellationLines.length > 0) {
      const totalLines = constellationLines.length
      // Each line animates over a portion of the scroll progress
      // Sequential: line 0 completes, then line 1 starts, etc.
      const lineDuration = 1 / totalLines // Each line gets equal portion of scroll
      
      // Initialize all lines as hidden
      constellationLines.forEach((line) => {
        if (DrawSVGPlugin) {
          gsap.set(line, {
            drawSVG: "0% 0%" // Start with nothing drawn
          })
        } else {
          const pathLength = line.getTotalLength()
          gsap.set(line, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength // Start fully hidden
          })
        }
      })
      
      // Check if DrawSVGPlugin is available
      if (DrawSVGPlugin) {
        // Use DrawSVGPlugin for smooth line drawing animation
        // Animate each line sequentially from bottom-left to top-right
        constellationAnimation = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            constellationLines.forEach((line, index) => {
              // Calculate when this line should start and end
              const lineStart = index * lineDuration
              const lineEnd = (index + 1) * lineDuration
              
              // Calculate this line's progress (0 to 1)
              let lineProgress = 0
              if (progress >= lineEnd) {
                // Line is fully drawn
                lineProgress = 1
              } else if (progress > lineStart) {
                // Line is currently animating
                lineProgress = (progress - lineStart) / (lineEnd - lineStart)
              }
              // else lineProgress stays 0 (line hasn't started yet)
              
              // DrawSVG: "0% 0%" = nothing drawn, "0% 100%" = fully drawn
              gsap.set(line, {
                drawSVG: `0% ${lineProgress * 100}%`
              })
            })
          }
        })
      } else {
        // Fallback: Use stroke-dasharray animation if DrawSVGPlugin is not available
        constellationAnimation = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            constellationLines.forEach((line, index) => {
              // Calculate when this line should start and end
              const lineStart = index * lineDuration
              const lineEnd = (index + 1) * lineDuration
              
              // Calculate this line's progress (0 to 1)
              let lineProgress = 0
              if (progress >= lineEnd) {
                // Line is fully drawn
                lineProgress = 1
              } else if (progress > lineStart) {
                // Line is currently animating
                lineProgress = (progress - lineStart) / (lineEnd - lineStart)
              }
              // else lineProgress stays 0 (line hasn't started yet)
              
              const pathLength = line.getTotalLength()
              gsap.set(line, {
                strokeDashoffset: pathLength * (1 - lineProgress)
              })
            })
          }
        })
      }
    }

    return () => {
      if (constellationAnimation) {
        constellationAnimation.kill()
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="constellation-section">
      {/* Constellation Background SVG */}
      <svg 
        ref={constellationRef}
        className="constellation-svg" 
        viewBox="0 0 800 600" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stars (circles) */}
        <circle cx="50" cy="550" r="2" fill="#3a18b1" opacity="0.4" />
        <circle cx="120" cy="520" r="1.5" fill="#3a18b1" opacity="0.35" />
        <circle cx="180" cy="480" r="2" fill="#3a18b1" opacity="0.4" />
        <circle cx="250" cy="450" r="1.5" fill="#3a18b1" opacity="0.35" />
        <circle cx="320" cy="400" r="2.5" fill="#3a18b1" opacity="0.45" />
        <circle cx="380" cy="360" r="1.5" fill="#3a18b1" opacity="0.35" />
        <circle cx="450" cy="320" r="2" fill="#3a18b1" opacity="0.4" />
        <circle cx="520" cy="280" r="1.5" fill="#3a18b1" opacity="0.35" />
        <circle cx="580" cy="240" r="2" fill="#3a18b1" opacity="0.4" />
        <circle cx="650" cy="200" r="2.5" fill="#3a18b1" opacity="0.45" />
        <circle cx="720" cy="150" r="1.5" fill="#3a18b1" opacity="0.35" />
        <circle cx="750" cy="100" r="2" fill="#3a18b1" opacity="0.4" />
        
        {/* Additional stars for depth */}
        <circle cx="80" cy="500" r="1" fill="#3a18b1" opacity="0.25" />
        <circle cx="200" cy="420" r="1" fill="#3a18b1" opacity="0.25" />
        <circle cx="350" cy="380" r="1" fill="#3a18b1" opacity="0.25" />
        <circle cx="480" cy="300" r="1" fill="#3a18b1" opacity="0.25" />
        <circle cx="600" cy="220" r="1" fill="#3a18b1" opacity="0.25" />
        <circle cx="680" cy="120" r="1" fill="#3a18b1" opacity="0.25" />
        
        {/* Special star (four-pointed) */}
        <g transform="translate(320, 400)">
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#3a18b1" strokeWidth="1.5" opacity="0.5" />
          <line x1="-3" y1="0" x2="3" y2="0" stroke="#3a18b1" strokeWidth="1.5" opacity="0.5" />
        </g>
        
        {/* Connecting lines - bottom left to top right */}
        <line 
          x1="50" y1="550" x2="120" y2="520" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="120" y1="520" x2="180" y2="480" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="180" y1="480" x2="250" y2="450" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="250" y1="450" x2="320" y2="400" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="320" y1="400" x2="380" y2="360" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="380" y1="360" x2="450" y2="320" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="450" y1="320" x2="520" y2="280" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="520" y1="280" x2="580" y2="240" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="580" y1="240" x2="650" y2="200" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="650" y1="200" x2="720" y2="150" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="720" y1="150" x2="750" y2="100" 
          stroke="#3a18b1" 
          strokeWidth="0.8" 
          opacity="0.3"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        
        {/* Branching lines for more complexity */}
        <line 
          x1="180" y1="480" x2="200" y2="420" 
          stroke="#3a18b1" 
          strokeWidth="0.6" 
          opacity="0.25"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="320" y1="400" x2="350" y2="380" 
          stroke="#3a18b1" 
          strokeWidth="0.6" 
          opacity="0.25"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="450" y1="320" x2="480" y2="300" 
          stroke="#3a18b1" 
          strokeWidth="0.6" 
          opacity="0.25"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="580" y1="240" x2="600" y2="220" 
          stroke="#3a18b1" 
          strokeWidth="0.6" 
          opacity="0.25"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
        <line 
          x1="650" y1="200" x2="680" y2="120" 
          stroke="#3a18b1" 
          strokeWidth="0.6" 
          opacity="0.25"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="constellation-line"
        />
      </svg>

      {/* Your content here */}
      <div className="content">
        {/* Content goes here */}
      </div>
    </section>
  )
}

/**
 * CSS STYLES (add to your SCSS file):
 * 
 * .constellation-section {
 *   position: relative;
 *   overflow: hidden;
 * 
 *   .constellation-svg {
 *     position: absolute;
 *     bottom: 0;
 *     left: 0;
 *     width: 100%;
 *     height: 100%;
 *     pointer-events: none;
 *     z-index: 0;
 *     opacity: 0.6;
 *     transform-origin: bottom left;
 *   }
 * 
 *   .content {
 *     position: relative;
 *     z-index: 1;
 *   }
 * }
 */


