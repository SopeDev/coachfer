'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import StartInterestButton from '../../StartInterestButton/StartInterestButton'
import { trackWhatsAppClick } from '../../../lib/analytics'
import {
  mastermindPackages,
  formatPackagePrice,
  getPerSessionPrice,
  getPackageSavings
} from '../../../data/mastermindPackages'
import './MastermindPackages.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const policies = [
  'Cada reserva consume un crédito (una sesión).',
  'Los créditos permanecen disponibles hasta su fecha de vigencia.',
  'Tú eliges a qué sesiones asistir.',
  'Perder una semana puntual no elimina automáticamente tus créditos restantes.',
  'La cancelación a tiempo puede liberar el crédito; cancelaciones tardías y no-shows consumen el crédito según la política vigente.'
]

const multiPackages = mastermindPackages.filter((pkg) => pkg.creditQuantity > 1)
const singlePackage = mastermindPackages.find((pkg) => pkg.creditQuantity === 1)

export default function MastermindPackages() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const cardsRef = useRef([])
  const singleRef = useRef(null)
  const policyRef = useRef(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    const targets = [
      titleRef.current,
      subtitleRef.current,
      ...cardsRef.current,
      singleRef.current,
      policyRef.current
    ].filter(Boolean)

    gsap.set(targets, { opacity: 0, y: 36 })

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.55')
      .to(cardsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.4')
      .to(singleRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.35')
      .to(policyRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.35')
  }, { scope: sectionRef })

  return (
    <section id="paquetes" ref={sectionRef} className="mastermind-packages">
      <div className="mastermind-packages__container">
        <h2 ref={titleRef} className="mastermind-packages__title">
          Paquetes de sesiones
        </h2>
        <p ref={subtitleRef} className="mastermind-packages__subtitle">
          No son suscripciones mensuales. Son paquetes de créditos prepago:
          compras sesiones por adelantado y las usas dentro de su vigencia.
        </p>

        <div className="mastermind-packages__packages">
          {multiPackages.map((pkg, index) => {
            const perSession = getPerSessionPrice(pkg)
            const savings = getPackageSavings(pkg)

            return (
              <article
                key={pkg.id}
                ref={(el) => { cardsRef.current[index] = el }}
                className={`mastermind-packages__package${
                  pkg.featured ? ' mastermind-packages__package--popular' : ''
                }`}
              >
                {pkg.featured ? (
                  <div className="mastermind-packages__badge">Más elegido</div>
                ) : null}

                <div className="mastermind-packages__package-header">
                  <h3 className="mastermind-packages__package-name">{pkg.name}</h3>
                  <p className="mastermind-packages__package-tagline">{pkg.tagline}</p>
                </div>

                <div className="mastermind-packages__package-duration">
                  <span className="mastermind-packages__duration-label">Duración</span>
                  <span className="mastermind-packages__duration-value">
                    {pkg.creditQuantity} sesiones · {pkg.validityLabel}
                  </span>
                </div>

                <div className="mastermind-packages__package-price-section">
                  <p className="mastermind-packages__price">{formatPackagePrice(pkg)}</p>
                  {perSession ? (
                    <p className="mastermind-packages__price-detail">
                      ${perSession} por sesión
                    </p>
                  ) : null}
                  {savings ? (
                    <p className="mastermind-packages__savings">
                      Ahorras ${savings} vs. sesiones individuales
                    </p>
                  ) : null}
                </div>

                <div className="mastermind-packages__package-features">
                  <p className="mastermind-packages__features-title">Incluye:</p>
                  <ul className="mastermind-packages__features-list">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="mastermind-packages__feature-item">
                        <span className="mastermind-packages__feature-icon">✓</span>
                        <span className="mastermind-packages__feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mastermind-packages__package-ideal">
                  <p className="mastermind-packages__ideal-text">
                    <strong>Ideal para:</strong> {pkg.idealFor}
                  </p>
                </div>

                <div className="mastermind-packages__package-footer">
                  <StartInterestButton
                    type="secondary"
                    product="MASTERMIND"
                    packageSlug={pkg.slug}
                    className="mastermind-packages__package-cta"
                    onClick={() => trackWhatsAppClick(`Mastermind - ${pkg.name}`)}
                  >
                    Crear cuenta y continuar
                  </StartInterestButton>
                </div>
              </article>
            )
          })}
        </div>

        {singlePackage ? (
          <div className="mastermind-packages__single-session-section">
            <h3 className="mastermind-packages__single-session-title">
              ¿Prefieres empezar con una Sesión Única?
            </h3>
            <p className="mastermind-packages__single-session-subtitle">
              Si aún no estás seguro de comprometerte con un paquete completo,
              puedes comenzar con Activación: una sesión individual para conocer
              el formato y experimentar el laboratorio.
            </p>

            <div ref={singleRef} className="mastermind-packages__single-session">
              <div className="mastermind-packages__single-session-content">
                <div className="mastermind-packages__single-session-header">
                  <h3 className="mastermind-packages__single-session-name">
                    {singlePackage.name}
                  </h3>
                  <p className="mastermind-packages__single-session-tagline">
                    &ldquo;{singlePackage.tagline.replace(/\.$/, '')}&rdquo;
                  </p>
                </div>
                <div className="mastermind-packages__single-session-duration">
                  <span className="mastermind-packages__single-session-duration-label">
                    Duración:
                  </span>
                  <span className="mastermind-packages__single-session-duration-value">
                    1 sesión · {singlePackage.validityLabel}
                  </span>
                </div>
                <div className="mastermind-packages__single-session-price">
                  {formatPackagePrice(singlePackage)}
                </div>
                <div className="mastermind-packages__single-session-features">
                  {singlePackage.features.flatMap((feature, index) =>
                    index === 0
                      ? [<span key={feature}>{feature}</span>]
                      : [
                          <span key={`${feature}-dot`}>•</span>,
                          <span key={feature}>{feature}</span>
                        ]
                  )}
                </div>
                <div className="mastermind-packages__single-session-footer">
                  <StartInterestButton
                    type="secondary"
                    product="MASTERMIND"
                    packageSlug={singlePackage.slug}
                    className="mastermind-packages__single-session-cta"
                    onClick={() => trackWhatsAppClick(`Mastermind - ${singlePackage.name}`)}
                  >
                    Crear cuenta y continuar
                  </StartInterestButton>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div ref={policyRef} className="mastermind-packages__policy">
          <h3 className="mastermind-packages__policy-title">Cómo funcionan los créditos</h3>
          <p className="mastermind-packages__policy-subtitle">
            Un sistema simple: compras créditos, reservas sesiones y entrenas a tu ritmo.
          </p>
          <div className="mastermind-packages__policy-panel">
            <ul className="mastermind-packages__policy-list">
              {policies.map((policy) => (
                <li key={policy}>{policy}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
