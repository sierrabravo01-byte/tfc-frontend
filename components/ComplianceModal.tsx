import React, { useState } from 'react';
import { X, Shield, Server, Lock, FileText, Globe } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'subprocessors' | 'privacy'>('subprocessors');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Shield size={18} className="text-black"/>
            <h2 className="text-lg font-serif">Trust & Security Center</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('subprocessors')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'subprocessors' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            Sub-processors
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'security' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            Security Controls
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'privacy' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            Compliance
          </button>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto font-sans">
          
          {activeTab === 'subprocessors' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif mb-2">Authorized Sub-processors</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The Food Collective engages the following third-party entities to process customer data. 
                  All vendors are vetted for security compliance (SOC 2 / ISO 27001).
                </p>
                
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Vendor</th>
                        <th className="px-4 py-3 font-medium">Service / Purpose</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 font-medium">Render</td>
                        <td className="px-4 py-3 text-gray-600">Application Hosting, Database, SSL Termination</td>
                        <td className="px-4 py-3 text-gray-600">USA (Oregon) / EU (Frankfurt)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Google Cloud</td>
                        <td className="px-4 py-3 text-gray-600">AI Services (Gemini), Cloud DNS (High Availability/DDoS Protection), Infrastructure</td>
                        <td className="px-4 py-3 text-gray-600">Global (Distributed)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Kazang (Lesaka)</td>
                        <td className="px-4 py-3 text-gray-600">Payment Processing (Mobile Money)</td>
                        <td className="px-4 py-3 text-gray-600">South Africa / Zambia</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Server className="mt-1 mr-3 text-stone-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">Infrastructure & DNS</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Our infrastructure is hosted on Render (PaaS) with Google Cloud DNS. Configuration includes DNSSEC and built-in DDoS protection for redundancy and failover.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText className="mt-1 mr-3 text-stone-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">SDLC Process</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      We follow an Agile development methodology with Git-based version control. Deployment is managed via Render's automated Continuous Integration (CI) pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
               <div>
                <h3 className="text-xl font-serif mb-2">Compliance & Privacy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our organization follows GDPR data protection principles and applies appropriate safeguards.
                </p>

                <h4 className="font-bold text-xs uppercase tracking-wide mt-6 mb-2">Security Contact</h4>
                <p className="text-sm text-gray-600">
                  Security incidents or queries are managed by our designated Security Lead: 
                  <a href="mailto:ninagibs@gmail.com" className="text-blue-600 ml-1 underline">ninagibs@gmail.com</a>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceModal;
