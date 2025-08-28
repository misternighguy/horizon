'use client'

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { localStorageDB } from "@/data/localStorageDB";
import { Icons } from "@/components/ui/Icons";

// Extend Window interface for our custom methods
declare global {
  interface Window {
    showSubscribePopout: () => void;
    hideSubscribePopout: () => void;
  }
}

/**
 * Subscribe pop-out card
 * 
 * Based on the design with:
 * - Dark theme (#262626 background)
 * - Image on the left (40% width)
 * - Subscription form on the right (60% width)
 * - Orange submit button
 * - Clean, modern aesthetic
 */
export default function NewsletterCardPopOut() {
  const [open, setOpen] = useState(false); // Start hidden by default
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // ESC to close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Expose helpers for programmatic control
  useEffect(() => {
    window.showSubscribePopout = () => setOpen(true);
    window.hideSubscribePopout = () => setOpen(false);
  }, []);

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (open) firstInputRef.current?.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      alert("Please fill in both your name and email address.");
      return;
    }

    // Check if already subscribed
    const existingSubscription = localStorageDB.getNewsletterSubscriptionByEmail(email);
    if (existingSubscription && existingSubscription.status === 'subscribed') {
      alert("You're already subscribed to our newsletter!");
      return;
    }

    // Create or update subscription
    if (existingSubscription) {
      localStorageDB.updateNewsletterSubscription(existingSubscription.id, { status: 'subscribed' });
    } else {
      localStorageDB.createNewsletterSubscription({
        email,
        name,
        source: 'footer_popout',
        status: 'subscribed'
      });
    }

    // Show success message
    if (window.showToast) {
      window.showToast(`Thank you ${name}! You're now subscribed to our newsletter.`, 'success');
    } else {
      alert(`Thank you ${name}! You're now subscribed to our newsletter.`);
    }

    setEmail("");
    setName("");
    setOpen(false);
  };

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      {/* Card Container */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          <Icons.CloseCircle />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Section - Image (40% width) */}
          <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-black">
            <img 
              src="/images/join-newsletter-image.png" 
              alt="Join our newsletter for exclusive crypto research insights and updates"
              className="w-full h-full object-cover object-center block"
            />
          </div>

          {/* Right Section - Form (60% width) */}
          <div className="w-full md:w-3/5 bg-[#262626] text-white p-8">
            <h2
              id="subscribe-title"
              className="text-2xl font-bold mb-6 text-center md:text-left"
            >
              Join our Newsletter
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  ref={firstInputRef}
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full h-12 px-4 rounded-lg bg-[#1a1a1a] border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full h-12 px-4 rounded-lg bg-[#1a1a1a] border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#262626]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
