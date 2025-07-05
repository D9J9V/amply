"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, CheckCircle, XCircle, AlertCircle, Download, EyeOff } from "lucide-react"

export default function PWADebug() {
  const [isVisible, setIsVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({})
  const [manifestData, setManifestData] = useState<Record<string, unknown> | null>(null)
  const [swStatus, setSWStatus] = useState<string>("unknown")

  useEffect(() => {
    const checkPWAStatus = async () => {
      const info = {
        isStandalone: window.matchMedia("(display-mode: standalone)").matches,
        hasServiceWorker: "serviceWorker" in navigator,
        isSecure: location.protocol === "https:" || location.hostname === "localhost",
        userAgent: navigator.userAgent,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
        hasBeforeInstallPrompt: !!window.deferredPrompt,
        displayMode: window.matchMedia("(display-mode: standalone)").matches ? "standalone" : "browser",
      }

      setDebugInfo(info)

      // Check manifest
      try {
        const manifestResponse = await fetch("/manifest.json")
        const manifest = await manifestResponse.json()
        setManifestData(manifest)
      } catch (error) {
        console.error("Manifest error:", error)
      }

      // Check service worker
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        if (registration) {
          setSWStatus(registration.active ? "active" : "installing")
        } else {
          setSWStatus("not-registered")
        }
      }
    }

    checkPWAStatus()

    // Listen for PWA events
    const handleBeforeInstallPrompt = () => {
      setDebugInfo((prev) => ({ ...prev, hasBeforeInstallPrompt: true }))
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />
  }

  const installPWA = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt()
      const { outcome } = await window.deferredPrompt.userChoice
      console.log("Install outcome:", outcome)
    }
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3"
        size="sm"
      >
        <Smartphone className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-4 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            PWA Debug Info
          </CardTitle>
          <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
            <EyeOff className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* PWA Status */}
          <div>
            <h3 className="font-semibold mb-3">PWA Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Standalone Mode</span>
                {getStatusIcon(debugInfo.isStandalone as boolean)}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Service Worker</span>
                {getStatusIcon(debugInfo.hasServiceWorker as boolean)}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">HTTPS/Secure</span>
                {getStatusIcon(debugInfo.isSecure as boolean)}
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">Install Prompt</span>
                {getStatusIcon(debugInfo.hasBeforeInstallPrompt as boolean)}
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div>
            <h3 className="font-semibold mb-3">Device Info</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={debugInfo.isIOS ? "default" : "secondary"}>iOS: {debugInfo.isIOS ? "Yes" : "No"}</Badge>
                <Badge variant={debugInfo.isAndroid ? "default" : "secondary"}>
                  Android: {debugInfo.isAndroid ? "Yes" : "No"}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 break-all">User Agent: {debugInfo.userAgent as string}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Service Worker</h3>
            <Badge variant={swStatus === "active" ? "default" : "destructive"} className="mb-2">
              Status: {swStatus}
            </Badge>
          </div>

          {manifestData && (
            <div>
              <h3 className="font-semibold mb-3">Manifest</h3>
              <div className="bg-gray-50 p-3 rounded text-xs">
                <p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <strong>Name:</strong> {(manifestData as any).name}
                </p>
                <p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <strong>Short Name:</strong> {(manifestData as any).short_name}
                </p>
                <p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <strong>Start URL:</strong> {(manifestData as any).start_url}
                </p>
                <p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <strong>Display:</strong> {(manifestData as any).display}
                </p>
                <p>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <strong>Icons:</strong> {(manifestData as any).icons?.length || 0} found
                </p>
              </div>
            </div>
          )}

          {/* Install Button */}
          {debugInfo.hasBeforeInstallPrompt && (
            <div>
              <h3 className="font-semibold mb-3">Actions</h3>
              <Button onClick={installPWA} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Trigger Install Prompt
              </Button>
            </div>
          )}

          {/* Troubleshooting */}
          <div>
            <h3 className="font-semibold mb-3">Troubleshooting</h3>
            <div className="space-y-2 text-sm">
              {!debugInfo.isSecure && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  App must be served over HTTPS
                </div>
              )}
              {!debugInfo.hasServiceWorker && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Service Worker not supported
                </div>
              )}
              {!manifestData && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Manifest.json not found
                </div>
              )}
              {debugInfo.isIOS && (
                <div className="flex items-center gap-2 text-blue-600">
                  <AlertCircle className="w-4 h-4" />
                  iOS: Use Safari Share → Add to Home Screen
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}