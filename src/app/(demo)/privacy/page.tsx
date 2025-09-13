import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  Globe,
  Mail,
  AlertCircle,
} from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6" variant="outline">
            <Shield className="w-3 h-3 mr-1" />
            Privacy Policy
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              privacy matters
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We&apos;re committed to protecting your personal information and
            being transparent about how we collect, use, and share your data.
          </p>

          <div className="bg-white rounded-lg p-4 inline-flex items-center shadow-sm">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">
              Last updated: <strong>{lastUpdated}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Privacy at a Glance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here&apos;s what you need to know about how we handle your data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: "Data Collection",
                description:
                  "We only collect data necessary to provide our services and improve your experience.",
              },
              {
                icon: Lock,
                title: "Data Security",
                description:
                  "Your data is encrypted in transit and at rest using industry-standard security measures.",
              },
              {
                icon: Eye,
                title: "No Selling",
                description:
                  "We never sell your personal data to third parties. Your information stays with us.",
              },
              {
                icon: Users,
                title: "Your Control",
                description:
                  "You can access, update, or delete your personal information at any time.",
              },
              {
                icon: Globe,
                title: "Global Compliance",
                description:
                  "We comply with GDPR, CCPA, and other privacy regulations worldwide.",
              },
              {
                icon: Mail,
                title: "Contact Us",
                description:
                  "Questions about privacy? Our team is here to help at privacy@myapp.com.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  MyApp (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                  committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your
                  information when you visit our website or use our services.
                  Please read this Privacy Policy carefully. If you do not agree
                  with the terms of this Privacy Policy, please do not access
                  the site or use our services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to make changes to this Privacy Policy at
                  any time and for any reason. We will alert you about any
                  changes by updating the &quot;Last updated&quot; date of this
                  Privacy Policy.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Personal Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may collect personal information that you voluntarily
                    provide to us when you:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Register for an account
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Subscribe to our newsletter or marketing communications
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Contact us with inquiries or feedback
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Participate in surveys or promotions
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Automatically Collected Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may automatically collect certain information about your
                    device and usage of our services, including:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      IP address and geographic location
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Browser and device information
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Usage patterns and preferences
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Cookies and tracking technologies
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Provide, maintain, and improve our services",
                  "Process transactions and send related information",
                  "Send administrative information and updates",
                  "Respond to your comments and questions",
                  "Personalize your experience on our platform",
                  "Analyze usage patterns to improve our services",
                  "Detect and prevent fraud or security issues",
                  "Comply with legal obligations",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                circumstances:
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "With service providers who assist us in operating our business",
                  "When required by law or to protect our rights",
                  "In connection with a business transfer or acquisition",
                  "With your explicit consent",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul className="mt-3 space-y-2 text-gray-700">
                {[
                  "Encryption of data in transit and at rest",
                  "Regular security audits and assessments",
                  "Access controls and authentication measures",
                  "Employee training on data protection",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Access and receive a copy of your personal information",
                  "Rectify or update your personal information",
                  "Delete your personal information",
                  "Restrict or object to the processing of your information",
                  "Data portability (receive your data in a structured format)",
                  "Withdraw consent where processing is based on consent",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at
                privacy@myapp.com.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <p className="font-semibold text-gray-900">
                  MyApp Privacy Team
                </p>
                <p className="text-gray-700">Email: privacy@myapp.com</p>
                <p className="text-gray-700">
                  Address: 123 Innovation Drive, San Francisco, CA 94107
                </p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
