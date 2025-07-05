"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Download, Smartphone, Share, Plus } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent
  }
}

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Check if running as PWA
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")

    setIsStandalone(isStandaloneMode)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Debug info
    console.log("🔍 PWA Debug Info:", {
      isStandalone: isStandaloneMode,
      isIOS: iOS,
      userAgent: navigator.userAgent,
      displayMode: window.matchMedia("(display-mode: standalone)").matches,
    })

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("📱 beforeinstallprompt event fired")
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      window.deferredPrompt = promptEvent
      setCanInstall(true)

      // Show prompt after user interaction
      setTimeout(() => {
        const dismissed = localStorage.getItem("pwa-prompt-dismissed")
        const lastShown = localStorage.getItem("pwa-prompt-last-shown")
        const now = Date.now()
        const dayInMs = 24 * 60 * 60 * 1000

        // Show if not dismissed and not shown in last 24 hours
        if (!dismissed && (!lastShown || now - Number.parseInt(lastShown) > dayInMs) && !isStandaloneMode) {
          setShowPrompt(true)
          localStorage.setItem("pwa-prompt-last-shown", now.toString())
        }
      }, 5000) // Show after 5 seconds of interaction
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log("✅ PWA was installed")
      setShowPrompt(false)
      setCanInstall(false)
      localStorage.setItem("pwa-installed", "true")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // For iOS, show install instructions after some time
    if (iOS && !isStandaloneMode) {
      setTimeout(() => {
        const dismissed = localStorage.getItem("pwa-ios-prompt-dismissed")
        if (!dismissed) {
          setShowPrompt(true)
        }
      }, 10000) // Show after 10 seconds on iOS
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("❌ No deferred prompt available")
      return
    }

    console.log("🚀 Triggering install prompt")
    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    console.log(`👤 User choice: ${outcome}`)

    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt")
    } else {
      console.log("❌ User dismissed the install prompt")
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
    setCanInstall(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    if (isIOS) {
      localStorage.setItem("pwa-ios-prompt-dismissed", "true")
    } else {
      localStorage.setItem("pwa-prompt-dismissed", "true")
    }
  }

  // Don't show if already installed
  if (isStandalone) {
    return null
  }

  // Don't show if prompt not available and not iOS
  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 flex justify-center">
      <Card className="amply-card border-2 border-amply-orange/30 max-w-sm w-full amply-shadow-lg animate-gentle-float">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amply-orange to-amply-pink rounded-2xl flex items-center justify-center flex-shrink-0 animate-soft-pulse">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="amply-text-heading text-amply-black text-lg mb-1">
                {isIOS ? "Añadir a Inicio" : "Instalar Amply"}
              </h3>

              {isIOS ? (
                <div className="space-y-2">
                  <p className="amply-text-body text-amply-black/70 text-sm">Para instalar esta app:</p>
                  <div className="flex items-center space-x-2 text-sm text-amply-black/80">
                    <span>1. Toca</span>
                    <Share className="w-4 h-4 text-amply-orange" />
                    <span>en la barra inferior</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-amply-black/80">
                    <span>2. Selecciona</span>
                    <Plus className="w-4 h-4 text-amply-orange" />
                    <span>"Añadir a pantalla de inicio"</span>
                  </div>
                </div>
              ) : (
                <p className="amply-text-body text-amply-black/70 text-sm mb-3">
                  Instala la app para una experiencia completa sin navegador
                </p>
              )}

              <div className="flex space-x-2 mt-3">
                {!isIOS && canInstall && (
                  <Button onClick={handleInstallClick} className="amply-button-primary px-4 py-2 text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Instalar
                  </Button>
                )}

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="text-amply-black/60 hover:text-amply-black px-4 py-2 text-sm"
                >
                  {isIOS ? "Entendido" : "Ahora no"}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-amply-black/60 hover:text-amply-black p-1 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}