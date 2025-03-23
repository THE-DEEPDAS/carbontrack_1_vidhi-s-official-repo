import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, Wind, Droplets, LineChart } from 'lucide-react';
import React from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '97%', label: 'Accuracy Rate', trend: '+7%' },
    { value: '80%', label: 'User Engagement', trend: '+5%' },
    { value: '65%', label: 'Carbon Reduction', trend: '+25%' }
  ];

  const features = [
    { icon: <Leaf className="w-8 h-8 text-emerald-500" />, title: 'Carbon Tracking', description: 'Real-time monitoring of your carbon footprint' },
    { icon: <Wind className="w-8 h-8 text-emerald-500" />, title: 'Eco Analytics', description: 'Advanced insights into your environmental impact' },
    { icon: <Droplets className="w-8 h-8 text-emerald-500" />, title: 'Resource Management', description: 'Optimize your resource consumption' },
    { icon: <LineChart className="w-8 h-8 text-emerald-500" />, title: 'Progress Tracking', description: 'Monitor your sustainability journey' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-emerald-500" />
              <span className="text-xl font-bold text-gray-900">CarbonTrack</span>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-emerald-600 hover:text-emerald-700"
                onClick={() => navigate('/login')}
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Track Your Impact on the Planet
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of environmentally conscious individuals and businesses in monitoring and reducing their carbon footprint.
              </p>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  onClick={() => navigate('/signup')}
                >
                  Start Tracking
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors"
                  onClick={() => navigate('/demo')}
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Sustainable Future"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-emerald-500 text-sm">{stat.trend}</span>
                </div>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Carbon Management
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to understand and reduce your environmental impact
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="w-6 h-6 text-emerald-500" />
                <span className="text-lg font-bold">CarbonTrack</span>
              </div>
              <p className="text-gray-400">
                Making carbon tracking accessible and actionable for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 CarbonTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;