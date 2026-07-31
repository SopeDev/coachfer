"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import StartInterestButton from "../StartInterestButton/StartInterestButton"
import { trackWhatsAppClick } from "../../lib/analytics"
import "./Offer.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function Offer() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const packagesRef = useRef([])

  // Packages are now hardcoded in JSX below

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

        {/* THREE PACKAGES - 3 COLUMN GRID */}
        <div className="offer__packages">
          {/* PACKAGE 1: Versión Básica */}
          <div ref={el => packagesRef.current[1] = el} className="offer__package offer__package--basic">
            <div className="offer__package-header">
              <h3 className="offer__package-name">Iniciación</h3>
            </div>
            
            <div className="offer__package-duration">
              <span className="offer__duration-label">Duración</span>
              <span className="offer__duration-value">3 sesiones (4.5 horas total)</span>
            </div>

            <div className="offer__package-price-section">
              <p className="offer__price">$278 USD</p>
              <p className="offer__price-detail">$93 por sesión</p>
              <p className="offer__savings">Ahorras $55 vs. sesiones individuales</p>
            </div>

            <div className="offer__package-features">
              <p className="offer__features-title">Incluye:</p>
              <ul className="offer__features-list">
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Interpretación cuántica completa de la carta natal</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Identificación de heridas raíz y contratos kármicos</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación del principal aspecto kármico</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación del eje de propósito superior</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Rutina personalizada de respiración, afirmaciones y mantras</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Mini-protocolo de reprogramación para uso personal</span>
                </li>
              </ul>
            </div>

            <div className="offer__package-ideal">
              <p className="offer__ideal-text">
                <strong>Ideal para:</strong> Quien quiere adentrarse al poder de la reprogramación cuántica
              </p>
            </div>

            <div className="offer__package-footer">
              <StartInterestButton
                type="secondary"
                product="COACHING"
                packageSlug="iniciacion"
                className="offer__package-cta"
                onClick={() => trackWhatsAppClick("package_iniciacion")}
              >
                Crear cuenta y continuar
              </StartInterestButton>
            </div>
          </div>

          {/* PACKAGE 3: Versión Integral */}
          <div ref={el => packagesRef.current[2] = el} className="offer__package offer__package--popular">
            <div className="offer__badge">Más Vendido</div>
            <div className="offer__package-header">
              <h3 className="offer__package-name">Transformación Profunda</h3>
            </div>
            
            <div className="offer__package-duration">
              <span className="offer__duration-label">Duración</span>
              <span className="offer__duration-value">7 sesiones (10.5 horas total)</span>
            </div>

            <div className="offer__package-price-section">
              <p className="offer__price">$444 USD</p>
              <p className="offer__price-detail">$63 por sesión</p>
              <p className="offer__savings">Ahorras $333 vs. sesiones individuales</p>
            </div>

            <div className="offer__package-features">
              <p className="offer__features-title">Incluye todo lo del Nivel I, más:</p>
              <ul className="offer__features-list">
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Profundización de la interpretación cuántica</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">2 sesiones adicionales de reprogramación de aspectos kármicos</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">2 sesiones de activación de dones, misión y propósito</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación de heridas de la infancia</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Meditación personalizada de activación del Destino Superior</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Integración práctica de los nuevos códigos de conciencia</span>
                </li>
              </ul>
            </div>

            <div className="offer__package-ideal">
              <p className="offer__ideal-text">
                <strong>Ideal para:</strong> Quien busca una transformación profunda y duradera
              </p>
            </div>

            <div className="offer__package-footer">
              <StartInterestButton
                type="secondary"
                product="COACHING"
                packageSlug="transformacion-profunda"
                className="offer__package-cta"
                onClick={() => trackWhatsAppClick("package_transformacion_completa")}
              >
                Crear cuenta y continuar
              </StartInterestButton>
            </div>
          </div>

          {/* PACKAGE 4: Versión Premium */}
          <div ref={el => packagesRef.current[3] = el} className="offer__package">
            <div className="offer__package-header">
              <h3 className="offer__package-name">Maestría 360</h3>
            </div>
            
            <div className="offer__package-duration">
              <span className="offer__duration-label">Duración</span>
              <span className="offer__duration-value">13 sesiones (19.5 horas total)</span>
            </div>

            <div className="offer__package-price-section">
              <p className="offer__price">$667 USD</p>
              <p className="offer__price-detail">$51 por sesión</p>
              <p className="offer__savings">Ahorras $776 vs. sesiones individuales</p>
            </div>

            <div className="offer__package-features">
              <p className="offer__features-title">Incluye todo lo del Nivel II, más:</p>
              <ul className="offer__features-list">
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación completa de las 12 casas astrológicas</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación de planetas regentes y aspectos clave</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Meditaciones específicas para cada área de vida</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Trabajo profundo de activación del ADN espiritual</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Entrenamiento en técnicas de Reprogramación Cuántica</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Acompañamiento en el uso consciente de los Dones Potenciales</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Integración final del nuevo diseño de vida</span>
                </li>
              </ul>
            </div>

            <div className="offer__package-ideal">
              <p className="offer__ideal-text">
                <strong>Ideal para:</strong> Quien busca la transformación total y dominar la reprogramación cuántica
              </p>
            </div>

            <div className="offer__package-footer">
              <StartInterestButton
                type="secondary"
                product="COACHING"
                packageSlug="maestria-360"
                className="offer__package-cta"
                onClick={() => trackWhatsAppClick("package_maestria_total")}
              >
                Crear cuenta y continuar
              </StartInterestButton>
            </div>
          </div>
        </div>

        {/* SINGLE SESSION - ENTRY POINT */}
        <div className="offer__single-session-section">
          <h3 className="offer__single-session-title">
            ¿Prefieres empezar con una Sesión Única?
          </h3>
          <p className="offer__single-session-subtitle">
            Si aún no estás seguro de comprometerte con un paquete completo, puedes comenzar con Descubrimiento: una sesión individual para conocer tu programa y experimentar el método.
          </p>
          
          <div ref={el => packagesRef.current[0] = el} className="offer__single-session">
            <div className="offer__single-session-content">
              <div className="offer__single-session-header">
                <h3 className="offer__single-session-name">Descubrimiento</h3>
                <p className="offer__single-session-tagline">"Conoce tu programa"</p>
              </div>
              <div className="offer__single-session-duration">
                <span className="offer__single-session-duration-label">Duración:</span>
                <span className="offer__single-session-duration-value">1 sesión (90 minutos)</span>
              </div>
              <div className="offer__single-session-price">$111 USD</div>
              <div className="offer__single-session-features">
                <span>Interpretación inicial de tu carta natal</span>
                <span>•</span>
                <span>Identificación de tu herida raíz principal</span>
                <span>•</span>
                <span>Mapa básico de tus contratos kármicos</span>
              </div>
              <div className="offer__single-session-footer">
                <StartInterestButton
                  type="secondary"
                  product="COACHING"
                  packageSlug="sesion-unica"
                  className="offer__single-session-cta"
                  onClick={() => trackWhatsAppClick("package_sesion_unica")}
                >
                  Crear cuenta y continuar
                </StartInterestButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

