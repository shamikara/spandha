'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Galaxy() {
  const colors = [
    '#a0d2eb',
    '#e5eaf5',
    '#d0bdf4',
    '#8458B3',
    '#494D5F',
    '#a28089',
    '#d1b3c4',
    '#b392ac',
    '#735d78',
    '#3d2a4d',
  ]

  const [stars] = useState(() =>
    Array.from({ length: 300 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 2 + Math.random() * 8,
      delay: Math.random() * 5,
    }))
  )

  const [brightStars] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: `bright-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 2,
      duration: 2 + Math.random() * 8,
      delay: Math.random() * 5,
    }))
  )

  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-wedding-maroon/30 via-wedding-dark/95 to-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_var(--tw-gradient-stops))] from-wedding-gold/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,_var(--tw-gradient-stops))] from-wedding-rose/20 via-transparent to-transparent" />

      {/* Galaxy Core Glow */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wedding-gold/10 blur-3xl" />

      {/* Rotating Galaxy */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[200vw] w-[200vw]"
        style={{
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 500,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Regular Stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          />
        ))}

        {/* Bright Stars */}
        {brightStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 4}px ${
                star.size * 2
              }px rgba(232, 197, 71, 0.6)`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: star.delay,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}