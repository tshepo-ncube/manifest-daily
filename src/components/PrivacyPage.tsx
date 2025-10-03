import {
  Sparkles,
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  AlertCircle,
} from "lucide-react";

interface PrivacyPageProps {
  onBack: () => void;
}

export default function PrivacyPage({ onBack }: PrivacyPageProps) {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, use our manifestation services, or contact us for support. This includes your email address, name, manifestation goals, daily entries, and any other information you choose to provide. We also automatically collect certain information about your use of our Service, including your device's IP address, browser type, pages visited, and time spent on our platform.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to provide, maintain, and improve our manifestation services, process your subscription payments, communicate with you about your account and our services, send you important updates and notifications, provide customer support, analyze usage patterns to improve our platform, and ensure the security and integrity of our Service.`,
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our platform, conducting our business, or serving our users, as long as they agree to keep this information confidential. We may also disclose your information when required by law or to protect our rights, property, or safety.`,
    },
    {
      title: "4. Data Security",
      content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest, secure authentication systems, regular security audits, and access controls. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      title: "5. Cookies and Tracking Technologies",
      content: `We use cookies and similar tracking technologies to enhance your experience on our platform. These technologies help us remember your preferences, analyze how you use our Service, and improve our functionality. You can control cookie settings through your browser, but disabling cookies may affect some features of our Service.`,
    },
    {
      title: "6. Data Retention",
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We will delete or anonymize your personal information when it is no longer needed, unless we are required to retain it for legal, regulatory, or legitimate business purposes.`,
    },
    {
      title: "7. Your Rights and Choices",
      content: `You have the right to access, update, or delete your personal information. You can manage most of your information directly through your account settings. You may also contact us to request access to, correction of, or deletion of your personal information. You can opt out of marketing communications at any time by following the unsubscribe instructions in our emails.`,
    },
    {
      title: "8. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your personal information during international transfers.`,
    },
    {
      title: "9. Children's Privacy",
      content: `Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information from our servers.`,
    },
    {
      title: "10. Third-Party Services",
      content: `Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of any third-party services you access through our platform.`,
    },
    {
      title: "11. Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of our Service after such changes constitutes acceptance of the updated Privacy Policy.`,
    },
    {
      title: "12. Contact Us",
      content: `If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@manifestdaily.com or through our support system within the application. We are committed to addressing your privacy concerns promptly and transparently.`,
    },
  ];

  const keyPoints = [
    {
      icon: Shield,
      title: "Data Protection",
      description:
        "Your manifestation data is encrypted and never shared without consent",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description:
        "Enterprise-grade security measures protect your personal information",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "Clear policies on how we collect, use, and protect your data",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Database,
      title: "Data Control",
      description:
        "You have full control over your personal information and can delete it anytime",
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
                Privacy
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Policy
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
                  Your privacy is our priority. This policy explains how we
                  collect, use, and protect your personal information when you
                  use Manifest Daily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-fade-in">
              Our Privacy Commitments
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

        {/* Privacy Policy Content */}
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
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 border border-blue-400/30">
              <div className="flex items-start">
                <AlertCircle className="w-8 h-8 text-blue-400 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-blue-200 mb-4">
                    Your Privacy Matters
                  </h3>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    We are committed to protecting your privacy and being
                    transparent about our data practices. Your manifestation
                    journey is personal, and we respect the confidentiality of
                    your goals, progress, and reflections.
                  </p>
                  <p className="text-gray-200 leading-relaxed">
                    If you have any questions or concerns about how we handle
                    your personal information, please don't hesitate to contact
                    us. We're here to help and ensure your privacy is protected.
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
                Questions About Privacy?
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                We're committed to transparency and are here to address any
                privacy concerns you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
                  Contact Privacy Team
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
