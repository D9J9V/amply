"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Globe, Shield, Users, Zap, CheckCircle } from "lucide-react"

interface WorldIdOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: () => void
  onSkip: () => void
}

export default function WorldIdOnboardingModal({ isOpen, onClose, onConnect, onSkip }: WorldIdOnboardingModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  if (!isOpen) return null

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    onConnect()
    onClose()
  }

  const handleSkip = () => {
    onSkip()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-y-auto bg-amply-white rounded-3xl sm:rounded-4xl shadow-amply-xl border border-gray-100 mx-4">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-colors touch-target"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-2">
            {/* Logo */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-amply-gradient-soft rounded-3xl sm:rounded-4xl flex items-center justify-center mb-4 sm:mb-6 shadow-amply">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D098F147-8781-4E47-9FB3-871FA7FD1553.PNG-qO8xf6BHvA7ldsKb1h9esV5l748Xuc.png"
                  alt="Amply Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amply-black mb-2">Welcome to AMPLY</h2>
              <p className="text-gray-600 text-sm sm:text-base">The future of music is human</p>
            </div>

            {/* World ID Section */}
            <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-amply-black mb-2">Verify Your Humanity</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-2">
                  Connect with World ID to prove you're human and unlock exclusive features in our community of verified
                  creators and listeners.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-amply-black text-sm sm:text-base lg:text-lg">What you'll get:</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amply-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-amply-orange" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">Human-verified badge on your profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amply-pink/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-amply-pink" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">Access to human-only communities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amply-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-amply-orange" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">Priority access to exclusive drops</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amply-pink/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-amply-pink" />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base">Enhanced trust and credibility</span>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                <strong>Privacy First:</strong> World ID uses zero-knowledge proofs to verify your humanity without
                revealing any personal information. Your privacy is completely protected.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full amply-button-primary py-3 sm:py-4 text-sm sm:text-base lg:text-lg rounded-2xl sm:rounded-3xl touch-target"
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Connect with World ID</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={handleSkip}
                variant="ghost"
                className="w-full text-gray-600 hover:text-amply-black hover:bg-gray-50 py-2 sm:py-3 text-sm sm:text-base rounded-2xl sm:rounded-3xl touch-target"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}