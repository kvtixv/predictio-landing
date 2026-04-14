"use client"

import { useRef, useState, useEffect } from "react"

interface StatCounterProps {
  value: number
  label: string
  suffix?: string
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

export function StatCounter({ value, label, suffix = "" }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!visible) return
    
    let start = 0
    const end = value
    const duration = 1500
    const step = duration / end
    
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, Math.max(step, 15))
    
    return () => clearInterval(timer)
  }, [visible, value])
  
  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-4xl font-extrabold tracking-tighter text-primary">
        {count}{suffix}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
