import {
  Sparkles,
  ArrowLeft,
  Shield,
  FileText,
  Users,
  Lock,
  AlertCircle,
} from "lucide-react";

interface TermsPageProps {
  onBack: () => void;
}

export default function TermsPage({ onBack }: TermsPageProps) {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Manifest Daily ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      title: "2. Description of Service",
      content: `Manifest Daily is a digital platform that provides users with tools and resources for personal development, goal setting, and manifestation practices. The service includes but is not limited to: daily manifestation exercises, progress tracking, community features, and educational content.`,
    },
    {
      title: "3. User Accounts",
      content: `To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`,
    },
    {
      title: "4. User Conduct",
      content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to: (a) use the Service in any way that violates any applicable federal, state, local, or international law or regulation; (b) transmit any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable; (c) impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.`,
    },
    {
      title: "5. Privacy and Data Protection",
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy. We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.`,
    },
    {
      title: "6. Intellectual Property Rights",
      content: `The Service and its original content, features, and functionality are and will remain the exclusive property of Manifest Daily and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.`,
    },
    {
      title: "7. Subscription and Payment Terms",
      content: `Some features of the Service are provided on a subscription basis. Subscription fees are billed in advance on a monthly or annual basis and are non-refundable except as required by law. You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period.`,
    },
    {
      title: "8. Disclaimers and Limitations of Liability",
      content: `THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.`,
    },
    {
      title: "9. Indemnification",
      content: `You agree to defend, indemnify, and hold harmless Manifest Daily and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).`,
    },
    {
      title: "10. Termination",
      content: `We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Service.`,
    },
    {
      title: "11. Governing Law",
      content: `These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.`,
    },
    {
      title: "12. Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.`,
    },
    {
      title: "13. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at legal@manifestdaily.com or through our support system within the application.`,
    },
  ];

  const keyPoints = [
    {
      icon: Shield,
      title: "Data Protection",
      description:
        "Your personal manifestation data is encrypted and never shared with third parties",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Users,
      title: "Community Guidelines",
      description:
        "Respectful interaction and positive support for all community members",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: Lock,
      title: "Account Security",
      description:
        "Strong authentication and secure storage of your account information",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: FileText,
      title: "Transparent Terms",
      description:
        "Clear, understandable terms with no hidden fees or conditions",
      color: "from-orange-400 to-red-400",
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
                Terms of
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Service
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto">
                <p className="text-lg text-gray-200">
                  Welcome to Manifest Daily! These terms govern your use of our
                  manifestation platform. We're committed to transparency and
                  protecting your rights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-fade-in">
              Your Rights & Our Commitments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-slide-up text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${point.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <point.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{point.title}</h4>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12">
              <div className="space-y-8">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-start">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
                        {index + 1}
                      </span>
                      {section.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed ml-11">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-yellow-400/30">
              <div className="flex items-start">
                <AlertCircle className="w-8 h-8 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-200 mb-4">
                    Important Notice
                  </h3>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Manifest Daily is a personal development tool designed to
                    support your growth journey. While our methods are based on
                    established psychological and manifestation principles,
                    individual results may vary. We encourage you to use our
                    platform as a supplement to, not a replacement for,
                    professional guidance when needed.
                  </p>
                  <p className="text-gray-200 leading-relaxed">
                    If you have any questions about these terms or need
                    clarification on any point, please don't hesitate to contact
                    our support team. We're here to help!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 sm:p-12 animate-fade-in">
              <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                Questions About These Terms?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                We're committed to transparency and are here to help clarify any
                questions you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
                  Contact Support
                </button>
                <button
                  onClick={onBack}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 border border-white/30"
                >
                  Back to App
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
