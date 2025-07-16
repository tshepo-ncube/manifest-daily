import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Star,
  Trophy,
  Heart,
  CheckCircle,
  X,
  Zap,
  Crown,
  Gift,
} from "lucide-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  goalTitle,
}: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSecondWave, setShowSecondWave] = useState(false);
  const [showThirdWave, setShowThirdWave] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);

      // Multiple waves of confetti for maximum dopamine
      const timer1 = setTimeout(() => setShowSecondWave(true), 800);
      const timer2 = setTimeout(() => setShowThirdWave(true), 1600);
      const timer3 = setTimeout(() => {
        setShowConfetti(false);
        setShowSecondWave(false);
        setShowThirdWave(false);
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Multiple Confetti Waves */}
      {(showConfetti || showSecondWave || showThirdWave) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* First wave - colorful confetti */}
          {showConfetti &&
            [...Array(60)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div
                  className={`w-3 h-3 ${
                    [
                      "bg-purple-400",
                      "bg-blue-400",
                      "bg-pink-400",
                      "bg-yellow-400",
                      "bg-green-400",
                      "bg-red-400",
                      "bg-orange-400",
                    ][Math.floor(Math.random() * 7)]
                  } transform rotate-45`}
                />
              </div>
            ))}
          {/* Second wave - stars */}
          {showSecondWave &&
            [...Array(30)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 1}s`,
                }}
              >
                <Star className="w-4 h-4 text-yellow-400 animate-spin" />
              </div>
            ))}
          {/* Third wave - sparkles */}
          {showThirdWave &&
            [...Array(40)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  animationDuration: `${2.5 + Math.random() * 1.5}s`,
                }}
              >
                <Sparkles
                  className={`w-3 h-3 ${
                    [
                      "text-purple-400",
                      "text-blue-400",
                      "text-pink-400",
                      "text-yellow-400",
                    ][Math.floor(Math.random() * 4)]
                  } animate-pulse`}
                />
              </div>
            ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-xs sm:max-w-md w-full mx-2 text-white shadow-2xl animate-celebration-bounce border-4 border-yellow-400 overflow-y-auto min-h-[60vh] flex flex-col gap-2 sm:gap-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-3 sm:p-2 text-white/70 hover:text-white transition-colors rounded-full bg-black/20 sm:bg-transparent"
          style={{ zIndex: 2 }}
        >
          <X className="w-7 h-7 sm:w-5 sm:h-5" />
        </button>

        <div className="text-center flex flex-col gap-2 sm:gap-4">
          {/* Trophy Icon with Glow */}
          <div className="relative mb-4 sm:mb-6 flex justify-center">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="absolute inset-2 bg-orange-400 rounded-full blur-xl opacity-40 animate-pulse animation-delay-500" />
            <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full p-3 sm:p-4 w-16 h-16 sm:w-24 sm:h-24 mx-auto flex items-center justify-center shadow-2xl border-4 border-yellow-200">
              <Trophy className="w-8 h-8 sm:w-12 sm:h-12 text-white animate-bounce" />
              <div className="absolute -top-2 -right-2">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Celebration Text */}
          <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 animate-fade-in bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
            🎉 AMAZING! 🎉
          </h2>
          <p className="text-lg sm:text-xl mb-1 sm:mb-2 font-semibold animate-slide-up">
            You're a Manifestation Master!
          </p>
          <p className="text-base sm:text-lg mb-1 sm:mb-2 opacity-90 animate-slide-up animation-delay-500">
            You've completed all 5 steps for
          </p>
          <p className="text-lg sm:text-xl font-bold mb-3 sm:mb-6 text-yellow-200 animate-slide-up animation-delay-500">
            "{goalTitle}"
          </p>

          {/* Enhanced Achievement Icons */}
          <div className="flex justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
            {[
              {
                icon: CheckCircle,
                color: "text-green-300",
                bg: "bg-green-500/20",
              },
              { icon: Star, color: "text-yellow-300", bg: "bg-yellow-500/20" },
              { icon: Heart, color: "text-pink-300", bg: "bg-pink-500/20" },
              {
                icon: Sparkles,
                color: "text-purple-300",
                bg: "bg-purple-500/20",
              },
              { icon: Zap, color: "text-blue-300", bg: "bg-blue-500/20" },
              { icon: Gift, color: "text-orange-300", bg: "bg-orange-500/20" },
            ].map(({ icon: Icon, color }, index) => (
              <div
                key={index}
                className={`${color} animate-bounce p-1 sm:p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            ))}
          </div>

          {/* Motivational Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-6 border border-white/20">
            <p className="text-sm sm:text-base leading-relaxed font-medium">
              🌟 You're unstoppable! Every step you take is manifesting your
              dreams into reality. Your consistency is your superpower! 🚀
            </p>
            <div className="mt-2 sm:mt-3 flex justify-center space-x-1 sm:space-x-2">
              <span className="text-xl sm:text-2xl animate-bounce">⚡</span>
              <span className="text-xl sm:text-2xl animate-bounce animation-delay-500">
                💫
              </span>
              <span className="text-xl sm:text-2xl animate-bounce animation-delay-1000">
                🎯
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 shadow-2xl hover:shadow-yellow-500/50 text-base sm:text-lg"
          >
            Keep Manifesting! 🌟
          </button>
        </div>
      </div>
    </div>
  );
}
