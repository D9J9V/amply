"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Radio, Users, Home, Search, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNavigation() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Hide/show navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      badge: null,
    },
    {
      href: "/explore",
      icon: Search,
      label: "Explore",
      badge: null,
    },
    {
      href: "/library",
      icon: BookOpen,
      label: "Library",
      badge: null,
    },
    {
      href: "/live",
      icon: Radio,
      label: "Live",
      badge: { text: "3", color: "bg-red-500" },
    },
    {
      href: "/profile",
      icon: Users,
      label: "Profile",
      badge: null,
    },
  ]

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-amply-white/95 backdrop-blur-md border-t border-gray-100 transition-transform duration-300 md:hidden shadow-soft safe-area-bottom ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 py-2 px-1 rounded-2xl transition-all duration-200 relative touch-target min-h-[60px] ${
                isActive
                  ? "text-amply-orange bg-amply-orange/10"
                  : "text-gray-500 hover:text-amply-orange hover:bg-gray-50"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <IconComponent className={`w-5 h-5 ${isActive ? "text-amply-orange" : ""}`} />
                {item.badge && (
                  <Badge
                    className={`absolute -top-1 -right-2 ${item.badge.color} text-white text-xs min-w-[16px] h-[16px] flex items-center justify-center p-0 animate-soft-pulse rounded-full`}
                  >
                    {item.badge.text}
                  </Badge>
                )}
              </div>
              <span
                className={`text-xs font-medium leading-none truncate max-w-full ${isActive ? "text-amply-orange" : ""}`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amply-orange rounded-full"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}