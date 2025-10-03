import {
  Sparkles,
  Check,
  ArrowLeft,
  Crown,
  Star,
  Heart,
  Target,
  TrendingUp,
  Users,
  Shield,
} from "lucide-react";

interface PricingPageProps {
  onBack: () => void;
}

export default function PricingPage({ onBack }: PricingPageProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with manifestation",
      icon: Heart,
      color: "from-green-400 to-emerald-400",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      features: [
        "5-step daily manifestation process",
        "Unlimited goals",
        "Basic progress tracking",
        "Voice notes for reflection",
        "Community support",
        "Mobile & web access",
      ],
      limitations: [
        "Basic affirmations only",
        "Limited history (30 days)",
        "Standard support",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "For serious manifestors ready to accelerate their journey",
      icon: Star,
      color: "from-purple-400 to-pink-400",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      features: [
        "Everything in Free",
        "Custom affirmations & visualization guides",
        "Unlimited history & analytics",
        "Advanced progress insights",
        "Priority support",
        "Exclusive manifestation challenges",
        "Guided meditation library",
        "Goal achievement celebrations",
      ],
      limitations: [],
      popular: true,
    },
    {
      name: "Master",
      price: "$19.99",
      period: "per month",
      description: "For manifestation masters seeking the ultimate experience",
      icon: Crown,
      color: "from-yellow-400 to-orange-400",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      features: [
        "Everything in Premium",
        "1-on-1 manifestation coaching calls",
        "Personalized manifestation plans",
        "Advanced AI insights & recommendations",
        "Exclusive mastermind community",
        "Early access to new features",
        "Custom manifestation rituals",
        "Success guarantee program",
      ],
      limitations: [],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Entrepreneur",
      content:
        "Manifest Daily transformed my life. I went from struggling to achieve my goals to manifesting my dream business in 6 months!",
      rating: 5,
    },
    {
      name: "Michael R.",
      role: "Life Coach",
      content:
        "The Premium plan's analytics helped me understand my manifestation patterns. I've never been more aligned with my purpose.",
      rating: 5,
    },
    {
      name: "Emma L.",
      role: "Artist",
      content:
        "The Master plan's coaching calls were game-changing. My manifestation coach helped me break through limiting beliefs I didn't even know I had.",
      rating: 5,
    },
  ];

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
            <button
              onClick={onBack}
              className="flex items-center text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
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
                Choose Your
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Manifestation Journey
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Start free and upgrade as you grow. Every plan is designed to
                accelerate your manifestation success.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slide-up ${
                    plan.borderColor
                  } border-2 ${
                    plan.popular ? "ring-4 ring-purple-400/50 shadow-2xl" : ""
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-300 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-300 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-200">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitationIndex) => (
                      <div key={limitationIndex} className="flex items-start">
                        <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-400">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/25"
                        : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    }`}
                  >
                    {plan.name === "Free"
                      ? "Get Started Free"
                      : `Start ${plan.name} Trial`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-fade-in">
              Why Choose Manifest Daily?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Target,
                  title: "Proven Method",
                  description: "5-step process based on manifestation science",
                  color: "from-orange-400 to-red-400",
                },
                {
                  icon: TrendingUp,
                  title: "Track Progress",
                  description: "Visualize your journey with detailed analytics",
                  color: "from-blue-400 to-cyan-400",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Connect with like-minded manifestors",
                  color: "from-green-400 to-emerald-400",
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  description: "Your data is encrypted and protected",
                  color: "from-purple-400 to-pink-400",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slide-up text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-fade-in">
              Success Stories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-200 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-fade-in">
              Frequently Asked Questions
            </h3>

            <div className="space-y-6">
              {[
                {
                  question: "Can I change my plan anytime?",
                  answer:
                    "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.",
                },
                {
                  question: "Is there a free trial?",
                  answer:
                    "The Free plan is available forever with no time limits. Premium and Master plans come with a 7-day free trial.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and Apple Pay for your convenience.",
                },
                {
                  question: "Can I get a refund?",
                  answer:
                    "We offer a 30-day money-back guarantee for all paid subscription plans (Premium and Master). If you're not satisfied within the first 30 days, contact our support team for a full refund. Refunds are processed within 5-10 business days to your original payment method.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "Absolutely. We use enterprise-grade encryption and never share your personal manifestation data with third parties.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h4 className="text-lg font-semibold text-white mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-gray-300">{faq.answer}</p>
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
                Ready to Start Manifesting?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of successful manifestors who have transformed
                their lives with our proven system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
                  Start Free Trial
                </button>
                <button
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 border border-white/30"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
