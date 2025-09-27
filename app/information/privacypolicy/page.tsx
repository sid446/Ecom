'use client';
import React, { useState } from 'react';
import { Shield, Mail, Phone, ShoppingCart, Calendar, Lock, Eye, Users, FileText, ChevronDown, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
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
                  <Shield className="h-12 w-12 text-gray-500 drop-shadow-lg" />
                  <div className="absolute inset-0 h-12 w-12 bg-gray-500/20 blur-md"></div>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    Privacy Policy
                  </span>
                </h1>
              </div>
              <div className="max-w-3xl mx-auto">
                <p className="text-2xl text-gray-300 mb-6 font-light">
                  <span className="text-gray-400 font-semibold">Kashé's</span> commitment to your digital privacy
                </p>
                <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                  <span className="bg-gray-800 px-3 py-1 border border-gray-700">
                    Last updated: {lastUpdated}
                  </span>
                  <span className="bg-gray-700/30 px-3 py-1 border border-gray-600 text-gray-300">
                    India Compliance
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
              <h2 className="text-3xl font-black text-white">Overview</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              At <span className="text-gray-400 font-semibold">Kashé</span>, we don't just respect your privacy—we protect it with cutting-edge security. 
              This policy outlines how we collect, weaponize (just kidding—we mean utilize), and safeguard your data. 
              By using our platform, you're entering into a digital covenant with us regarding your personal information.
            </p>
          </div>

          {/* Expandable Sections */}
          <Section id="data-collection" title="Data We Harvest" icon={Users}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Personal Intel</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Contact Vectors:</strong> <span className="text-gray-400">Email and phone for account creation, updates, and support</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Transaction Data:</strong> <span className="text-gray-400">Purchase history, preferences, addresses, payment info</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Feedback Intelligence:</strong> <span className="text-gray-400">Reviews, ratings, and user-generated content</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Profile Metrics:</strong> <span className="text-gray-400">Username, preferences, and behavioral data</span></div>
              </li>
            </ul>
            
            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">Digital Fingerprints</h3>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">IP address, browser signatures, device DNA</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Website interaction patterns and analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Cookies and advanced tracking technologies</span>
              </li>
            </ul>
          </Section>

          <Section id="data-usage" title="How We Weaponize Your Data" icon={Eye}>
            <div className="bg-gray-800/20 border border-gray-700/50 p-4 mb-6">
              <p className="text-gray-300 text-sm">
                <strong>Disclaimer:</strong> We don't actually weaponize your data. We're just being edgy. 😈
              </p>
            </div>

            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Primary Operations</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Order Execution:</strong> <span className="text-gray-400">Processing purchases, delivery coordination, support operations</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Communication Protocol:</strong> <span className="text-gray-400">Order updates, shipping alerts, critical account notifications</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Profile Management:</strong> <span className="text-gray-400">Account maintenance and personalization algorithms</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Review System:</strong> <span className="text-gray-400">Displaying feedback to enhance product intelligence</span></div>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">Secondary Protocols</h3>
            <ul className="list-none space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Platform optimization and enhancement</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Targeted promotions (consent required)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-600 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Legal compliance and fraud prevention</span>
              </li>
            </ul>
          </Section>

          <Section id="payment-info" title="Payment Fortress (Razorpay)" icon={ShoppingCart}>
            <div className="bg-gray-700/30 border border-gray-600/50 p-6 mb-6">
              <h3 className="text-xl font-bold mb-3 text-gray-300 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Fort Knox-Level Security
              </h3>
              <p className="text-gray-400">
                Your payments are processed through Razorpay's military-grade infrastructure. We don't mess around with your money.
              </p>
            </div>
            
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Data We Access</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Transaction amounts and order metadata</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Payment method types </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <span className="text-gray-400">Transaction status and reference codes</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold mb-4 text-gray-300 border-l-4 border-gray-600 pl-4">What's Off-Limits</h3>
            <div className="bg-gray-900/50 border border-gray-700 p-4">
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-3 text-gray-400">
                  <span className="text-gray-500">✗</span> Complete card numbers
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <span className="text-gray-500">✗</span> CVV/CVC security codes
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <span className="text-gray-500">✗</span> Banking credentials or PINs
                </li>
              </ul>
            </div>

            <p className="mt-4 text-sm text-gray-500 bg-gray-900/30 p-3 border border-gray-800">
              All payment data flows through PCI DSS-compliant channels. Razorpay's privacy fortress also protects your transactions.
            </p>
          </Section>

          <Section id="data-sharing" title="Data Distribution Network" icon={Users}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Authorized Partners</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Payment Gateway:</strong> <span className="text-gray-400">Razorpay for secure transaction processing</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Logistics Partners:</strong> <span className="text-gray-400">Delivery services for order fulfillment</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Legal Authorities:</strong> <span className="text-gray-400">When mandated by Indian law</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Business Transitions:</strong> <span className="text-gray-400">During mergers or acquisitions</span></div>
              </li>
            </ul>

            <div className="bg-gray-800/30 border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-300">Our Sacred Vows</h3>
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-gray-400">⚔️</span> We never sell your data to third parties
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-gray-400">⚔️</span> No contact sharing with marketers
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-gray-400">⚔️</span> Purchase history stays confidential
                </li>
              </ul>
            </div>
          </Section>

          <Section id="data-security" title="Digital Fortress Protocol" icon={Lock}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Security Arsenal</h3>
            <ul className="list-none space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Encryption Shield:</strong> <span className="text-gray-400">Military-grade SSL for all data transmission</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Secure Infrastructure:</strong> <span className="text-gray-400">Hardened servers with continuous updates</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Access Control:</strong> <span className="text-gray-400">Multi-layer authentication systems</span></div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-500 mt-2 flex-shrink-0"></div>
                <div><strong className="text-white">Threat Detection:</strong> <span className="text-gray-400">24/7 security monitoring and audits</span></div>
              </li>
            </ul>

            <div className="bg-gray-700/20 border border-gray-600/50 p-4">
              <h4 className="font-bold text-gray-400 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Your Security Mission
              </h4>
              <ul className="list-none space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">→</span> Guard your login credentials
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">→</span> Always logout from shared devices
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">→</span> Report suspicious activities immediately
                </li>
              </ul>
            </div>
          </Section>

          <Section id="your-rights" title="Your Digital Rights" icon={FileText}>
            <h3 className="text-xl font-bold mb-4 text-gray-400 border-l-4 border-gray-500 pl-4">Power User Privileges</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 border border-gray-700 p-4">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  Access Rights
                </h4>
                <p className="text-gray-400 text-sm">Request complete data exports</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 p-4">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  Correction Protocol
                </h4>
                <p className="text-gray-400 text-sm">Update or modify your information</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 p-4">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  Deletion Command
                </h4>
                <p className="text-gray-400 text-sm">Nuclear option - complete data removal</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 p-4">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  Portability Mode
                </h4>
                <p className="text-gray-400 text-sm">Export data in readable formats</p>
              </div>
            </div>

            <div className="bg-gray-700/30 border border-gray-600/50 p-6">
              <h4 className="font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Execute Your Rights
              </h4>
              <p className="text-gray-400 text-sm">
                Contact our digital privacy command center at <span className="font-mono bg-gray-900 px-2 py-1">privacy@kashe.com</span> 
                or use your account control panel. Response time: 30 days maximum.
              </p>
            </div>
          </Section>

          <Section id="cookies" title="Digital Tracking Cookies" icon={Eye}>
            <div className="grid gap-4 mb-6">
              <div className="bg-gray-700/20 border border-gray-600/50 p-4">
                <h4 className="font-bold text-gray-300 mb-2">Essential Cookies</h4>
                <p className="text-gray-400 text-sm">Required for core functionality and security protocols</p>
              </div>
              <div className="bg-gray-600/20 border border-gray-500/50 p-4">
                <h4 className="font-bold text-gray-300 mb-2">Analytics Cookies</h4>
                <p className="text-gray-400 text-sm">Intelligence gathering on user behavior patterns</p>
              </div>
              <div className="bg-gray-500/20 border border-gray-400/50 p-4">
                <h4 className="font-bold text-gray-300 mb-2">Preference Cookies</h4>
                <p className="text-gray-400 text-sm">Memory banks for your settings and preferences</p>
              </div>
              <div className="bg-gray-800/20 border border-gray-700/50 p-4">
                <h4 className="font-bold text-gray-300 mb-2">Marketing Cookies</h4>
                <p className="text-gray-400 text-sm">Targeted advertising (requires user consent)</p>
              </div>
            </div>

            <p className="text-sm text-gray-500 bg-gray-900/30 p-3 border border-gray-800">
              Cookie management available in browser settings. Disabling essential cookies may compromise functionality.
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
                  Digital Command Center
                  <div className="w-1 h-8 bg-gradient-to-b from-gray-500 to-gray-700"></div>
                </h2>
                <p className="text-gray-400">
                  Ready to connect? Our privacy guardians are standing by.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-800/20 border border-gray-700/50 p-6 hover:bg-gray-800/30 transition-all duration-300 group">
                  <h3 className="text-xl font-bold mb-4 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Privacy Hotline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-700/30 group-hover:bg-gray-700/50 transition-colors duration-300">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-mono text-sm">privacy@kashe.com</span>
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
                  <h3 className="text-xl font-bold mb-4 text-gray-300 group-hover:text-white transition-colors duration-300">Data Protection Officer</h3>
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      For formal complaints or advanced data protection queries under Indian privacy regulations.
                    </p>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="p-2 bg-gray-700/50 group-hover:bg-gray-700/70 transition-colors duration-300">
                        <Shield className="h-4 w-4 text-gray-400" />
                      </div>
                      <span className="font-mono text-sm">dpo@kashe.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Lock className="h-4 w-4" />
                  <span>
                    <span className="text-gray-400 font-semibold">Kashé</span> is committed to digital privacy excellence 
                    and compliance with Indian data protection laws.
                  </span>
                  <Lock className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;