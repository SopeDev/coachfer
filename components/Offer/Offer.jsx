"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Button from "../Button/Button"
import "./Offer.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Offer() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const packagesRef = useRef([])

  const packages = [
    {
      name: "RECODE LITE",
      tagline: "Para quien quiere iniciar",
      features: [
        "Interpretación profunda de Carta Cuántica Kabalista",
        "Identificación de 6 heridas centrales",
        "3 reprogramaciones con letras",
        "Plan de Tikún de 21 días"
      ],
      duration: "2 sesiones",
      price: "$4,400 – $6,600 MXN",
      popular: false
    },
    {
      name: "RECODE MAESTRO",
      tagline: "Transformación real — tu programa estrella",
      badge: "Más vendido",
      features: [
        "Lectura total del software del alma",
        "Revisión nodos, tikún, linaje, contratos kármicos",
        "Reprogramación de 7 heridas",
        "7 audios personalizados de letras hebreas",
        "Plan de 40 días",
        "Acompañamiento WhatsApp",
        "Ritual de cierre y activación del destino superior"
      ],
      duration: "4–6 sesiones",
      price: "$9,900 – $16,500 MXN",
      popular: true
    },
    {
      name: "RECODE ÉLITE",
      tagline: "Certificación interna de su alma",
      features: [
        "Todo lo de Maestro",
        "12 sesiones (una por planeta + nodos)",
        "Audio completo de su \"Código Kabalista Personal\"",
        "Sesión de Árbol de la Vida con colocación planetaria",
        "Liberación profunda de linaje",
        "Lectura anual + seguimiento trimestral",
        "Prioridad y acceso directo",
        "Ritual de misión del alma 1 a 1"
      ],
      duration: "3 meses",
      price: "$22,200 – $33,000 MXN",
      popular: false
    }
  ]

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...packagesRef.current], {
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
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.7")
    .to(packagesRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15
    }, "-=0.5")
  }, { scope: sectionRef })

  return (
    <section id="offer" ref={sectionRef} className="offer">
      <div className="offer__container">
        <h2 ref={titleRef} className="offer__title">
          Tres niveles de profundidad, un mismo propósito: tu transformación
        </h2>
        <p ref={subtitleRef} className="offer__subtitle">
          Cada paquete está diseñado para un nivel diferente de compromiso y profundidad. Elige el que resuene con dónde estás ahora y hacia dónde quieres ir.
        </p>

        <div className="offer__packages">
          {packages.map((pkg, index) => (
            <div
              key={index}
              ref={el => packagesRef.current[index] = el}
              className={`offer__package ${pkg.popular ? 'offer__package--popular' : ''}`}
            >
              {pkg.badge && (
                <div className="offer__badge">{pkg.badge}</div>
              )}
              <h3 className="offer__package-name">{pkg.name}</h3>
              <p className="offer__package-tagline">{pkg.tagline}</p>
              
              <div className="offer__package-features">
                <p className="offer__features-title">Incluye:</p>
                <ul className="offer__features-list">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="offer__feature-item">
                      <span className="offer__feature-icon">✓</span>
                      <span className="offer__feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__package-footer">
                <p className="offer__duration">Duración: <strong>{pkg.duration}</strong></p>
                <p className="offer__price">{pkg.price}</p>
                <Button 
                  type={pkg.popular ? "primary" : "secondary"}
                  href="#agendar"
                  className="offer__package-cta"
                >
                  Agenda tu proceso
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

