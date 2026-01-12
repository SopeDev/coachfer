"use client"

import { useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import "./FAQ.scss"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const faqData = [
  {
    question: "¿Qué es AstroHacking exactamente?",
    answer: "AstroHacking es un método integral de reprogramación cuántica que combina la astrología kabalista, la física cuántica, y técnicas de reprogramación subconsciente para liberar patrones kármicos heredados y reconectarte con tu propósito superior."
  },
  {
    question: "¿Necesito conocimientos previos de astrología o kabbalah?",
    answer: "No es necesario. El proceso está diseñado para que cualquier persona, independientemente de su conocimiento previo, pueda beneficiarse completamente del método. Fernando te guiará en cada paso."
  },
  {
    question: "¿Cómo se realizan las sesiones?",
    answer: "Las sesiones se realizan de forma virtual, lo que te permite acceder al proceso desde cualquier lugar del mundo. Solo necesitas un espacio tranquilo y conexión a internet."
  },
  {
    question: "¿Qué necesito para empezar?",
    answer: "Solo necesitas tu fecha, hora y lugar de nacimiento exactos para generar tu carta natal. Si no conoces tu hora exacta de nacimiento, podemos trabajar con aproximaciones."
  },
  {
    question: "¿Cuánto tiempo tarda en verse resultados?",
    answer: "Muchas personas reportan cambios significativos desde la primera sesión. La transformación profunda es un proceso continuo que se desarrolla a lo largo del programa completo."
  },
  {
    question: "¿Puedo contactarte antes de reservar para hacer más preguntas?",
    answer: "Por supuesto. Puedes escribir por WhatsApp para resolver cualquier duda antes de tomar tu decisión."
  },
  {
    question: "¿Las sesiones quedan grabadas?",
    answer: "Sí, cada sesión queda grabada y se te envía para que puedas revisarla cuantas veces necesites y profundizar en el trabajo de integración."
  },
  {
    question: "¿Qué pasa si no puedo asistir a una sesión programada?",
    answer: "Las sesiones pueden reprogramarse con al menos 24 horas de anticipación. La flexibilidad es importante para respetar tu proceso."
  },
  {
    question: "¿Los pagos son seguros? ¿Qué métodos aceptan?",
    answer: "Aceptamos pagos mediante transferencia bancaria. Los detalles específicos se proporcionan al momento de la reserva."
  },
  {
    question: "¿Hay garantía de resultados?",
    answer: "El AstroHacking requiere tu participación activa y compromiso con el proceso. Los resultados dependen de tu apertura y disposición para integrar el trabajo. Sin embargo, confío plenamente en el método: si completas tu paquete y sientes que no obtuviste el valor prometido, te reembolso el 100% de tu inversión. Tu transformación es mi prioridad."
  }
]

export default function FAQ() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const itemsRef = useRef([])
  const [openIndex, setOpenIndex] = useState(null)

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !subtitleRef.current) return

    gsap.set([titleRef.current, subtitleRef.current, ...itemsRef.current], {
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
    .to(itemsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1
    }, "-=0.5")
  }, { scope: sectionRef })

  const toggleItem = (index) => {
    const item = itemsRef.current[index]
    const answer = item?.querySelector('.faq__answer')
    
    if (openIndex === index) {
      // Close
      gsap.to(answer, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setOpenIndex(null)
        }
      })
    } else {
      // Close previous if open
      if (openIndex !== null && itemsRef.current[openIndex]) {
        const prevAnswer = itemsRef.current[openIndex].querySelector('.faq__answer')
        gsap.to(prevAnswer, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        })
      }
      
      // Open new
      setOpenIndex(index)
      gsap.fromTo(answer, 
        { height: 0, opacity: 0 },
        { 
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.inOut"
        }
      )
    }
  }

  return (
    <section id="faq" ref={sectionRef} className="faq">
      <div className="faq__container">
        <h2 ref={titleRef} className="faq__title">
          Preguntas Frecuentes
        </h2>
        <p ref={subtitleRef} className="faq__subtitle">
          Resolvemos las dudas más comunes sobre AstroHacking y el proceso de transformación
        </p>

        <div className="faq__items">
          {faqData.map((item, index) => (
            <div
              key={index}
              ref={el => itemsRef.current[index] = el}
              className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq__question-text">{item.question}</span>
                <span className="faq__icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 5L10 15M5 10L15 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div className="faq__answer">
                <div className="faq__answer-content">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
