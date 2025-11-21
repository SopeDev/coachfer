"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import "./SobreFernando.scss"

gsap.registerPlugin(ScrollTrigger)

export default function SobreFernando() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const imageWrapperRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !contentRef.current || !imageRef.current || !imageWrapperRef.current) return

    gsap.set([titleRef.current, contentRef.current, imageRef.current], {
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
    .to(imageRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.7")
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.7")

    // Parallax effect for image
    gsap.to(imageRef.current, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: imageWrapperRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current || trigger.vars.trigger === imageWrapperRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section id="sobre" ref={sectionRef} className="sobre-fernando">
      <div className="sobre-fernando__container">
        <div className="sobre-fernando__content">
          <div ref={imageWrapperRef} className="sobre-fernando__image-wrapper">
            <div ref={imageRef} className="sobre-fernando__image-inner">
              <Image
                src="/images/about.jpg"
                alt="Fernando Quintero"
                width={600}
                height={800}
                className="sobre-fernando__image"
              />
            </div>
          </div>
          
          <div ref={contentRef} className="sobre-fernando__text">
            <h2 ref={titleRef} className="sobre-fernando__title">
              Sobre Fernando
            </h2>
            <p className="sobre-fernando__paragraph">
              Con más de <strong>26 años de experiencia</strong> en astrología cuántica kabbalista, 
              Fernando Quintero ha dedicado su vida a ayudar a las personas a reconectarse con su 
              propósito más elevado y transformar sus realidades desde el plano cuántico.
            </p>
            <p className="sobre-fernando__paragraph">
              Su método único de <strong>Reprogramación Cuántica del Destino</strong> combina 
              conocimientos ancestrales de la Kabbalah con principios de física cuántica, 
              creando un proceso transformador que libera limitaciones kármicas y activa 
              el máximo potencial de cada persona.
            </p>
            <p className="sobre-fernando__paragraph">
              Fernando guía a sus clientes a través de un viaje profundo de autoconocimiento, 
              donde cada sesión es un paso hacia la liberación de patrones limitantes y 
              la activación de una nueva frecuencia de conciencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

