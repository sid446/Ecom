'use client'

import { useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  ChevronDown
} from 'lucide-react'
import PremiumFooter from '@/components/Footer'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  return (
    // CHANGE 1: Restored `absolute inset-0` and added `overflow-hidden`. This container now fills the viewport but does not scroll.
    <div className="absolute inset-0 bg-black text-white overflow-hidden scrollbar-hide">
        
      {/* CHANGE 2: Added a new inner container that will handle all the scrolling. */}
      <div className="h-full w-full overflow-y-auto">
        {/* Hero Section */}
        {/* This section is sticky relative to its scrolling parent (the div above). */}
        <section className="h-screen flex items-center justify-center overflow-hidden sticky top-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black">

            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80')] bg-cover bg-center bg-no-repeat opacity-20"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Contact Us
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you. Get in touch with our team for any questions, 
              support, or collaboration opportunities.
            </p>
            
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </section>

        {/* This wrapper holds the content that scrolls OVER the sticky hero section. */}
        <div className="relative z-10 bg-black">
          {/* Contact Information */}
          <section className="py-20 bg-gradient-to-br from-black via-zinc-900 to-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="space-y-12">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                      Get In Touch
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed mb-12">
                      Ready to connect? We're here to help with any questions about our products, 
                      orders, or just to chat about sustainable fashion.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Phone */}
                    <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                        <p className="text-gray-300 mb-1">+1 (555) 123-4567</p>
                        <p className="text-sm text-gray-400">Mon-Fri, 9 AM - 6 PM EST</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                        <p className="text-gray-300 mb-1">hello@yourbrand.com</p>
                        <p className="text-sm text-gray-400">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Address</h3>
                        <p className="text-gray-300 mb-1">123 Fashion Street</p>
                        <p className="text-gray-300 mb-1">New York, NY 10001</p>
                        <p className="text-sm text-gray-400">Visit our showroom by appointment</p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Business Hours</h3>
                        <p className="text-gray-300 mb-1">Monday - Friday: 9 AM - 6 PM EST</p>
                        <p className="text-gray-300 mb-1">Saturday: 10 AM - 4 PM EST</p>
                        <p className="text-gray-300">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center space-x-3 mb-8">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-bold text-white">Send us a message</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </div>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="returns">Returns & Exchanges</option>
                        <option value="wholesale">Wholesale Inquiry</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="press">Press & Media</option>
                      </select>
                    </div>

                    <div>
                      <div className="block text-sm font-medium text-gray-300 mb-2">
                        Message
                      </div>
                      <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full bg-white text-black px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-gradient-to-t from-zinc-900 via-black to-zinc-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-300 mb-12 leading-relaxed">
                Can't find what you're looking for? Check out our FAQ section or reach out directly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">How long does shipping take?</h3>
                  <p className="text-gray-300 text-sm">Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery.</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">What's your return policy?</h3>
                  <p className="text-gray-300 text-sm">We offer 30-day returns for unworn items with original tags. Free return shipping included.</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">Do you offer wholesale pricing?</h3>
                  <p className="text-gray-300 text-sm">Yes! Contact us with your business details for wholesale inquiries and volume discounts.</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-left">
                  <h3 className="text-lg font-semibold text-white mb-3">Are your products sustainable?</h3>
                  <p className="text-gray-300 text-sm">Absolutely! We use 80% recycled materials and carbon-neutral shipping for all orders.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-black border-t border-gray-800 py-12">
            <PremiumFooter/>
          </footer>
        </div>
      </div>
    </div>
  )
}