import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Users,
  Target,
  Award,
  Heart,
  Rocket,
  Globe2,
  Shield,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Former Google VP with 15+ years in tech. Passionate about building products that make a difference.",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b72a2ef8?w=300&h=300&fit=crop&crop=face",
      bio: "Ex-Microsoft architect. Expert in scalable systems and AI. PhD in Computer Science from MIT.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Award-winning designer with 10+ years at Apple and Spotify. Obsessed with user experience.",
    },
    {
      name: "Emily Thompson",
      role: "VP of Engineering",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Full-stack expert and former Netflix engineer. Leads our world-class engineering team.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Every decision we make starts with our customers. Their success is our success.",
      color: "text-red-500",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "We protect our users data with enterprise-grade security and complete transparency.",
      color: "text-green-500",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We constantly push boundaries to deliver cutting-edge solutions that work.",
      color: "text-yellow-500",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Great things happen when diverse minds work together toward a common goal.",
      color: "text-blue-500",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to revolutionize collaboration",
    },
    {
      year: "2021",
      title: "First 1K Users",
      description: "Reached our first thousand happy customers",
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Raised $10M to accelerate growth and development",
    },
    {
      year: "2023",
      title: "50K+ Users",
      description: "Scaled to serve customers in over 100 countries",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched advanced AI features to boost productivity",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6" variant="outline">
            <Award className="w-3 h-3 mr-1" />
            About MyApp
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Building the future of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              collaboration
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We&apos;re on a mission to empower teams worldwide with tools that
            make collaboration seamless, productive, and enjoyable. Founded in
            2020, we&apos;ve grown from a small startup to serving thousands of
            companies globally.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                180+
              </div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                To democratize collaboration by providing powerful, intuitive
                tools that enable teams of all sizes to work together
                effectively, regardless of location or time zone.
              </p>

              <div className="flex items-center mb-4">
                <Rocket className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600">
                A world where distance and time differences never limit human
                potential. Where every team can achieve their best work through
                seamless, secure, and intelligent collaboration tools.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white">
              <Globe2 className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-3">Global Impact</h3>
              <p className="mb-4">
                Our platform has enabled over 1 million successful
                collaborations across 6 continents, helping teams save over 10
                million hours of productivity time.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold">1M+</div>
                  <div className="opacity-80">Projects Completed</div>
                </div>
                <div>
                  <div className="font-semibold">10M+</div>
                  <div className="opacity-80">Hours Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every product we
              build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <value.icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re a diverse group of builders, dreamers, and
              problem-solvers united by our passion for creating exceptional
              experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones that shaped our path to where we are today.
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-24 text-right mr-8">
                  <div className="text-2xl font-bold text-blue-600">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-blue-600 rounded-full mt-2 mr-8"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want to be part of our story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We&apos;re always looking for talented individuals to join our
            mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
