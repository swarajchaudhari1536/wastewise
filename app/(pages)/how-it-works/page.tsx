import React from "react";
import {
  Database,
  Server,
  LayoutDashboard,
  Bell,
  ArrowRight,
  Trash2,
  Cpu,
  BarChart,
  Recycle,
  Truck,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Trash2,
      title: "Waste Data Collection",
      description:
        "Smart bins equipped with sensors collect real-time data on fill levels, waste type, and location. In this demo, data is simulated through the backend.",
      color: "emerald",
    },
    {
      icon: Server,
      title: "Backend Processing",
      description:
        "Our Node.js backend receives data, validates it, and processes it for storage. Automatic alerts are generated when thresholds are exceeded.",
      color: "blue",
    },
    {
      icon: Database,
      title: "Database Storage",
      description:
        "MongoDB stores all waste data, bin information, alerts, and historical records for comprehensive analytics and reporting.",
      color: "purple",
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Visualization",
      description:
        "React-powered dashboards display real-time statistics, charts, maps, and alerts for administrators to monitor and manage.",
      color: "amber",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Automatic notifications are sent when bins reach capacity, enabling proactive waste collection and preventing overflow.",
      color: "red",
    },
    {
      icon: Truck,
      title: "Optimized Collection",
      description:
        "Data-driven insights help optimize collection routes, reducing costs and environmental impact.",
      color: "teal",
    },
  ];

  const techStack = [
    { name: "React.js", category: "Frontend", description: "Modern UI library for building interactive interfaces" },
    { name: "Next.js", category: "Framework", description: "Full-stack React framework with API routes" },
    { name: "Tailwind CSS", category: "Styling", description: "Utility-first CSS framework for rapid styling" },
    { name: "Node.js", category: "Runtime", description: "JavaScript runtime for server-side execution" },
    { name: "MongoDB", category: "Database", description: "NoSQL database for flexible data storage" },
    { name: "JWT", category: "Auth", description: "Secure token-based authentication" },
    { name: "Recharts", category: "Charts", description: "Composable charting library for React" },
    { name: "Leaflet", category: "Maps", description: "Interactive mapping library" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl text-blue-100">
              Discover the technology and processes behind our intelligent 
              waste monitoring and recycling system.
            </p>
          </div>
        </div>
      </section>

      {/* System Flow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              System Architecture Flow
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From data collection to actionable insights, here&apos;s how our 
              system processes and manages waste information.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-16 py-8">
            {[
              { icon: Trash2, label: "Waste Data" },
              { icon: Server, label: "Backend" },
              { icon: Database, label: "Database" },
              { icon: LayoutDashboard, label: "Dashboard" },
              { icon: Bell, label: "Alerts" },
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <item.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                {index < 4 && (
                  <ArrowRight className="h-6 w-6 text-gray-300 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Detailed Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 bg-${step.color}-100 rounded-xl flex items-center justify-center`}>
                    <step.icon className={`h-6 w-6 text-${step.color}-600`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-400">
                    STEP {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern, scalable technologies for reliability and performance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:bg-emerald-50 transition-colors"
              >
                <span className="text-xs font-semibold text-emerald-600 uppercase">
                  {tech.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-1">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Simulation */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-400 font-semibold mb-2 block">
                DATA SIMULATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Realistic Data Without Physical Hardware
              </h2>
              <p className="text-gray-300 mb-6">
                This system simulates real IoT sensor data through backend APIs. 
                You can manually update bin fill levels or run automated simulations 
                that mimic real-world waste accumulation patterns.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Cpu className="h-6 w-6 text-emerald-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Simulated Sensors</h4>
                    <p className="text-gray-400 text-sm">
                      API endpoints simulate fill-level updates as if receiving 
                      real IoT sensor data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart className="h-6 w-6 text-blue-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Realistic Patterns</h4>
                    <p className="text-gray-400 text-sm">
                      Simulation includes random variations to mimic real-world 
                      waste generation patterns.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Recycle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">Full System Test</h4>
                    <p className="text-gray-400 text-sm">
                      Test all features including alerts, analytics, and 
                      dashboard updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="font-mono text-sm">
                <div className="text-gray-400 mb-2">// Simulation API</div>
                <div className="text-emerald-400">POST</div>
                <div className="text-white">/api/bins/simulate</div>
                <div className="mt-4 text-gray-400">// Request body</div>
                <div className="text-amber-300">{"{"}</div>
                <div className="pl-4">
                  <span className="text-blue-300">&quot;mode&quot;</span>
                  <span className="text-white">: </span>
                  <span className="text-green-300">&quot;random&quot;</span>
                </div>
                <div className="text-amber-300">{"}"}</div>
                <div className="mt-4 text-gray-400">// Modes: random, increase, reset</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}