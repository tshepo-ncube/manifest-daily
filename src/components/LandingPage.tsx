import React from 'react';
import { Sparkles, Target, Heart, TrendingUp, CheckCircle, Star, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-300" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Manifest Daily
              </h1>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Transform Your Dreams Into
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Daily Reality
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Follow a proven 5-step daily manifestation process to achieve your goals with intention, gratitude, and focused action.
              </p>
            </div>

            <div className="mb-12 animate-slide-up animation-delay-500">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
              >
                Start Your Journey
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-fade-in">
              Your Daily Manifestation Process
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Set Clear Intentions",
                  description: "Start each morning by writing your goals as if they're already happening",
                  color: "from-orange-400 to-red-400"
                },
                {
                  icon: CheckCircle,
                  title: "Visualize Daily Actions",
                  description: "Plan 3 key actions that move you closer to your dreams today",
                  color: "from-blue-400 to-cyan-400"
                },
                {
                  icon: Heart,
                  title: "Practice Gratitude",
                  description: "Build positivity and resilience with daily gratitude journaling",
                  color: "from-green-400 to-emerald-400"
                },
                {
                  icon: TrendingUp,
                  title: "Reflect on Progress",
                  description: "Celebrate wins and learn from challenges every evening",
                  color: "from-purple-400 to-pink-400"
                },
                {
                  icon: Sparkles,
                  title: "Powerful Affirmations",
                  description: "Reinforce your confidence with personalized affirmations",
                  color: "from-indigo-400 to-purple-400"
                },
                {
                  icon: Star,
                  title: "Track Your Journey",
                  description: "Watch your progress unfold with beautiful visualizations",
                  color: "from-yellow-400 to-orange-400"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 animate-fade-in">
              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Manifest Your Dreams?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands who have transformed their lives through consistent daily practice. Your journey to success starts with a single step.
              </p>
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
              >
                Begin Your Transformation
                <Sparkles className="inline-block ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}