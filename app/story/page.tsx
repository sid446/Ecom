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
}

const storyData: StorySection[] = [
  {
    id: 'beginning',
    title: 'The Spark',
    subtitle: 'From a Dorm Room Idea to Reality',
    content: 'It wasn\'t a boardroom, it was a late-night study session fueled by instant noodles and a shared frustration: Why did all streetwear look the same? Our founders, Alex and Maya, decided to stop complaining and start creating. They envisioned a brand that wasn\'t just about the drip, but about identity – a fusion of digital culture, bold graphics, and conscious creation.',
  },
  {
    id: 'growth',
    title: 'The Level Up',
    subtitle: 'More Than Just a Brand',
    content: 'Our first drop sold out in 72 hours. But the real moment was seeing our designs in your TikToks, your Insta stories, your digital worlds. We realized we weren\'t just shipping packages; we were building a global crew. A community that values authenticity over hype and isn\'t afraid to challenge the status quo, one graphic tee at a time.',
  }
];

export default function ScrollOverStoryPage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)

      // Calculate which section should be active based on scroll
      const sectionHeight = window.innerHeight
      const currentSection = Math.floor(scrolled / sectionHeight)
      setActiveSection(Math.min(currentSection, storyData.length - 1))
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

  
      <div className="relative z-20">
        {storyData.map((section, index) => (
          <section
            key={section.id}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-900 shadow-2xl border-t border-gray-800/20"
         
          >
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {section.title}
                  </h2>
                  <h3 className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
                    {section.subtitle}
                  </h3>
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  {section.content}
                </p>
              </div>
            </div>
          </section>
        ))}

        {/* Testimonial Section */}
        <section className="min-h-screen flex items-center  bg-gradient-to-t from-zinc-900 via-black to-zinc-900 border-t border-gray-800/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Quote className="w-16 h-16 text-white/20 mx-auto mb-8" />
            <blockquote className="text-3xl md:text-4xl font-light text-white leading-relaxed mb-8">
              "This isn't just fashion – it's a movement. Every piece tells a story of sustainability, 
              craftsmanship, and hope for a better future."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-lg">Kashish</div>
                <div className="text-gray-400">Founder & Creative Director</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
      

        {/* Footer */}
        <footer className="absolute bg-black border-t border-gray-800 py-12 w-full">
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