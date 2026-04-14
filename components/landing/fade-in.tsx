"use client"

import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  threshold?: number
}

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    if (!ref.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold }
    )
    
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, threshold])
  
  return visible
}

export function FadeIn({ children, delay = 0, className, style, threshold = 0.15 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, threshold)
  
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
