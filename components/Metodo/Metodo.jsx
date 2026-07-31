'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './Metodo.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const pillars = [
  {
    title: 'Pilar Espiritual',
    shortTitle: 'Pilar Espiritual',
    subtitle: 'Propósito, legado y diseño divino',
    description:
      'Trabajamos con tu misión encarnacional, tu programa de destino superior y la reconexión con la consciencia de unidad, que trasciende la dualidad. Transformamos creencias antiguas, elevando tu visión y el sentido de propósito.',
    shortDescription:
      'Reconectas con tu misión encarnacional y tu destino superior, trascendiendo la dualidad.',
    result: 'Recuerdas quién realmente eres y a qué viniste a esta vida.'
  },
  {
    title: 'Pilar Mental',
    shortTitle: 'Pilar Mental',
    subtitle: 'Programaciones, contratos y patrones heredados',
    description:
      'Hackeamos programas subconscientes, patrones kármicos y tu sistema de creencias heredado. Transformamos tu nivel de percepción desde la mente racional hacia la conciencia superior.',
    shortDescription:
      'Hackeas programas subconscientes y patrones heredados, elevando tu percepción hacia la consciencia superior.',
    result:
      'Dejas de operar desde el programa inferior y modificas tu diálogo interno para que sirva a la manifestación de tu propósito.'
  },
  {
    title: 'Pilar Emocional',
    shortTitle: 'Pilar Emocional',
    subtitle: 'Heridas, memorias celulares y patrones emocionales',
    description:
      'Transformamos heridas de infancia, heridas del alma y memorias celulares. Convertimos el dolor emocional en poder personal, liberando apegos e integrando duelos no procesados.',
    shortDescription:
      'Conviertes heridas y memorias celulares en poder personal, liberando apegos y duelos no procesados.',
    result:
      'Aprendes a reconocer el verdadero poder de las emociones como un tesoro de tu alma para tu ascensión.'
  },
  {
    title: 'Pilar Físico',
    shortTitle: 'Pilar Físico',
    subtitle: 'Cuerpo, hábitos y manifestación en la materia',
    description:
      'Trabajamos tu anclaje en la realidad, reprogramando hábitos y adicciones nocivas. Transformamos y recuperamos tu energía vital hacia la materialización de tu propósito.',
    shortDescription:
      'Reprogramas hábitos y adicciones, recuperando tu energía vital para materializar tu propósito.',
    result:
      'Reconoces tu cuerpo como un templo del espíritu y aprendes a cultivar y canalizar tu energía sexual de forma elevada.'
  }
]

export default function Metodo({ sectionLabel, compact = false, tone = 'white' }) {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const quadrantRef = useRef(null)
  const introRef = useRef(null)
  const labelRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current) return

    const labelEl = labelRef.current
    const fadeTargets = [titleRef.current, introRef.current, quadrantRef.current]
    if (labelEl) fadeTargets.unshift(labelEl)

    gsap.set(fadeTargets, {
      opacity: 0,
      y: 50
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    if (labelEl) {
      tl.to(labelEl, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out'
      })
    }

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, labelEl ? '-=0.4' : undefined)
      .to(introRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.5')
      .to(quadrantRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.5')
  }, { scope: sectionRef })

  return (
    <section
      id="metodo"
      ref={sectionRef}
      className={`metodo${compact ? ' metodo--compact' : ''}${tone === 'soft' ? ' metodo--soft' : ''}`}
    >
      <div className="metodo__container">
        {sectionLabel && (
          <h3 ref={labelRef} className="metodo__section-heading">
            {sectionLabel}
          </h3>
        )}

        <h2 ref={titleRef} className="metodo__title">
          <span className="metodo__title-indigo">AstroHacking</span>:{' '}
          <span className="metodo__title-accent">
            Reprogramación del Software Astrológico
          </span>
        </h2>

        <div className="metodo__quadrant-card">
          <div ref={introRef} className="metodo__quadrant-intro">
            <p className="metodo__quadrant-intro-text">
              Trabajamos en cuatro pilares al mismo tiempo — espiritual, mental,
              emocional y físico. En cada uno intervenimos de forma concreta
              para desbloquear patrones, recuperar claridad y anclar resultados
              en tu vida diaria.
            </p>
          </div>

          <div ref={quadrantRef} className="metodo__quadrant-grid">
            {pillars.map((pillar, index) => (
              <div key={pillar.title} className="metodo__quadrant-item">
                {compact ? (
                  <>
                    <span className="metodo__quadrant-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="metodo__quadrant-title">
                      {pillar.shortTitle}
                    </h3>
                    <p className="metodo__quadrant-description">
                      {pillar.shortDescription}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="metodo__quadrant-title">{pillar.title}</h3>
                    <p className="metodo__quadrant-subtitle">{pillar.subtitle}</p>
                    <p className="metodo__quadrant-description">{pillar.description}</p>
                    <div className="metodo__quadrant-result">
                      <div className="metodo__quadrant-result-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M9 12l2 2 4-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <p className="metodo__quadrant-result-content">
                        <strong>Resultado:</strong> {pillar.result}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
