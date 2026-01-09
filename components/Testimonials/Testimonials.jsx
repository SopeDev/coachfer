"use client"

import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Testimonials.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Testimonials() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const carouselRef = useRef(null)
  const testimonialRefs = useRef([])
  const intervalRef = useRef(null)
  const currentIndexRef = useRef(0)
  const isPausedRef = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Testimonials with photos - using first testimonial text length as reference
  const testimonials = [
    {
      text: "Llegué a AstroHacking con el deseo de profundizar en mi misión de vida y encontrar herramientas para atravesar los retos y cambios que estamos viviendo como humanidad. Este proceso me ayudó a reafirmar que soy la creadora de mi realidad, a vivir con mayor paz interior y a desarrollar una mirada más alegre, consciente y compasiva. A través del enfoque cabalístico que aprendí con Fernando, hoy puedo ver los desafíos diarios no como problemas, sino como invitaciones a transformar el miedo y la ansiedad en fortaleza interior. Es un trabajo constante, pero la conciencia que se despierta hace toda la diferencia.",
      author: "Cliente testimonial",
      photo: "/images/testimonial-1.jpg"
    },
    {
      text: "Después de trabajar con el método, siento que tengo un código nuevo instalado. Mi vida cambió de dirección y ahora vivo con mucha más claridad y propósito. La reprogramación cuántica me permitió entender patrones que llevaba años repitiendo sin darme cuenta. Fernando tiene una capacidad única para guiarte hacia tu verdadero potencial.",
      author: "Cliente testimonial",
      photo: "/images/testimonial-2.jpg"
    },
    {
      text: "Fernando tiene un don especial para conectar con las memorias kármicas y ayudarte a reprogramarlas. Este método es realmente poderoso. A través de las sesiones, pude liberar bloqueos que tenía desde hace años y reconectar con mi misión de alma. La transformación ha sido profunda y duradera.",
      author: "Cliente testimonial",
      photo: "/images/testimonial-3.jpg"
    }
  ]

  const goToTestimonial = (index, resetTimer = false) => {
    if (index === currentIndexRef.current) return
    
    const prevIndex = currentIndexRef.current
    currentIndexRef.current = index
    setCurrentIndex(index)

    // Reset timer if manually triggered
    if (resetTimer) {
      resetAutoTransition()
    }

    // Immediately hide and position previous testimonial
    if (testimonialRefs.current[prevIndex]) {
      const prevElement = testimonialRefs.current[prevIndex]
      prevElement.style.position = "absolute"
      prevElement.style.zIndex = "1"
      
      gsap.to(prevElement, {
        opacity: 0,
        visibility: "hidden",
        y: -20,
        duration: 0.4,
        ease: "power2.in"
      })
    }

    // Position new testimonial relatively and animate in
    if (testimonialRefs.current[index]) {
      const newElement = testimonialRefs.current[index]
      newElement.style.position = "relative"
      newElement.style.zIndex = "2"
      
      gsap.fromTo(newElement, 
        {
          opacity: 0,
          visibility: "hidden",
          y: 20
        },
        {
          opacity: 1,
          visibility: "visible",
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.2
        }
      )
    }
  }

  const goToNext = () => {
    const nextIndex = (currentIndexRef.current + 1) % testimonials.length
    goToTestimonial(nextIndex)
  }

  const resetAutoTransition = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        goToNext()
      }
    }, 5000)
  }

  const pauseAutoTransition = () => {
    isPausedRef.current = true
  }

  const resumeAutoTransition = () => {
    isPausedRef.current = false
  }

  // Set up initial state immediately on mount - hide everything first
  useEffect(() => {
    // Force hide all testimonials immediately, before GSAP runs
    testimonialRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.opacity = "0"
        ref.style.visibility = "hidden"
        if (index === 0) {
          ref.style.position = "relative"
          ref.style.zIndex = "2"
        } else {
          ref.style.position = "absolute"
          ref.style.zIndex = "1"
          ref.style.top = "0"
          ref.style.left = "0"
        }
      }
    })
  }, [])

  useEffect(() => {
    // Set up auto-transition interval
    resetAutoTransition()

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    gsap.set([titleRef.current], {
      opacity: 0,
      y: 50
    })

    // Set initial state for testimonials - all start hidden
    testimonialRefs.current.forEach((ref, index) => {
      if (ref) {
        if (index === 0) {
          // First testimonial - position relatively but start hidden
          ref.style.position = "relative"
          ref.style.zIndex = "2"
          ref.style.opacity = "0"
          ref.style.visibility = "hidden"
          gsap.set(ref, {
            opacity: 0,
            visibility: "hidden",
            y: 20
          })
        } else {
          // Other testimonials - keep hidden and absolutely positioned
          ref.style.position = "absolute"
          ref.style.zIndex = "1"
          ref.style.top = "0"
          ref.style.left = "0"
          ref.style.opacity = "0"
          ref.style.visibility = "hidden"
          gsap.set(ref, {
            opacity: 0,
            visibility: "hidden",
            y: 20
          })
        }
      }
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    })

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })

    // Animate first testimonial in
    if (testimonialRefs.current[0]) {
      tl.to(testimonialRefs.current[0], {
        opacity: 1,
        visibility: "visible",
        y: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.5")
    }
  }, { scope: sectionRef })

  return (
    <section id="testimonials" ref={sectionRef} className="testimonials">
      <div className="testimonials__container">
        <h2 ref={titleRef} className="testimonials__title">
          Lo que dicen quienes han vivido el proceso
        </h2>

        <div ref={carouselRef} className="testimonials__carousel">
          <div className="testimonials__carousel-wrapper">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                ref={el => {
                  testimonialRefs.current[index] = el
                  // Immediately set initial state when ref is set
                  if (el) {
                    el.style.opacity = "0"
                    el.style.visibility = "hidden"
                    if (index === 0) {
                      el.style.position = "relative"
                      el.style.zIndex = "2"
                    } else {
                      el.style.position = "absolute"
                      el.style.zIndex = "1"
                      el.style.top = "0"
                      el.style.left = "0"
                    }
                  }
                }}
                className={`testimonials__item ${index === currentIndex ? 'testimonials__item--active' : ''}`}
              >
                <div 
                  className="testimonials__content"
                  onMouseEnter={pauseAutoTransition}
                  onMouseLeave={resumeAutoTransition}
                >
                  {testimonial.photo && (
                    <div className="testimonials__photo-wrapper">
                      <img 
                        src={testimonial.photo} 
                        alt={testimonial.author}
                        className="testimonials__photo"
                      />
                    </div>
                  )}
                  <div className="testimonials__text-wrapper">
                    <p className="testimonials__text">"{testimonial.text}"</p>
                    <p className="testimonials__author">— {testimonial.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonials__dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonials__dot ${index === currentIndex ? 'testimonials__dot--active' : ''}`}
                onClick={() => goToTestimonial(index, true)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

