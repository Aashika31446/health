'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export type CardAnimationVariant = 
  | 'tilt'         // 3D Gyroscopic tilt with specular glare
  | 'float'        // Smooth upward levitation with deep expanding shadow
  | 'shimmer'      // Diagonal holographic light beam sweep
  | 'glow-pulse'   // Breathing neon aurora border pulse
  | 'magnetic'     // Elastic 2D cursor pull & spring return
  | 'spotlight'    // Focused cursor-following glassmorphic spotlight
  | 'border-flow'  // Rotating circulating luminous gradient border

interface InteractiveTiltCardProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  variant?: CardAnimationVariant
  maxTilt?: number // Maximum tilt in degrees for 'tilt' variant
  glowColor?: string // Custom radial inner glow color
  borderGlowColor?: string // Custom radial border glow color
  enableGlare?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export default function InteractiveTiltCard({
  children,
  className = '',
  containerClassName = '',
  variant = 'tilt',
  maxTilt = 7,
  glowColor = 'rgba(2, 132, 199, 0.08)',
  borderGlowColor = 'rgba(56, 189, 248, 0.45)',
  enableGlare = true,
  onClick,
  style = {}
}: InteractiveTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, relX: 0.5, relY: 0.5 })

  // Normalized cursor coordinates (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics configurations
  const tiltSpring = { damping: 22, stiffness: 240, mass: 0.6 }
  const floatSpring = { damping: 18, stiffness: 220, mass: 0.7 }
  const elasticSpring = { damping: 15, stiffness: 190, mass: 0.5 }

  // 1. Tilt springs
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), tiltSpring)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), tiltSpring)

  // 2. Magnetic springs
  const magX = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), elasticSpring)
  const magY = useSpring(useTransform(y, [-0.5, 0.5], [-16, 16]), elasticSpring)

  // 3. Vertical lift springs
  const floatY = useSpring(isHovered ? -9 : 0, floatSpring)
  const shimmerY = useSpring(isHovered ? -5 : 0, floatSpring)
  const glowY = useSpring(isHovered ? -6 : 0, floatSpring)

  // Scale spring
  const scale = useSpring(
    isHovered 
      ? (variant === 'float' ? 1.022 : variant === 'magnetic' ? 1.02 : 1.016)
      : 1, 
    floatSpring
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const normalizedX = (mouseX / rect.width) - 0.5
    const normalizedY = (mouseY / rect.height) - 0.5

    x.set(normalizedX)
    y.set(normalizedY)

    setMousePos({
      x: mouseX,
      y: mouseY,
      relX: mouseX / rect.width,
      relY: mouseY / rect.height
    })
  }, [x, y])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
    setMousePos({ x: 0, y: 0, relX: 0.5, relY: 0.5 })
  }

  // Calculate dynamic motion styles depending on variant
  const getMotionStyle = () => {
    switch (variant) {
      case 'tilt':
        return {
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d' as const,
          ...style
        }
      case 'float':
        return {
          y: floatY,
          scale,
          ...style
        }
      case 'magnetic':
        return {
          x: magX,
          y: magY,
          scale,
          ...style
        }
      case 'shimmer':
        return {
          y: shimmerY,
          scale,
          ...style
        }
      case 'glow-pulse':
        return {
          y: glowY,
          scale,
          ...style
        }
      case 'border-flow':
        return {
          y: floatY,
          scale,
          ...style
        }
      case 'spotlight':
      default:
        return {
          scale,
          ...style
        }
    }
  }

  // Calculate outer shadow & ring classes depending on variant
  const getShadowClasses = () => {
    if (!isHovered) return 'shadow-sm'
    switch (variant) {
      case 'float':
        return 'shadow-2xl shadow-sky-500/20 ring-1 ring-sky-400/40'
      case 'glow-pulse':
        return 'shadow-xl shadow-purple-500/25 ring-2 ring-purple-400/60'
      case 'border-flow':
        return 'shadow-2xl shadow-indigo-500/20 ring-1 ring-indigo-400/50'
      case 'shimmer':
        return 'shadow-xl shadow-blue-500/15 ring-1 ring-blue-300/50'
      case 'magnetic':
        return 'shadow-xl shadow-cyan-500/20 ring-1 ring-cyan-300/40'
      case 'spotlight':
        return 'shadow-xl shadow-slate-900/10 ring-1 ring-slate-300/60'
      case 'tilt':
      default:
        return 'shadow-2xl shadow-sky-500/15 ring-1 ring-sky-300/40'
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative ${containerClassName}`}
      style={{ perspective: variant === 'tilt' ? 1000 : undefined }}
    >
      <motion.div
        style={getMotionStyle()}
        className={`relative w-full h-full transition-shadow duration-300 ease-out rounded-3xl ${getShadowClasses()} ${className}`}
      >
        {/* --- VARIANT SPECIFIC EFFECTS --- */}

        {/* 1. Border-flow: Continuous Rotating Beam Border */}
        {variant === 'border-flow' && (
          <div className="pointer-events-none absolute -inset-[2px] rounded-[inherit] overflow-hidden z-0">
            <motion.div
              className="absolute -inset-[150%] opacity-0 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0.4,
                background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${borderGlowColor} 60deg, transparent 120deg, ${glowColor} 240deg, ${borderGlowColor} 300deg, transparent 360deg)`
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
            />
          </div>
        )}

        {/* 2. Glow-pulse: Breathing Aurora Border Glow */}
        {variant === 'glow-pulse' && (
          <motion.div
            className="pointer-events-none absolute -inset-[2px] rounded-[inherit] z-0 blur-xs transition-opacity duration-300"
            animate={isHovered ? {
              opacity: [0.4, 0.95, 0.4],
              scale: [1, 1.01, 1]
            } : { opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{
              background: `linear-gradient(135deg, ${borderGlowColor}, ${glowColor}, ${borderGlowColor})`
            }}
          />
        )}

        {/* 3. Shimmer: Sweeping Holographic Light Beam */}
        {variant === 'shimmer' && (
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20">
            <motion.div 
              className="absolute top-0 -left-[140%] w-3/5 h-full bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-24deg]"
              animate={isHovered ? { left: ['-140%', '240%'] } : { left: '-140%' }}
              transition={isHovered ? { repeat: Infinity, duration: 1.9, ease: 'easeInOut', repeatDelay: 0.7 } : { duration: 0 }}
            />
          </div>
        )}

        {/* 4. Cursor Radial Glow Border (Tilt, Spotlight, Magnetic, Float) */}
        {variant !== 'border-flow' && variant !== 'glow-pulse' && (
          <div
            className="pointer-events-none absolute -inset-[1.5px] rounded-[inherit] transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, ${borderGlowColor}, transparent 65%)`
            }}
          />
        )}

        {/* 5. Ambient Radial Inner Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0 overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(340px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`
          }}
        />

        {/* 6. Dynamic Glare Reflection for Tilt */}
        {variant === 'tilt' && enableGlare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500 z-20 overflow-hidden mix-blend-overlay"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `linear-gradient(${mousePos.relX * 360}deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`
            }}
          />
        )}

        {/* Card Content - elevated in 3D for tilt or static */}
        <div 
          className="relative z-10 w-full h-full" 
          style={variant === 'tilt' ? { transform: 'translateZ(1px)' } : undefined}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
