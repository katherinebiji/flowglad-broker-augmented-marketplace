"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface PathData {
  path: string
  strokeWidth: number
  animationDuration: number
}

export function BackgroundPaths() {
  const [paths, setPaths] = useState<PathData[]>([])

  useEffect(() => {
    // Generate random SVG paths for background animation
    const generatePaths = () => {
      const pathsData: PathData[] = []
      for (let i = 0; i < 8; i++) {
        const startX = Math.random() * 100
        const startY = Math.random() * 100
        const endX = Math.random() * 100
        const endY = Math.random() * 100
        const controlX = Math.random() * 100
        const controlY = Math.random() * 100
        
        pathsData.push({
          path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
          strokeWidth: Math.random() * 2 + 0.5,
          animationDuration: Math.random() * 3 + 2
        })
      }
      setPaths(pathsData)
    }

    generatePaths()
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-slate-800">
      {/* Animated Background Paths */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {paths.map((pathData, index) => (
          <motion.path
            key={index}
            d={pathData.path}
            stroke="currentColor"
            strokeWidth={pathData.strokeWidth}
            fill="none"
            className="text-gray-400 dark:text-gray-600"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0, 0.6, 0.3, 0.6, 0],
            }}
            transition={{
              duration: pathData.animationDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </svg>

      {/* Floating Gradient Orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 dark:from-purple-600/20 dark:to-pink-800/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + index * 30}%`,
              top: `${10 + index * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Excellence
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover the extraordinary in the ordinary
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Discover Excellence
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}