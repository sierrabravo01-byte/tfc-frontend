import React, { useState } from 'react';
import { X, Shield, Server, Lock, FileText, Globe, Zap, ShieldAlert, History, BellRing, SearchCheck } from 'lucide-react';

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
        
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Shield size={18} className="text-black"/>
            <h2 className="text-lg font-serif">Trust & Security Center</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('subprocessors')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'subprocessors' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            Infrastructure
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'security' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            Security & Perf
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-colors ${activeTab === 'privacy' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            Incident Management
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto font-sans">
          
          {activeTab === 'subprocessors' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif mb-2">Authorized Sub-processors</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We engage industry-leading vendors to ensure the performance and security of your data.
                </p>
                
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Vendor</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Security Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3 font-medium">Render / Cloudflare</td>
                        <td className="px-4 py-3 text-gray-600">Hosting & CDN (Edge Delivery)</td>
                        <td className="px-4 py-3 text-gray-600">SOC 2 Type II / ISO 27001</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Google Cloud</td>
                        <td className="px-4 py-3 text-gray-600">DNS & AI Services</td>
                        <td className="px-4 py-3 text-gray-600">SOC 3 / FedRAMP</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Kazang</td>
                        <td className="px-4 py-3 text-gray-600">Payment Processing</td>
                        <td className="px-4 py-3 text-gray-600">PCI-DSS Compliant</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Globe size={20} className="text-stone-700 mb-2" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">Global CDN</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    Content is served via Cloudflare's global edge network, providing low latency and advanced Web Application Firewall (WAF) protection.
                  </p>
                </div>
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <ShieldAlert size={20} className="text-stone-700 mb-2" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">DDoS Mitigation</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    L3/L4/L7 DDoS protection is active at the network edge to ensure high availability during traffic surges.
                  </p>
                </div>
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Zap size={20} className="text-stone-700 mb-2" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">DNSSEC</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    DNSSEC is enabled via Google Cloud DNS to prevent spoofing and man-in-the-middle attacks.
                  </p>
                </div>
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Lock size={20} className="text-stone-700 mb-2" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">SSL/TLS 1.3</h4>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    All traffic is encrypted in transit using industry-standard TLS 1.2+ with automated certificate rotation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex items-start space-x-4">
                  <div className="bg-green-50 p-3 rounded-full">
                    <History size={24} className="text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">36-Month Security Record</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Zero (0) data breaches or security incidents have been reported in the last 36 months.
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Status: Compliant</span>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <SearchCheck size={18} className="text-stone-700" />
                    <h4 className="font-bold text-sm uppercase tracking-wide">Incident Detection</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-7">
                    Anomalies are detected via Cloudflare's adaptive security model and Render’s infrastructure metrics. Automated alerts are triggered for spikes in 4xx/5xx errors or suspicious request volumes.
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <BellRing size={18} className="text-stone-700" />
                    <h4 className="font-bold text-sm uppercase tracking-wide">Response Protocol</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2 pl-7 list-disc">
                    <li><strong>Containment:</strong> Immediate edge-level blocking of malicious actors.</li>
                    <li><strong>Investigation:</strong> Log analysis to determine blast radius.</li>
                    <li><strong>Notification:</strong> 24-hour SLA for notifying relevant partners and users.</li>
                  </ul>
               </div>

               <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-xs uppercase tracking-wide mb-2">Primary Security Contact</h4>
                <p className="text-sm text-gray-600">
                  Nina Beatty, Security Officer: <a href="mailto:ninagibs@gmail.com" className="text-blue-600 underline">ninagibs@gmail.com</a>
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
