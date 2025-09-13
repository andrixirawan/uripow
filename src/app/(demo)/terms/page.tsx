import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  FileText,
  AlertTriangle,
  Shield,
  Users,
  Globe,
  Clock,
} from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 1, 2024";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6" variant="outline">
            <Scale className="w-3 h-3 mr-1" />
            Terms of Service
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Service
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            These terms govern your use of MyApp and its services. By using our
            platform, you agree to these terms and conditions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center shadow-sm">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">
                Last updated: <strong>{lastUpdated}</strong>
              </span>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-center shadow-sm">
              <FileText className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">
                Effective: <strong>{effectiveDate}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Points
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are the most important things you should know about our
              terms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Account Responsibility",
                description:
                  "You're responsible for maintaining the security of your account and all activities.",
              },
              {
                icon: Shield,
                title: "Acceptable Use",
                description:
                  "Use our services responsibly and in compliance with all applicable laws.",
              },
              {
                icon: Globe,
                title: "Service Availability",
                description:
                  "We strive for 99.9% uptime but cannot guarantee uninterrupted service.",
              },
              {
                icon: AlertTriangle,
                title: "Content Guidelines",
                description:
                  "You retain ownership of your content but grant us necessary licenses to operate.",
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

      {/* Detailed Terms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Acceptance of Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using MyApp (&quot;Service&quot;), you agree
                  to be bound by these Terms of Service (&quot;Terms&quot;). If
                  you disagree with any part of these terms, then you may not
                  access the Service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms apply to all visitors, users, and others who
                  access or use the Service. By using our Service, you represent
                  that you are at least 18 years old or have the consent of a
                  parent or guardian.
                </p>
              </div>
            </div>

            {/* Account Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Account Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Account Creation
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {[
                      "You must provide accurate and complete information when creating an account",
                      "You are responsible for maintaining the security of your account credentials",
                      "You must be a human - accounts created by bots or automated methods are prohibited",
                      "One person or legal entity may maintain no more than one free account",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Account Responsibilities
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {[
                      "You are responsible for all activity that occurs under your account",
                      "You must notify us immediately of any unauthorized use of your account",
                      "You may not use your account for any illegal or unauthorized purpose",
                      "You must not transmit any worms, viruses, or destructive code",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Acceptable Use */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Acceptable Use Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Service for any of the following
                prohibited activities:
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Violating any applicable laws or regulations",
                  "Infringing on intellectual property rights",
                  "Transmitting spam, harassment, or abusive content",
                  "Attempting to gain unauthorized access to other accounts",
                  "Interfering with or disrupting the Service",
                  "Creating false identities or impersonating others",
                  "Collecting or harvesting personal information from other users",
                  "Using the Service for any commercial purpose without permission",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Availability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Service Availability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to provide reliable service but cannot guarantee
                perfect availability:
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "We aim for 99.9% uptime but may experience occasional downtime",
                  "Scheduled maintenance will be announced in advance when possible",
                  "We may modify or discontinue features with reasonable notice",
                  "Service interruptions may occur due to circumstances beyond our control",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Intellectual Property Rights
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Your Content
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You retain ownership of any intellectual property rights
                    that you hold in content that you submit to our Service. By
                    submitting content, you grant us a worldwide, royalty-free
                    license to use, reproduce, and distribute your content as
                    necessary to provide the Service.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Our Content
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Service and its original content, features, and
                    functionality are owned by MyApp and are protected by
                    international copyright, trademark, and other intellectual
                    property laws.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Payment Terms
              </h2>
              <ul className="space-y-2 text-gray-700">
                {[
                  "Paid services are billed in advance on a monthly or annual basis",
                  "All fees are non-refundable except as required by law",
                  "Prices may change with 30 days notice to existing customers",
                  "Failure to pay fees may result in service suspension or termination",
                  "You are responsible for all taxes associated with your use of the Service",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Either party may terminate this agreement:
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  "You may delete your account at any time through account settings",
                  "We may suspend or terminate accounts that violate these Terms",
                  "We may terminate accounts with reasonable notice for business reasons",
                  "Upon termination, your right to use the Service ceases immediately",
                  "We will make reasonable efforts to return your data upon request",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, MyApp shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses resulting from your use of
                the Service.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. If we
                make material changes, we will notify you by email or through
                the Service at least 30 days before the changes take effect.
                Your continued use of the Service after such modifications
                constitute your acceptance of the updated Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <p className="font-semibold text-gray-900">MyApp Legal Team</p>
                <p className="text-gray-700">Email: legal@myapp.com</p>
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
