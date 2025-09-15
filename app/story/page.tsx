'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Quote,
  Award,
  Globe,
  Scissors,
  ChevronDown,
  Play
} from 'lucide-react'
import PremiumFooter from '@/components/Footer'

interface StorySection {
  id: string
  title: string
  subtitle: string
  content: string
  year?: string
  image?: string
  stats?: { label: string; value: string }[]
}

const storySection: StorySection = {
  id: 'beginning',
  title: 'The Beginning',
  subtitle: 'Born from a Simple Vision',
  year: '2018',
  content: 'It all started in a small studio apartment with a dream to create clothing that tells stories. Our founder, Sarah, believed that fashion should be more than just fabric – it should be an expression of identity, values, and dreams.',
  stats: [
    { label: 'First Collection', value: '12 Pieces' },
    { label: 'Team Size', value: '2 People' },
    { label: 'Investment', value: '$5,000' }
  ]
}

const values = [
  {
    icon: Heart,
    title: 'Passionate Craftsmanship',
    description: 'Every piece is created with love, attention to detail, and respect for the art of fashion.'
  },
  {
    icon: Globe,
    title: 'Global Responsibility',
    description: 'We believe in fashion that doesn\'t compromise the future of our planet.'
  },
  {
    icon: Users,
    title: 'Inclusive Community',
    description: 'Fashion is for everyone. We celebrate diversity in all its beautiful forms.'
  },
  {
    icon: Sparkles,
    title: 'Timeless Innovation',
    description: 'We blend classic elegance with modern innovation to create pieces that transcend trends.'
  }
]

const testimonials = [
  {
    text: "This brand doesn't just make clothes, they create pieces of art that make you feel confident and conscious at the same time.",
    author: "Maya Chen",
    role: "Fashion Blogger"
  },
  {
    text: "Finally, a brand that aligns with my values. Every purchase feels like I'm contributing to something bigger.",
    author: "Alex Rodriguez",
    role: "Sustainable Living Advocate"
  },
  {
    text: "The quality is exceptional, and knowing it's made ethically makes every piece even more special.",
    author: "Emma Thompson",
    role: "Creative Director"
  }
]

export default function ScrollOverStoryPage() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative ">
      {/* Fixed Hero Section - Always visible as background */}
      <div className="fixed inset-0 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/db2qa9dzs/image/upload/v1757935893/studio-portrait-blonde-girl-with-red-hat-leather-jacket-posed-against-brick-wall_mcrrxd.jpg')] bg-cover bg-center bg-no-repeat opacity-30"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center px-6">
            
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Our Story
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              A journey of passion, sustainability, and community that transforms fashion 
              into a force for positive change
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-white">
              <div className="flex font-semibold items-center space-x-2">
              
                <span>Crafted with Love</span>
              </div>
              <div className="flex font-semibold items-center space-x-2">
               
                <span>Sustainably Made</span>
              </div>
              <div className="flex font-semibold items-center space-x-2">
                
                <span>Community Driven</span>
              </div>
            </div>
            
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to enable scrolling */}
      <div className="h-screen"></div>

      {/* Single Story Section */}
      <div className="relative z-20">
        <section
          className="min-h-screen flex items-center py-20 bg-gradient-to-t from-black via-gray-950 to-black shadow-2xl"
          style={{
            clipPath: 'inset(0 0 0 0 round 0 0 32px 32px)',
            borderRadius: '0 0 32px 32px'
          }}
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {storySection.year && (
                  <div className="inline-block bg-black text-white px-4 py-2 rounded-full transform hover:scale-105 transition-transform">
                    <span className="text-sm font-semibold">{storySection.year}</span>
                  </div>
                )}
                
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-white">
                    {storySection.title}
                  </h2>
                  <h3 className="text-xl md:text-2xl text-gray-400 mb-6 font-light">
                    {storySection.subtitle}
                  </h3>
                </div>
                
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  {storySection.content}
                </p>
                
                {storySection.stats && (
                  <div className="grid grid-cols-3 gap-6">
                    {storySection.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-2xl md:text-3xl font-bold text-black mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-black/10 to-black/5 rounded-xl flex items-center justify-center">
                    <div className="text-6xl md:text-8xl font-bold text-black/20">
                      {storySection.year}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-800 py-12 absolute w-full">
          <PremiumFooter/>
        </footer>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/20 z-50">
        <div 
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>
  )
}