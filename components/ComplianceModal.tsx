import React, { useState } from 'react';
import { X, Shield, Lock, History, BellRing, SearchCheck, Laptop, ShieldCheck, Bug, Database, Cloud, GitBranch, Zap } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'software' | 'security' | 'privacy'>('infrastructure');

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
          <button onClick={onClose} className="text-gray-500 hover:text-black"><X size={20} /></button>
        </div>
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('infrastructure')} className={`flex-1 min-w-[120px] py-3 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === 'infrastructure' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-400'}`}>Infrastructure</button>
          <button onClick={() => setActiveTab('software')} className={`flex-1 min-w-[120px] py-3 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === 'software' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-400'}`}>Software (SDLC)</button>
          <button onClick={() => setActiveTab('security')} className={`flex-1 min-w-[120px] py-3 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === 'security' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-400'}`}>Device & Data</button>
          <button onClick={() => setActiveTab('privacy')} className={`flex-1 min-w-[120px] py-3 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === 'privacy' ? 'bg-white border-b-2 border-black text-black' : 'bg-gray-50 text-gray-400'}`}>Incidents</button>
        </div>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto font-sans">
          {activeTab === 'infrastructure' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Cloud Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Cloud size={20} className="text-stone-700 mb-2" /><h4 className="font-bold text-xs uppercase">Network Isolation</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Production databases reside in private subnets with no public ingress.</p>
                </div>
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Database size={20} className="text-stone-700 mb-2" /><h4 className="font-bold text-xs uppercase">Data Encryption</h4>
                  <p className="text-[11px] text-gray-500 mt-1">AES-256 encryption at rest. All transit data protected by TLS 1.3.</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left"><thead className="bg-gray-50 text-[10px] uppercase tracking-wider"><tr><th className="px-4 py-3">Vendor</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Compliance</th></tr></thead><tbody className="divide-y divide-gray-100"><tr><td className="px-4 py-3 font-medium">Render / AWS</td><td className="px-4 py-3 text-gray-600">Primary Hosting</td><td className="px-4 py-3 text-gray-600">SOC 2 Type II</td></tr><tr><td className="px-4 py-3 font-medium">Cloudflare</td><td className="px-4 py-3 text-gray-600">WAF / Edge Security</td><td className="px-4 py-3 text-gray-600">ISO 27001</td></tr></tbody></table>
              </div>
            </div>
          )}
          {activeTab === 'software' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Software Development (SDLC)</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3"><GitBranch size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Peer Reviews</h4><p className="text-xs text-gray-500">Mandatory code reviews and branch protection for all changes.</p></div></div>
                <div className="flex items-start space-x-3"><Zap size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">CI/CD Automation</h4><p className="text-xs text-gray-500">Automated security linting and testing on every pull request.</p></div></div>
                <div className="flex items-start space-x-3"><Bug size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Vuln Scanning</h4><p className="text-xs text-gray-500">Daily dependency scans for known vulnerabilities via GitHub.</p></div></div>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Device Governance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm"><Laptop size={20} className="mb-2"/><h4 className="font-bold text-xs uppercase">Endpoint Controls</h4><p className="text-[11px]">Full Disk Encryption (FDE) and automated patching enforced.</p></div>
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm"><ShieldCheck size={20} className="mb-2"/><h4 className="font-bold text-xs uppercase">AV/EDR Policy</h4><p className="text-[11px]">Apple XProtect and Gatekeeper active for real-time malware detection.</p></div>
              </div>
            </div>
          )}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex items-start space-x-4"><div className="bg-green-50 p-3 rounded-full"><History size={24} className="text-green-700" /></div><div><h4 className="font-bold text-sm uppercase">Security History</h4><p className="text-sm text-gray-600">Zero (0) breaches reported in the last 36 months.</p><span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Status: Compliant</span></div></div>
               <div className="pt-6 border-t border-gray-100"><h4 className="font-bold text-xs uppercase mb-2">Primary Security Contact</h4><p className="text-sm">Nina Beatty, Security Officer: ninagibs@gmail.com</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ComplianceModal;
