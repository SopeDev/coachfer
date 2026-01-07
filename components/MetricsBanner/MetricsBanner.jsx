"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import "./MetricsBanner.scss"

gsap.registerPlugin(useGSAP)

export default function MetricsBanner() {
  const sectionRef = useRef(null)
  const metricsRef = useRef([])

  const metrics = [
    "+10,000 horas de consulta",
    "26+ años de experiencia",
    "Método integrado de 4 Pilares",
    "Sesiones personalizadas"
  ]

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.set(metricsRef.current, {
      opacity: 0,
      y: 20
    })

    gsap.to(metricsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.3
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="metrics-banner">
      <div className="metrics-banner__container">
        {metrics.map((metric, index) => (
          <div key={index} className="metrics-banner__wrapper">
            <span
              ref={el => metricsRef.current[index] = el}
              className="metrics-banner__metric"
            >
              {metric}
            </span>
            {index < metrics.length - 1 && (
              <span className="metrics-banner__divider">|</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}



