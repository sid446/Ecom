'use client';
import React, { useState } from 'react';
import { FileText, Mail, Phone, ShoppingCart, Calendar, Lock, Eye, Users, Shield, ChevronDown, ChevronRight, CreditCard, Truck, RotateCcw } from 'lucide-react';

const TermsOfService = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const lastUpdated = "September 2025";
  
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  type SectionProps = {
    id: string;
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
  };

  const Section: React.FC<SectionProps> = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className="border border-gray-700 mb-4 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/30 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
            <h2 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">{title}</h2>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-all duration-300" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-gray-400 transition-all duration-300" />
          )}
        </button>
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-700/50">
            <div className="prose max-w-none text-gray-300 pt-4">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gray-500/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gray-500/3 to-gray-600/3 blur-3xl"></div>
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0xNSAxIDAgMzgiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48cGF0aCBkPSJtMjUgMSAwIDM4IiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800 shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <FileText className="h-12 w-12 text-gray-500 drop-shadow-lg" />
                  <div className="absolute inset-0 h-12 w-12 bg-gray-500/20 blur-md"></div>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    Terms of Service
                  </span>
                </h1>
              </div>
              <div className="max-w-3xl mx-auto">
                <p className="text-2xl text-gray-300 mb-6 font-light">
                  <span className="text-gray-400 font-semibold">Kashé's</span> digital commerce agreement
                </p>
                <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                  <span className="bg-gray-800 px-3 py-1 border border-gray-700">
                    Last updated: {lastUpdated}
                  </span>
                  <span className="bg-gray-700/30 px-3 py-1 border border-gray-600 text-gray-300">
                    Himachal Pradesh, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Overview */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black shadow-2xl p-10 mb-12 border border-gray-800 hover:border-gray-700 transition-all duration-500 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-gradient-to-b from-gray-500 to-gray-700 group-hover:from-gray-400 group-hover:to-gray-600 transition-all duration-500"></div>
              <h2 className="text-3xl font-black text-white">Agreement Overview</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              Welcome to <span className="text-gray-400 font-semibold">Kashé</span> - your premium clothing destination. 
              By using our platform, you're entering into a binding agreement with us regarding the purchase of clothing and use of our services.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 text-center">
                <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm font-semibold">16+ Only</p>
                <p className="text-gray-500 text-xs">Age Requirement</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 text-center">
                <Truck className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm font-semibold">India Only</p>
                <p className="text-gray-500 text-xs">Shipping Zone</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/50 p-4 text-center">
                <RotateCcw className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm font-semibold">Same Day</p>
                <p className="text-gray-500 text-xs">Return Policy</p>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          <Section id="eligibility" title="User Eligibility" icon={Users}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Who Can Use Kashé</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Age Requirement:</strong> <span className="text-gray-400">Must be 16 years or older to create an account and make purchases</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Geographic Limit:</strong> <span className="text-gray-400">Services available only within India</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Account Responsibility:</strong> <span className="text-gray-400">You are responsible for maintaining account security and all activities under your account</span></div>
              </li>
            </ul>

            <div className="bg-gray-800/20 border border-gray-700/50 p-4">
              <p className="text-gray-300 text-sm">
                <strong>Legal Capacity:</strong> By creating an account, you confirm you have the legal capacity to enter into this agreement.
              </p>
            </div>
          </Section>

          <Section id="products-services" title="Products & Services" icon={ShoppingCart}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">What We Offer</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Clothing Products:</strong> <span className="text-gray-400">High-quality apparel and fashion accessories</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Product Information:</strong> <span className="text-gray-400">We strive for accuracy in descriptions, images, and pricing</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Availability:</strong> <span className="text-gray-400">All products subject to stock availability</span></div>
              </li>
            </ul>

            <div className="bg-gray-700/20 border border-gray-600/50 p-4">
              <h4 className="font-bold text-gray-400 mb-2">Product Accuracy</h4>
              <p className="text-gray-400 text-sm">
                While we ensure accuracy, slight variations in color, texture, or fit may occur due to manufacturing processes and display settings.
              </p>
            </div>
          </Section>

          <Section id="payments" title="Payment Terms" icon={CreditCard}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Payment Options</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 border border-gray-700 p-4">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  Online Payment
                </h4>
                <ul className="list-none space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">•</span> Razorpay secure gateway
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">•</span> Cards, UPI, Net Banking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">•</span> Instant order confirmation
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700 p-4">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-400" />
                  Cash on Delivery
                </h4>
                <ul className="list-none space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">•</span> Pay at your doorstep
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">•</span> Cash only (no cards)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gray-500">•</span> Subject to location availability
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">Payment Terms</h3>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">All prices are in Indian Rupees (INR) and include applicable taxes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Online payments are processed immediately upon order confirmation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">COD orders require payment at the time of delivery</span>
              </li>
            </ul>
          </Section>

          <Section id="returns" title="Returns & Refunds" icon={RotateCcw}>
            <div className="bg-gray-700/30 border border-gray-600/50 p-6 mb-6">
              <h3 className="text-xl font-bold mb-3 text-gray-300 flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Same Day Return Policy
              </h3>
              <p className="text-gray-400">
                We offer same-day returns for your peace of mind. Quality and satisfaction guaranteed.
              </p>
            </div>
            
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Return Conditions</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Time Limit:</strong> <span className="text-gray-400">Returns must be initiated within 24 hours of delivery</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Product Condition:</strong> <span className="text-gray-400">Items must be unused, unwashed, and in original packaging</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Tags & Labels:</strong> <span className="text-gray-400">All original tags and labels must be intact</span></div>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">Refund Process</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700">
                <span className="text-gray-300">Online Payment Refunds</span>
                <span className="text-gray-400 font-mono bg-gray-800 px-2 py-1 text-sm">3-7 business days</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700">
                <span className="text-gray-300">COD Returns</span>
                <span className="text-gray-400 font-mono bg-gray-800 px-2 py-1 text-sm">Immediate pickup</span>
              </div>
            </div>
          </Section>

          <Section id="shipping" title="Shipping & Delivery" icon={Truck}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Delivery Coverage</h3>
            <div className="bg-gray-800/30 border border-gray-700/50 p-6 mb-6">
              <h4 className="font-bold text-gray-300 mb-3">India-Wide Delivery</h4>
              <p className="text-gray-400 text-sm mb-3">
                We deliver across India from our base in Himachal Pradesh. Shipping times may vary based on location.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-300">Metro Cities</p>
                  <p className="text-gray-500 text-sm">2-4 business days</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-300">Other Areas</p>
                  <p className="text-gray-500 text-sm">4-7 business days</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">Shipping Terms</h3>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Shipping charges calculated based on location and order value</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Free shipping available on orders above minimum threshold</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Risk of loss passes to buyer upon delivery</span>
              </li>
            </ul>
          </Section>

          <Section id="accounts" title="User Accounts" icon={Users}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Account Management</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Account Creation:</strong> <span className="text-gray-400">Required for placing orders and tracking purchases</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Accurate Information:</strong> <span className="text-gray-400">You must provide accurate and current information</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Security:</strong> <span className="text-gray-400">You are responsible for maintaining password security</span></div>
              </li>
            </ul>

            <div className="bg-gray-700/20 border border-gray-600/50 p-4">
              <h4 className="font-bold text-gray-400 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Security
              </h4>
              <p className="text-gray-400 text-sm">
                Notify us immediately of any unauthorized access or security breaches. We reserve the right to suspend accounts for suspicious activity.
              </p>
            </div>
          </Section>

          <Section id="liability" title="Liability & Disclaimers" icon={Shield}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Limitation of Liability</h3>
            <div className="bg-gray-800/20 border border-gray-700/50 p-4 mb-6">
              <p className="text-gray-300 text-sm">
                <strong>Legal Notice:</strong> Our liability is limited to the purchase price of products. We are not liable for indirect, incidental, or consequential damages.
              </p>
            </div>

            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Product Quality:</strong> <span className="text-gray-400">We guarantee product quality as described, subject to normal manufacturing variations</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Delivery:</strong> <span className="text-gray-400">We are not liable for delays caused by external factors beyond our control</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Force Majeure:</strong> <span className="text-gray-400">Not liable for failures due to natural disasters, strikes, or government actions</span></div>
              </li>
            </ul>
          </Section>

          <Section id="termination" title="Agreement Changes & Termination" icon={FileText}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Modification Rights</h3>
            <p className="mb-4 text-gray-300">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Continued use of our services constitutes acceptance of modified terms.
            </p>

            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">Account Termination</h3>
            <div className="grid gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700">
                <div className="w-2 h-2 bg-gray-500"></div>
                <span className="text-gray-300">You may close your account at any time</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700">
                <div className="w-2 h-2 bg-gray-500"></div>
                <span className="text-gray-300">We may suspend accounts for terms violations</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700">
                <div className="w-2 h-2 bg-gray-500"></div>
                <span className="text-gray-300">Pending orders remain valid after termination</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 bg-gray-900/30 p-3 border border-gray-800">
              These terms are governed by the laws of Himachal Pradesh, India. Any disputes will be resolved in local courts.
            </p>
          </Section>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl p-10 border border-gray-800 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] repeat"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-4 flex items-center justify-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-500 to-gray-700"></div>
                  Customer Support
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-500 to-gray-700"></div>
                </h2>
                <p className="text-gray-400">
                  Questions about our terms? Our support team is here to help.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-800/20 border border-gray-700/50 p-6 hover:bg-gray-800/30 transition-all duration-300 group">
                  <h3 className="text-xl font-bold mb-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">General Support</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors duration-300">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-mono text-sm">support@kashe.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors duration-300">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-mono text-sm">+91-XXXX-XXXXXX</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 border border-gray-700/50 p-6 hover:bg-gray-800/50 transition-all duration-300 group">
                  <h3 className="text-xl font-bold mb-4 text-gray-300 group-hover:text-white transition-colors duration-300">Legal & Terms</h3>
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      For specific questions about these terms or legal matters regarding your orders and accounts.
                    </p>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-700/50 group-hover:bg-gray-700/70 transition-colors duration-300">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-mono text-sm">legal@kashe.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>
                    <span className="text-gray-400 font-semibold">Kashé</span> - Premium clothing from Himachal Pradesh, India
                  </span>
                  <Shield className="h-4 w-4" />
                </div>
                <p className="text-gray-600 text-xs mt-2">
                  These terms are governed by Indian law and subject to Himachal Pradesh jurisdiction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;