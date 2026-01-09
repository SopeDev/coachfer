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
              <p className="offer__package-tagline">"Reprograma tu Mapa"</p>
            </div>
            
            <div className="offer__package-duration">
              <span className="offer__duration-label">Duración</span>
              <span className="offer__duration-value">3 sesiones (4.5 horas total)</span>
            </div>

            <div className="offer__package-price-section">
              <p className="offer__price">$278 USD</p>
              <p className="offer__price-detail">$93 por sesión</p>
            </div>

            <div className="offer__package-features">
              <p className="offer__features-title">Incluye:</p>
              <ul className="offer__features-list">
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Interpretación cuántica de la carta</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Identificación de heridas y contratos kármicos</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Rutina personalizada de respiración, mantras y chakras</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Mini-protocolo de reprogramación</span>
                </li>
              </ul>
            </div>

            <div className="offer__package-ideal">
              <p className="offer__ideal-text">
                <strong>Ideal para:</strong> Quien quiere adentrarse al poder de la reprogramación cuántica
              </p>
            </div>

            <div className="offer__package-footer">
              <Button 
                type="secondary"
                href="https://wa.me/529982230431?text=Hola,%20estoy%20interesado%20en%20el%20paquete%20Iniciación"
                className="offer__package-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Reservar Iniciación
              </Button>
            </div>
          </div>

          {/* PACKAGE 3: Versión Integral */}
          <div ref={el => packagesRef.current[2] = el} className="offer__package offer__package--popular">
            <div className="offer__badge">Más Vendido</div>
            <div className="offer__package-header">
              <h3 className="offer__package-name">Transformación Completa</h3>
              <p className="offer__package-tagline">"Recode de Alma"</p>
            </div>
            
            <div className="offer__package-duration">
              <span className="offer__duration-label">Duración</span>
              <span className="offer__duration-value">6 sesiones (9 horas total)</span>
            </div>

            <div className="offer__package-price-section">
              <p className="offer__price">$444 USD</p>
              <p className="offer__price-detail">$74 por sesión</p>
              <p className="offer__savings">Ahorras $111 vs. sesiones individuales</p>
            </div>

            <div className="offer__package-features">
              <p className="offer__features-title">Todo lo de Básica, más:</p>
              <ul className="offer__features-list">
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Mayor profundidad de interpretación en 2 sesiones adicionales</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación de los planetas kármicos</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación personalizada de heridas de la infancia</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Meditación de activación del Destino Superior desde la Astrología Kabbalista</span>
                </li>
              </ul>
            </div>

            <div className="offer__package-ideal">
              <p className="offer__ideal-text">
                <strong>Ideal para:</strong> Quien busca una transformación profunda y duradera
              </p>
            </div>

            <div className="offer__package-footer">
              <Button 
                type="secondary"
                href="https://wa.me/529982230431?text=Hola,%20estoy%20interesado%20en%20el%20paquete%20Transformación%20Completa"
                className="offer__package-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agendar Transformación
              </Button>
            </div>
          </div>

          {/* PACKAGE 4: Versión Premium */}
          <div ref={el => packagesRef.current[3] = el} className="offer__package">
            <div className="offer__package-header">
              <h3 className="offer__package-name">Maestría Total</h3>
              <p className="offer__package-tagline">"AstroHacking 360"</p>
            </div>
            
            <div className="offer__package-duration">
              <span className="offer__duration-label">Duración</span>
              <span className="offer__duration-value">12 sesiones (18 horas total)</span>
            </div>

            <div className="offer__package-price-section">
              <p className="offer__price">$667 USD</p>
              <p className="offer__price-detail">$56 por sesión</p>
              <p className="offer__savings">Ahorras $333 vs. sesiones individuales</p>
            </div>

            <div className="offer__package-features">
              <p className="offer__features-title">Todo lo de Integral, más:</p>
              <ul className="offer__features-list">
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Reprogramación de las 12 casas (todas las áreas de vida)</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Meditación de reprogramación de cada aspecto planetario</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Trabajo profundo de activación de ADN Divino</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Entrenamiento en el manejo de Reprogramación Cuántica</span>
                </li>
                <li className="offer__feature-item">
                  <span className="offer__feature-icon">✓</span>
                  <span className="offer__feature-text">Acompañamiento en el manejo y uso de los Dones Potenciales</span>
                </li>
              </ul>
            </div>

            <div className="offer__package-ideal">
              <p className="offer__ideal-text">
                <strong>Ideal para:</strong> Quien busca la transformación total y dominar la reprogramación cuántica
              </p>
            </div>

            <div className="offer__package-footer">
              <Button 
                type="secondary"
                href="https://wa.me/529982230431?text=Hola,%20estoy%20interesado%20en%20el%20paquete%20Maestría%20Total"
                className="offer__package-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar Maestría
              </Button>
            </div>
          </div>
        </div>

        {/* SINGLE SESSION - ENTRY POINT */}
        <div className="offer__single-session-section">
          <h3 className="offer__single-session-title">
            ¿Prefieres empezar con una sesión única?
          </h3>
          <p className="offer__single-session-subtitle">
            Si aún no estás seguro de comprometerte con un paquete completo, puedes comenzar con una sesión individual para conocer tu programa y experimentar el método.
          </p>
          
          <div ref={el => packagesRef.current[0] = el} className="offer__single-session">
            <div className="offer__single-session-content">
              <div className="offer__single-session-header">
                <h3 className="offer__single-session-name">Sesión Única</h3>
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
                <Button 
                  type="secondary"
                  href="https://wa.me/529982230431?text=Hola,%20estoy%20interesado%20en%20el%20paquete%20Sesión%20Única"
                  className="offer__single-session-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reservar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

