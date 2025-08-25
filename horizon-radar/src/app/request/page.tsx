'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface InformalRequest {
  projectName: string;
  website?: string;
  twitter?: string;
  docsLink?: string;
  helpfulLink1?: string;
  helpfulLink2?: string;
  notes?: string;
}

interface FormalRequest {
  projectName: string;
  website: string;
  twitter?: string;
  contractAddress?: string;
  chain?: string;
  category?: string;
  problemStatement?: string;
  keyRisks?: string;
  docsLinks?: string;
}

export default function RequestResearch() {
  const [activeTab, setActiveTab] = useState<'informal' | 'formal'>('informal');
  const [informalForm, setInformalForm] = useState<InformalRequest>({
    projectName: '',
    website: '',
    twitter: '',
    docsLink: '',
    helpfulLink1: '',
    helpfulLink2: '',
    notes: ''
  });
  const [formalForm, setFormalForm] = useState<FormalRequest>({
    projectName: '',
    website: '',
    twitter: '',
    contractAddress: '',
    chain: '',
    category: '',
    problemStatement: '',
    keyRisks: '',
    docsLinks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionSummary, setSubmissionSummary] = useState<{
    id: string;
    type: 'informal' | 'formal';
    projectName: string;
    submittedAt: Date;
    [key: string]: unknown;
  } | null>(null);

  const validateInformalForm = (): boolean => {
    if (!informalForm.projectName.trim()) return false;
    if (!informalForm.website?.trim() && !informalForm.twitter?.trim()) return false;
    return true;
  };

  const validateFormalForm = (): boolean => {
    if (!formalForm.projectName.trim()) return false;
    if (!formalForm.website.trim()) return false;
    return true;
  };

  const handleInformalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInformalForm()) return;

    setIsSubmitting(true);
    
    try {
      // Store in localStorage for now (in real app, this would go to server)
      const request = {
        id: Date.now().toString(),
        type: 'informal' as const,
        ...informalForm,
        submittedAt: new Date(),
        submittedBy: localStorage.getItem('adminSession') || localStorage.getItem('userSession') || null,
        status: 'new' as const
      };

      // For now, just store in localStorage - in real app this would be a proper database
      const existing = JSON.parse(localStorage.getItem('research_requests') || '[]');
      existing.push(request);
      localStorage.setItem('research_requests', JSON.stringify(existing));

      setSubmissionSummary(request);
      setShowSuccess(true);
      setInformalForm({ projectName: '', website: '', twitter: '', docsLink: '', helpfulLink1: '', helpfulLink2: '', notes: '' });
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormalForm()) return;

    setIsSubmitting(true);
    
    try {
      const request = {
        id: Date.now().toString(),
        type: 'formal' as const,
        ...formalForm,
        submittedAt: new Date(),
        submittedBy: localStorage.getItem('adminSession') || localStorage.getItem('userSession') || null,
        status: 'new' as const
      };

      const existing = JSON.parse(localStorage.getItem('research_requests') || '[]');
      existing.push(request);
      localStorage.setItem('research_requests', JSON.stringify(existing));

      setSubmissionSummary(request);
      setShowSuccess(true);
      setFormalForm({ projectName: '', website: '', twitter: '', contractAddress: '', chain: '', category: '', problemStatement: '', keyRisks: '', docsLinks: '' });
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="relative min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-light mb-4">Request Submitted Successfully!</h1>
            <p className="text-white/80 mb-8">
              Thank you for your research request. Our team will review it and get back to you soon.
            </p>
            
            <div className="bg-white/10 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-medium mb-4">Submission Summary</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-white/60">Project:</span> {submissionSummary?.projectName}</div>
                <div><span className="text-white/60">Type:</span> {submissionSummary?.type === 'informal' ? 'Informal Request' : 'Formal Request'}</div>
                <div><span className="text-white/60">Submitted:</span> {submissionSummary?.submittedAt?.toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
              >
                Submit Another Request
              </button>
              <a
                href="/research"
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-center"
              >
                Browse Research
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/LandingBackground.png')] bg-cover bg-center bg-no-repeat"
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-black/40" />
      
      {/* Header positioned on top of background */}
      <div className="relative z-20">
        <Header />
      </div>
      
      {/* Content with overlay */}
      <div className="relative z-10 w-full py-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Title */}
          <section className="text-center mb-12">
            <h1 className="text-6xl font-medium mb-4">
              <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
                Request Research
              </span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-white/80">
              Submit a research request for protocols, projects, or topics you&apos;d like us to cover.
            </p>
          </section>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1">
              <button
                onClick={() => setActiveTab('informal')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'informal'
                    ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Informal Request
              </button>
              <button
                onClick={() => setActiveTab('formal')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'formal'
                    ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Formal Request
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            {activeTab === 'informal' ? (
              <form onSubmit={handleInformalSubmit} className="space-y-6">
                <h2 className="text-2xl font-light mb-6">Informal Request</h2>
                
                {/* Required Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Project Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={informalForm.projectName}
                      onChange={(e) => setInformalForm(prev => ({ ...prev, projectName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Official Website
                      </label>
                      <input
                        type="url"
                        value={informalForm.website}
                        onChange={(e) => setInformalForm(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Official Twitter
                      </label>
                      <input
                        type="text"
                        value={informalForm.twitter}
                        onChange={(e) => setInformalForm(prev => ({ ...prev, twitter: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-white/60 bg-white/5 rounded-lg p-4">
                    <p className="mb-2">💡 <strong>Note:</strong> At least one of Website or Twitter is required.</p>
                    <p>You can also provide up to 3 additional helpful links below.</p>
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Documentation Link
                      </label>
                      <input
                        type="url"
                        value={informalForm.docsLink}
                        onChange={(e) => setInformalForm(prev => ({ ...prev, docsLink: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="https://docs.example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Helpful Link #1
                      </label>
                      <input
                        type="url"
                        value={informalForm.helpfulLink1}
                        onChange={(e) => setInformalForm(prev => ({ ...prev, helpfulLink1: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="Any helpful resource"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Helpful Link #2
                    </label>
                    <input
                      type="url"
                      value={informalForm.helpfulLink2}
                      onChange={(e) => setInformalForm(prev => ({ ...prev, helpfulLink2: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                      placeholder="Any helpful resource"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={informalForm.notes}
                      onChange={(e) => setInformalForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
                      placeholder="Any additional context or specific areas you'd like us to focus on..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!validateInformalForm() || isSubmitting}
                  className="w-full py-4 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Informal Request'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleFormalSubmit} className="space-y-6">
                <h2 className="text-2xl font-light mb-6">Formal Request</h2>
                
                <div className="space-y-6">
                  {/* Required Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Project Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formalForm.projectName}
                        onChange={(e) => setFormalForm(prev => ({ ...prev, projectName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Official Website <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={formalForm.website}
                        onChange={(e) => setFormalForm(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Official Twitter
                      </label>
                      <input
                        type="text"
                        value={formalForm.twitter}
                        onChange={(e) => setFormalForm(prev => ({ ...prev, twitter: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="@username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Contract Address
                      </label>
                      <input
                        type="text"
                        value={formalForm.contractAddress}
                        onChange={(e) => setFormalForm(prev => ({ ...prev, contractAddress: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="0x..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Chain
                      </label>
                      <input
                        type="text"
                        value={formalForm.chain}
                        onChange={(e) => setFormalForm(prev => ({ ...prev, chain: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="Ethereum, Polygon, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formalForm.category}
                        onChange={(e) => setFormalForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="DeFi, NFT, Gaming, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Brief Problem Statement
                    </label>
                    <textarea
                      value={formalForm.problemStatement}
                      onChange={(e) => setFormalForm(prev => ({ ...prev, problemStatement: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
                      placeholder="What problem does this project solve?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Key Risks
                    </label>
                    <textarea
                      value={formalForm.keyRisks}
                      onChange={(e) => setFormalForm(prev => ({ ...prev, keyRisks: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
                      placeholder="What are the main risks or concerns?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Documentation Links
                    </label>
                    <textarea
                      value={formalForm.docsLinks}
                      onChange={(e) => setFormalForm(prev => ({ ...prev, docsLinks: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
                      placeholder="Links to whitepaper, technical docs, etc."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!validateFormalForm() || isSubmitting}
                  className="w-full py-4 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Formal Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
