// Header.tsx
import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';


interface HeaderProps {
  activeTab: string;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, sidebarOpen }) => {
  const getTabDescription = (tab: string) => {
    switch (tab) {
      case 'overview':
        return 'Dashboard overview and analytics';
      case 'products':
        return 'Manage your product inventory';
      case 'orders':
        return 'Track and manage customer orders';
      case 'users':
        return 'View and manage user accounts';
      default:
        return '';
    }
  };
  // Add this test button to your ProductModal (put it somewhere in the JSX, like in the header)

    
// Add this button to your modal header (n  ext to the close button)


  return (
    <header className={`fixed top-0 right-0 h-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 z-30 transition-all duration-300 ${
      sidebarOpen ? 'left-72' : 'left-20'
    }`}>
      <div className="flex items-center justify-between h-full px-8">
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
          <p className="text-gray-400 text-sm">{getTabDescription(activeTab)}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;