"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import Image from "next/image"
import "./Header.scss"

gsap.registerPlugin(useGSAP)

export default function Header() {
  const headerRef = useRef(null)

  useGSAP(() => {
    if (!headerRef.current) return

    gsap.set(headerRef.current, { opacity: 0, y: -20 })

    gsap.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out"
    })
  }, { scope: headerRef })

  return (
    <header ref={headerRef} className="header">
      <div className="header__container">
        <Image
          src="/logo.png"
          alt="Fernando Quintero"
          width={150}
          height={60}
          priority
          className="header__logo"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </header>
  )
}

