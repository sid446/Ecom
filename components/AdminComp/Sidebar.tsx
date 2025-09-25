// File: components/admin/Sidebar.tsx (Updated version)
'use client'

import React from 'react'
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Image, // Add Image icon for carousel
  RotateCcw, // Add RotateCcw icon for returns
  Menu,
  X,
  Home
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen
}) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Dashboard overview'
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      description: 'Manage products'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      description: 'View and manage orders'
    },
    {
      id: 'returns',
      label: 'Returns',
      icon: RotateCcw,
      description: 'Manage return requests'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'Manage customers'
    },
    {
      id: 'carousel',
      label: 'Carousel',
      icon: Image,
      description: 'Manage carousel banners'
    }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full bg-gradient-to-b from-gray-800 to-gray-900 transition-all duration-300 border-r border-gray-700
        ${sidebarOpen ? 'w-72' : 'w-20'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          {sidebarOpen ? (
            <>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors mx-auto"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }
                    ${!sidebarOpen && 'justify-center'}
                  `}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && (
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              <div>
                <p className="text-white font-medium">Admin User</p>
                <p className="text-gray-400 text-xs">System Administrator</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar