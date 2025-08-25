'use client'

import { useState, useEffect } from 'react'
import { localStorageDB } from '@/data/localStorageDB'

export default function About() {
  const [showCreate, setShowCreate] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'admin' | 'ultimate' | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const adminSession = localStorage.getItem('adminSession')
    const userSession = localStorage.getItem('userSession')
    
    if (adminSession || userSession) {
      setIsLoggedIn(true)
      
      // Get user details
      if (adminSession === 'thenighguy') {
        setUserPlan('admin')
      } else if (userSession) {
        // For now, assume premium - in real app this would come from user data
        setUserPlan('premium')
      }
      
      // Check newsletter subscription status
      const userEmail = adminSession || userSession
      if (userEmail) {
        const subscription = localStorageDB.getNewsletterSubscriptionByEmail(userEmail)
        setIsSubscribed(subscription?.status === 'subscribed')
      }
    }
  }, [])

  const handleSubscribe = () => {
    window.showSubscribePopout()
  }

  const getCTAText = () => {
    if (!isLoggedIn) return 'Subscribe'
    if (userPlan === 'ultimate') return 'Manage Plan'
    if (userPlan === 'premium' || userPlan === 'admin') return 'Upgrade Plan'
    if (isSubscribed) return 'Upgrade Plan'
    return 'Subscribe'
  }

  const getCTAAction = () => {
    if (!isLoggedIn) return handleSubscribe
    if (userPlan === 'ultimate') return () => window.location.href = '/billing'
    if (userPlan === 'premium' || userPlan === 'admin') return () => window.location.href = '/premium'
    if (isSubscribed) return () => window.location.href = '/premium'
    return handleSubscribe
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center">
      {/* No standard header per spec */}
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold">Clarity for Crypto Research</div>
        <div className="text-lg">Leveraging AI insights to drive quality education investment decisions.</div>
      </div>

      <button
        aria-label="Learn more"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }}
        className="absolute bottom-16 animate-bounce"
      >
        Learn more ↓
      </button>

      <button 
        onClick={getCTAAction()} 
        className="absolute left-6 bottom-6 underline hover:no-underline transition-all duration-200"
      >
        {getCTAText()}
      </button>
      <button
        className="absolute right-6 bottom-6 border rounded px-3 py-1"
        onClick={() => setShowCreate(true)}
      >
        Create Account
      </button>

      {showCreate && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Create Account</h2>
            <p className="text-sm mb-4">UI only (no backend yet).</p>
            <button onClick={() => setShowCreate(false)} className="border rounded px-3 py-1">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
