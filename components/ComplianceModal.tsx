import React, { useState } from 'react';
import { X, Shield, Lock, History, SearchCheck, Laptop, ShieldCheck, Bug, Database, Cloud, GitBranch, Zap, Scale, Copyright, FileText } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'software' | 'security' | 'privacy' | 'governance'>('infrastructure');

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
        <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-stone-50/50">
          {[
            { id: 'infrastructure', label: 'Infra' },
            { id: 'software', label: 'SDLC' },
            { id: 'security', label: 'Security' },
            { id: 'governance', label: 'Governance' },
            { id: 'privacy', label: 'Incidents' }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-[100px] py-3 text-[10px] uppercase tracking-widest font-medium transition-colors ${activeTab === tab.id ? 'bg-white border-b-2 border-black text-black' : 'text-gray-400 hover:bg-gray-100'}`}>{tab.label}</button>
          ))}
        </div>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto font-sans">
          {activeTab === 'infrastructure' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Cloud Architecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Cloud size={20} className="text-stone-700 mb-2" /><h4 className="font-bold text-xs uppercase">Network Isolation</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Production databases reside in private subnets via secure VPC peering.</p>
                </div>
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm">
                  <Database size={20} className="text-stone-700 mb-2" /><h4 className="font-bold text-xs uppercase">Data Encryption</h4>
                  <p className="text-[11px] text-gray-500 mt-1">AES-256 at rest. TLS 1.3 in transit with HSTS.</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'software' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Software Development (SDLC)</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3"><GitBranch size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Code Reviews</h4><p className="text-xs">All changes require peer review before merging.</p></div></div>
                <div className="flex items-start space-x-3"><Bug size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Vulnerability Scanning</h4><p className="text-xs">Daily automated scans for third-party library vulnerabilities.</p></div></div>
              </div>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Device Governance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 bg-stone-50 rounded-sm"><Laptop size={20} className="mb-2"/><h4 className="font-bold text-xs uppercase">Endpoint Controls</h4><p className="text-[11px]">FDE and automated patching enforced on corporate hardware.</p></div>
              </div>
            </div>
          )}
          {activeTab === 'governance' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xl font-serif">Governance & Compliance</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-3"><Scale size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Legislative Alignment</h4><p className="text-xs text-gray-500 mt-1">Compliant with the Zambia Data Protection Act (2021) and BoZ regulations.</p></div></div>
                <div className="flex items-start space-x-3"><Copyright size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Intellectual Property (IP)</h4><p className="text-xs text-gray-500 mt-1">Policies protect artisan recipes. Internal software uses MIT/Apache 2.0 or proprietary IP.</p></div></div>
                <div className="flex items-start space-x-3"><FileText size={18} className="mt-1" /><div><h4 className="font-bold text-xs uppercase">Contractual Integrity</h4><p className="text-xs text-gray-500 mt-1">Standardized Vendor Agreements define liabilities and IP rights.</p></div></div>
              </div>
            </div>
          )}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fade-in">
               <div className="flex items-start space-x-4"><div className="bg-green-50 p-3 rounded-full"><History size={24} className="text-green-700" /></div><div><h4 className="font-bold text-sm uppercase">Security History</h4><p className="text-sm">Zero (0) breaches in 36 months.</p></div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ComplianceModal;
