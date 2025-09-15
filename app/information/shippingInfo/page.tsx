'use client'

import { 
  Truck, 
  Clock, 
  Globe, 
  Shield,
  ChevronDown,
  Package,
  Zap,
  MapPin,
  Calendar
} from 'lucide-react'
import PremiumFooter from '@/components/Footer'

interface ShippingOption {
  name: string
  time: string
  price: string
  description: string
  icon: React.ReactNode
}

const domesticOptions: ShippingOption[] = [
  {
    name: 'Standard Shipping',
    time: '5-7 Business Days',
    price: 'Free on orders $75+',
    description: 'Reliable delivery with tracking included',
    icon: <Truck className="w-6 h-6" />
  },
  {
    name: 'Express Shipping',
    time: '2-3 Business Days',
    price: '$12.99',
    description: 'Faster delivery for urgent orders',
    icon: <Zap className="w-6 h-6" />
  },
  {
    name: 'Next Day Delivery',
    time: '1 Business Day',
    price: '$24.99',
    description: 'Get your order by the next business day',
    icon: <Calendar className="w-6 h-6" />
  }
]

const internationalOptions: ShippingOption[] = [
  {
    name: 'International Standard',
    time: '7-14 Business Days',
    price: '$19.99',
    description: 'Affordable international shipping with tracking',
    icon: <Globe className="w-6 h-6" />
  },
  {
    name: 'International Express',
    time: '3-5 Business Days',
    price: '$39.99',
    description: 'Expedited international delivery',
    icon: <Zap className="w-6 h-6" />
  }
]

export default function ShippingPage() {
  return (
    // CHANGE 1: Main container fills the viewport and hides overflow.
    <div className="absolute inset-0 bg-black text-white overflow-hidden">
      {/* CHANGE 2: New inner container handles the scrolling. */}
      <div className="h-full w-full overflow-y-auto">
        {/* Hero Section */}
        {/* CHANGE 3: Hero is now sticky, full-height, and in the background. */}
        <section className="h-screen flex items-center justify-center overflow-hidden sticky top-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat opacity-20"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Package className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Shipping
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              Fast, secure, and sustainable delivery to your doorstep worldwide
            </p>
            
            {/* CHANGE 4: Changed `bottom-12` to `bottom-8` to move the arrow lower. */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </section>

        {/* CHANGE 5: Wrapper for all scrollable content. Sits on top of the hero. */}
        <div className="relative z-10 bg-black">
          

          {/* Shipping Information */}
          <section className="py-20 bg-gradient-to-br from-black via-zinc-900 to-black">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Shipping Information
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Everything you need to know about our shipping process
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-semibold text-white">Processing Time</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Orders are processed within 1-2 business days. You'll receive a confirmation email 
                      with tracking information once your order ships.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-semibold text-white">Package Protection</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      All orders are fully insured and trackable. We're not responsible for packages 
                      marked as delivered by the carrier.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Package className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-semibold text-white">Packaging</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      We use sustainable packaging materials. Your order will arrive in eco-friendly 
                      mailers made from recycled materials.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Truck className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-semibold text-white">Tracking</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Track your package in real-time with the tracking number provided in your 
                      shipping confirmation email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-gradient-to-t from-zinc-900 via-black to-zinc-900">
            <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Shipping FAQ
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Can I change my shipping address?</h3>
                  <p className="text-gray-300 text-sm">You can change your shipping address within 2 hours of placing your order by contacting customer service.</p>
                </div>
                
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Do you ship to P.O. boxes?</h3>
                  <p className="text-gray-300 text-sm">Yes, we ship to P.O. boxes within the United States using USPS for standard and express shipping.</p>
                </div>
                
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What if my package is lost?</h3>
                  <p className="text-gray-300 text-sm">If your package is marked as delivered but you haven't received it, contact us within 7 days and we'll investigate.</p>
                </div>
                
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Do you offer expedited processing?</h3>
                  <p className="text-gray-300 text-sm">Contact customer service for rush processing options. Additional fees may apply for same-day processing.</p>
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