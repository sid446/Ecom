'use client'

import { useState } from 'react'
import { 
  Ruler, 
  User, 
  Shirt,
  ChevronDown,
  Info,
  Zap
} from 'lucide-react'
import PremiumFooter from '@/components/Footer'

interface SizeData {
  size: string
  chest: string
  waist: string
  length: string
  sleeve: string
}


const mensSizes: SizeData[] = [
  { size: 'XS', chest: '34-36', waist: '28-30', length: '27', sleeve: '32' },
  { size: 'S', chest: '36-38', waist: '30-32', length: '28', sleeve: '33' },
  { size: 'M', chest: '38-40', waist: '32-34', length: '29', sleeve: '34' },
  { size: 'L', chest: '40-42', waist: '34-36', length: '30', sleeve: '35' },
  { size: 'XL', chest: '42-44', waist: '36-38', length: '31', sleeve: '36' },
  { size: '2XL', chest: '44-46', waist: '38-40', length: '32', sleeve: '37' },
]

const womensSizes: SizeData[] = [
  { size: 'XS', chest: '32-34', waist: '25-27', length: '25', sleeve: '30' },
  { size: 'S', chest: '34-36', waist: '27-29', length: '26', sleeve: '31' },
  { size: 'M', chest: '36-38', waist: '29-31', length: '27', sleeve: '32' },
  { size: 'L', chest: '38-40', waist: '31-33', length: '28', sleeve: '33' },
  { size: 'XL', chest: '40-42', waist: '33-35', length: '29', sleeve: '34' },
  { size: '2XL', chest: '42-44', waist: '35-37', length: '30', sleeve: '35' },
]

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState<'mens' | 'womens'>('mens')

  const currentSizes = activeCategory === 'mens' ? mensSizes : womensSizes

  return (
    // CHANGE 1: Main container fills the viewport and hides overflow.
    <div className={`absolute inset-0 bg-black text-white overflow-hidden scrollbar-hide`}>
      {/* CHANGE 2: New inner container handles the scrolling. */}
      <div className="h-full w-full overflow-y-auto">
        {/* Hero Section */}
        {/* CHANGE 3: Hero is now sticky, full-height, and in the background. */}
        <section className="h-screen flex items-center justify-center overflow-hidden sticky top-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat opacity-20"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Ruler className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Size Guide
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              Find your perfect fit with our comprehensive sizing charts and measurement guide
            </p>
            
            {/* CHANGE 4: Arrow moved lower for better positioning. */}
            <div className="absolute left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </section>

        {/* CHANGE 5: Wrapper for all scrollable content. Sits on top of the hero. */}
        <div className="relative z-10 bg-black">
          {/* How to Measure Section */}
          <section className="py-20 bg-gradient-to-br from-black via-zinc-900 to-black">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  How to Measure
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  For the most accurate fit, measure yourself or a garment that fits you well
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Chest/Bust</h3>
                  <p className="text-sm text-gray-300">Measure around the fullest part of your chest, keeping the tape parallel to the ground</p>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Waist</h3>
                  <p className="text-sm text-gray-300">Measure around your natural waistline, which is the narrowest part of your torso</p>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Length</h3>
                  <p className="text-sm text-gray-300">Measure from the highest point of your shoulder down to where you want the garment to end</p>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">Sleeve</h3>
                  <p className="text-sm text-gray-300">Measure from your shoulder point down to your wrist, with your arm slightly bent</p>
                </div>
              </div>
            </div>
          </section>

          {/* Size Charts */}
          <section className="py-20 bg-gradient-to-t from-zinc-900 via-black to-zinc-900">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Size Charts
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                  All measurements are in inches. Choose the size that corresponds to your measurements.
                </p>
                
                {/* Category Toggle */}
                <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                  <button
                    onClick={() => setActiveCategory('mens')}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeCategory === 'mens'
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Men's
                  </button>
                  <button
                    onClick={() => setActiveCategory('womens')}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeCategory === 'womens'
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Women's
                  </button>
                </div>
              </div>

              {/* Size Table */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/10 border-b border-white/20">
                        <th className="px-6 py-4 text-left text-white font-semibold">Size</th>
                        <th className="px-6 py-4 text-center text-white font-semibold">Chest/Bust</th>
                        <th className="px-6 py-4 text-center text-white font-semibold">Waist</th>
                        <th className="px-6 py-4 text-center text-white font-semibold">Length</th>
                        <th className="px-6 py-4 text-center text-white font-semibold">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSizes.map((size, index) => (
                        <tr key={size.size} className={`border-b border-white/10 ${index % 2 === 0 ? 'bg-white/5' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{size.size}</span>
                              </div>
                              <span className="text-white font-semibold">{size.size}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-gray-300">{size.chest}"</td>
                          <td className="px-6 py-4 text-center text-gray-300">{size.waist}"</td>
                          <td className="px-6 py-4 text-center text-gray-300">{size.length}"</td>
                          <td className="px-6 py-4 text-center text-gray-300">{size.sleeve}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Fit Tips */}
          

          {/* Footer */}
          <footer className="bg-black border-t border-gray-800 py-12">
            <PremiumFooter/>
          </footer>
        </div>
      </div>
    </div>
  )
}