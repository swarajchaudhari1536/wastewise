import React from "react";
import {
  Target,
  Users,
  Globe,
  Award,
  TrendingUp,
  Heart,
  Lightbulb,
  Leaf,
} from "lucide-react";

export default function AboutPage() {
  const challenges = [
    "Overflowing bins causing hygiene issues",
    "Inefficient collection routes wasting fuel",
    "Low recycling rates due to poor segregation",
    "Lack of real-time monitoring capabilities",
    "Limited data for decision making",
    "Rising operational costs",
  ];

  const solutions = [
    "Smart fill-level monitoring with instant alerts",
    "Data-driven route optimization",
    "Waste type classification and tracking",
    "Real-time dashboard with analytics",
    "Comprehensive reporting and insights",
    "Cost reduction through efficiency",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About Our Mission
            </h1>
            <p className="text-xl text-emerald-100">
              We&apos;re on a mission to revolutionize urban waste management through 
              intelligent monitoring, data analytics, and sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-emerald-600 font-semibold mb-2 block">
                THE PROBLEM
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Urban Waste Crisis Demands Smart Solutions
              </h2>
              <p className="text-gray-600 mb-8">
                Cities worldwide face mounting challenges in waste management. 
                Traditional methods are inefficient, costly, and environmentally 
                harmful. The lack of real-time data leads to overflowing bins, 
                missed collections, and low recycling rates.
              </p>
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-gray-700">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-red-50 rounded-3xl p-8 lg:p-12">
              <div className="text-center">
                <div className="text-6xl font-bold text-red-500 mb-4">2.01B</div>
                <p className="text-gray-600 mb-8">
                  Tonnes of municipal solid waste generated annually worldwide
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-500">33%</div>
                    <p className="text-sm text-gray-500">Mismanaged waste</p>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-3xl font-bold text-gray-500">13%</div>
                    <p className="text-sm text-gray-500">Global recycling rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-emerald-50 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Target className="h-8 w-8 text-emerald-600 mb-3" />
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <p className="text-sm text-gray-500">Collection accuracy</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
                  <div className="text-2xl font-bold text-gray-900">40%</div>
                  <p className="text-sm text-gray-500">Cost reduction</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Leaf className="h-8 w-8 text-green-600 mb-3" />
                  <div className="text-2xl font-bold text-gray-900">50%</div>
                  <p className="text-sm text-gray-500">More recycling</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <Globe className="h-8 w-8 text-teal-600 mb-3" />
                  <div className="text-2xl font-bold text-gray-900">30%</div>
                  <p className="text-sm text-gray-500">Less emissions</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-emerald-600 font-semibold mb-2 block">
                OUR SOLUTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Intelligent Monitoring for Sustainable Cities
              </h2>
              <p className="text-gray-600 mb-8">
                Our smart waste management platform combines real-time monitoring, 
                predictive analytics, and automation to transform how cities handle 
                waste collection and recycling.
              </p>
              <div className="space-y-3">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Lightbulb className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are guided by principles that drive innovation and sustainability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sustainability First
              </h3>
              <p className="text-gray-600">
                Every decision we make prioritizes environmental impact and 
                long-term sustainability.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Innovation Driven
              </h3>
              <p className="text-gray-600">
                We continuously push boundaries with cutting-edge technology 
                and creative solutions.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Community Impact
              </h3>
              <p className="text-gray-600">
                We measure success by the positive change we bring to 
                communities and the environment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}