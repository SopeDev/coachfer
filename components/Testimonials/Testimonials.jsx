"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./Testimonials.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Testimonials() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const testimonialsRef = useRef([])

  // Placeholder testimonials - can be replaced with real ones later
  const testimonials = [
    {
      text: "El proceso con Fernando transformó completamente mi perspectiva. Por fin entendí por qué repetía los mismos patrones y pude liberarme de ellos.",
      author: "Cliente testimonial"
    },
    {
      text: "Después de las 3 sesiones, siento que tengo un código nuevo instalado. Mi vida cambió de dirección y ahora vivo con mucha más claridad y propósito.",
      author: "Cliente testimonial"
    },
    {
      text: "Fernando tiene un don especial para conectar con las memorias kármicas y ayudarte a reprogramarlas. Este método es realmente poderoso.",
      author: "Cliente testimonial"
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    gsap.set([titleRef.current, ...testimonialsRef.current], {
      opacity: 0,
      y: 50
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
    .to(testimonialsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2
    }, "-=0.5")
  }, { scope: sectionRef })

  return (
    <section id="testimonials" ref={sectionRef} className="testimonials">
      <div className="testimonials__container">
        <h2 ref={titleRef} className="testimonials__title">
          Lo que dicen quienes han vivido el proceso
        </h2>

        <div className="testimonials__grid">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={el => testimonialsRef.current[index] = el}
              className="testimonials__item"
            >
              <p className="testimonials__text">"{testimonial.text}"</p>
              <p className="testimonials__author">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

