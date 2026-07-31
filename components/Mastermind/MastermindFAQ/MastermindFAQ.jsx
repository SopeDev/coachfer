'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './MastermindFAQ.scss'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const faqData = [
  {
    question: '¿Esto es una suscripción mensual?',
    answer:
      'No. Compras un paquete de créditos de sesión con una vigencia determinada. No se renueva automáticamente.'
  },
  {
    question: '¿Qué es un crédito?',
    answer:
      'Cada crédito te permite reservar una sesión en vivo del Entrenamiento de la Consciencia. Al reservar, se consume un crédito.'
  },
  {
    question: '¿Qué pasa si no puedo asistir una semana?',
    answer:
      'Tus créditos no se pierden solo por saltarte una fecha. Mientras estén vigentes, puedes reservar otras sesiones disponibles.'
  },
  {
    question: '¿Puedo cancelar una reserva?',
    answer:
      'Sí. Si cancelas antes de la fecha límite, el crédito suele liberarse para usarlo en otra sesión. Cancelaciones tardías o no-shows pueden consumir el crédito según la política vigente.'
  },
  {
    question: '¿Hay grabaciones y materiales?',
    answer:
      'Sí. Las sesiones incluyen acceso a grabaciones y materiales de integración para quienes tengan la reserva correspondiente.'
  },
  {
    question: '¿Necesito experiencia previa en astrología?',
    answer:
      'No. El laboratorio está diseñado para integrar astrología aplicada y consciencia de forma práctica, con acompañamiento grupal.'
  }
]

export default function MastermindFAQ() {
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

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.7')
      .to(itemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1
      }, '-=0.5')
  }, { scope: sectionRef })

  const toggleItem = (index) => {
    const item = itemsRef.current[index]
    const answer = item?.querySelector('.mastermind-faq__answer')

    if (openIndex === index) {
      gsap.to(answer, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setOpenIndex(null)
        }
      })
    } else {
      if (openIndex !== null && itemsRef.current[openIndex]) {
        const prevAnswer = itemsRef.current[openIndex].querySelector('.mastermind-faq__answer')
        gsap.to(prevAnswer, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        })
      }

      setOpenIndex(index)
      gsap.fromTo(
        answer,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.inOut'
        }
      )
    }
  }

  return (
    <section id="faq" ref={sectionRef} className="mastermind-faq">
      <div className="mastermind-faq__container">
        <h2 ref={titleRef} className="mastermind-faq__title">
          Preguntas frecuentes
        </h2>
        <p ref={subtitleRef} className="mastermind-faq__subtitle">
          Resolvemos las dudas más comunes sobre créditos, reservas y el laboratorio semanal
        </p>

        <div className="mastermind-faq__items">
          {faqData.map((item, index) => (
            <div
              key={item.question}
              ref={(el) => { itemsRef.current[index] = el }}
              className={`mastermind-faq__item${openIndex === index ? ' mastermind-faq__item--open' : ''}`}
            >
              <button
                type="button"
                className="mastermind-faq__question"
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
              >
                <span className="mastermind-faq__question-text">{item.question}</span>
                <span className="mastermind-faq__icon">
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
              <div className="mastermind-faq__answer">
                <div className="mastermind-faq__answer-content">
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
