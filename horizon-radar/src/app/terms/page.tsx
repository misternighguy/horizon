'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none font-inter">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-inter">Terms of Service</h1>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-yellow-800 font-medium font-inter">
              <strong>IMPORTANT:</strong> By accessing or using Horizon Radar's websites, applications, content, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Services.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">1. Who We Are & Key Definitions</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Horizon Radar refers to [Horizon Radar, Inc./LLC] with principal place of business at [Address].</p>
              <p>User means any person or entity that accesses or uses the Services.</p>
              <p>Content includes any data, text, graphics, images, research, dossiers, metrics, ratings, comments, or other materials.</p>
              <p>User Content means content you or other users submit or provide.</p>
              <p>Premium/Ultimate means paid subscription tiers with additional features.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">2. Eligibility, Account Registration & Security</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>You must be at least 18 years old and legally able to accept these Terms.</p>
              <p>You may not use the Services if prohibited by sanctions or local law.</p>
              <p>You are responsible for providing accurate account information and maintaining security.</p>
              <p>Notify us promptly of unauthorized access or suspected security incidents.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">3. Subscriptions, Trials, Billing & Taxes</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Paid plans auto-renew until canceled. You authorize recurring billing.</p>
              <p>Free trials convert to paid plans unless canceled before expiration.</p>
              <p>Cancellations are effective at the end of the billing period; no refunds unless required by law.</p>
              <p>Prices may change with notice; changes apply to the next cycle.</p>
              <p>You are responsible for all applicable taxes.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">4. Acceptable Use & Prohibited Conduct</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Do not violate laws, infringe IP, or post unlawful/objectionable content.</p>
              <p>No scraping, bots, reverse engineering, or unauthorized access.</p>
              <p>Do not use Content to train AI models without explicit license.</p>
              <p>Do not introduce malware or disrupt the Services.</p>
              <p>We may monitor, moderate, remove, or restrict use at our discretion.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">5. Content; Research; AI-Assisted Outputs</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p><strong>All Content is educational/informational only. We are not financial advisors.</strong></p>
              <p>No investment recommendations, endorsements, or fiduciary duty.</p>
              <p>Some content is AI-assisted; it may contain errors or omissions.</p>
              <p>We may use third-party data which can be inaccurate or stale.</p>
              <p>You must perform your own due diligence before making decisions.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">6. Service Changes; Availability; Beta Features</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>We may add, remove, or modify features at any time.</p>
              <p>Beta features may be unstable and are provided as-is.</p>
              <p>No guarantee of continuous availability.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">7. User Content, Community & Moderation</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>You are responsible for your User Content and its legality.</p>
              <p>You grant us a license to use, store, and display your User Content.</p>
              <p>We may moderate or remove content at our discretion.</p>
              <p>No compensation for User Content unless agreed in writing.</p>
              <p>Feedback you provide may be used without restriction.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">8. Intellectual Property; License to You</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>The Services and Content are our IP, protected by law.</p>
              <p>We grant you a limited, personal, non-commercial license to use Content.</p>
              <p>You may not copy, distribute, or exploit Content without permission.</p>
              <p>Our trademarks may not be used without consent.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">9. Third-Party Services & Links</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>We may link to or integrate with third-party services (Stripe, Mailchimp, dashboards).</p>
              <p>We are not responsible for third-party content or policies.</p>
              <p>Your use is at your own risk and subject to third-party terms.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">10. Privacy & Data</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Your use is subject to our Privacy Policy.</p>
              <p>We may collect and use data as described in the Privacy Policy.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">11. Payment Processing & Chargebacks</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Payments are processed by third-party processors (e.g., Stripe).</p>
              <p>You agree not to make wrongful chargebacks.</p>
              <p>We may suspend accounts for unpaid or disputed amounts.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">12. Notices & Communications</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>You consent to receive electronic communications (email, in-product messages).</p>
              <p>Legal notices may be delivered by email or posted in the Services.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">13. Warranty Disclaimers</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>The Services and Content are provided as-is, without warranties.</p>
              <p>We disclaim warranties of merchantability, fitness, accuracy, availability.</p>
              <p>We do not warrant error-free, secure, or uninterrupted service.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">14. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>We are not liable for indirect, incidental, or consequential damages.</p>
              <p>Total liability is capped at the lesser of $100 or fees paid in the last 12 months.</p>
              <p>These limitations form the basis of the agreement.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">15. Indemnification</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>You agree to indemnify and hold us harmless from claims, damages, and costs arising from your use, content, or violations.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">16. Termination & Suspension</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>We may suspend or terminate accounts at any time for any reason.</p>
              <p>Provisions regarding IP, disclaimers, limitations, and indemnities survive termination.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">17. Dispute Resolution; Arbitration; Class Waiver</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Disputes will be resolved by binding arbitration (AAA or JAMS).</p>
              <p>Seat of arbitration: [San Francisco, California]. Language: English.</p>
              <p>You waive rights to jury trials or class actions.</p>
              <p>You may opt out of arbitration within 30 days of acceptance.</p>
              <p>Injunctive relief may be sought in court pending arbitration.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">18. Governing Law & Venue</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>These Terms are governed by Delaware law (or chosen jurisdiction).</p>
              <p>Exclusive venue is San Francisco, California, unless otherwise required by law.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">19. International Use; Export & Sanctions</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>You must comply with export controls and sanctions laws.</p>
              <p>You may not use the Services if blocked by sanctions.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">20. DMCA & IP Complaints</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Copyright complaints: send notice to [dmca@horizonradar.com].</p>
              <p>We may remove infringing content and terminate repeat infringers.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">21. Service-Specific Terms</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>Community features may be moderated.</p>
              <p>Research requests may be stored but are not guaranteed to be fulfilled.</p>
              <p>Admin/editor access must be used responsibly.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">22. Force Majeure</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>We are not liable for delays or failures due to events outside our control (natural disasters, war, cyberattacks, pandemics).</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">23. Changes to the Terms</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>We may modify these Terms; continued use means acceptance.</p>
              <p>Material changes will be communicated reasonably.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">24. Assignment</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>You may not assign these Terms without consent.</p>
              <p>We may assign in connection with mergers or acquisitions.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-inter">25. Miscellaneous</h2>
            <div className="space-y-4 text-gray-700 font-inter">
              <p>These Terms are the entire agreement between you and us.</p>
              <p>If one provision is invalid, the rest remain in effect.</p>
              <p>Failure to enforce a right is not a waiver.</p>
              <p>Headings are for convenience only.</p>
              <p>English version controls.</p>
            </div>
          </section>



          <div className="bg-gray-50 p-6 rounded-lg mt-12">
            <p className="text-sm text-gray-600 font-inter">
              <strong>Effective Date:</strong> [Month DD, YYYY]
            </p>
            <p className="text-sm text-gray-600 font-inter mt-2">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 font-inter mt-2">
              By using Horizon Radar, you acknowledge that you have read, understood, and agree to be bound 
              by these Terms of Service. If you do not agree to these terms, you must not use our services.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
