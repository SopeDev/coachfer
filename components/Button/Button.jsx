"use client"

import { forwardRef } from "react"
import "./Button.scss"

const Button = forwardRef(function Button({ 
  children, 
  type = "primary", 
  href, 
  onClick,
  className = "",
  ...props 
}, ref) {
  const buttonClasses = `button button--${type} ${className}`.trim()

  if (href) {
    return (
      <a 
        ref={ref}
        href={href} 
        className={buttonClasses}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button 
      ref={ref}
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button

