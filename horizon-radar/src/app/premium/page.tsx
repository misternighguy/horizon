'use client'

import { useState } from 'react'
import Link from 'next/link'

type BillingCycle = 'monthly' | 'quarterly' | 'yearly'

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  name: string
  subtitle: string
  price: number
  yearlyPrice: number
  features: PlanFeature[]
  buttonText: string
  buttonVariant: 'primary' | 'secondary'
}

const plans: Plan[] = [
  {
    name: 'FREE PLAN',
    subtitle: 'Explore the top projects for free',
    price: 0,
    yearlyPrice: 0,
    features: [
      { text: 'Research Scope', included: true },
      { text: 'Weekly Newsletter', included: true },
      { text: 'Comment & Interact with Experts', included: true },
      { text: 'Novice & Technical Writing Styles', included: true }
    ],
    buttonText: 'EXPLORE FOR FREE',
    buttonVariant: 'secondary'
  },
  {
    name: 'PREMIUM PLAN',
    subtitle: 'Unlock comprehensive research insights',
    price: 14.95,
    yearlyPrice: 99.95,
    features: [
      { text: 'All Free Features', included: true },
      { text: 'Unlock "Analyst" Writing Style', included: true },
      { text: 'Request Research', included: true },
      { text: 'Access to Videos', included: true },
      { text: 'Create Watchlist', included: true },
      { text: 'Premium Support', included: true }
    ],
    buttonText: 'SUBSCRIBE TO PREMIUM',
    buttonVariant: 'primary'
  }
]

const billingCycles: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'MONTHLY' },
  { value: 'quarterly', label: 'QUARTERLY' },
  { value: 'yearly', label: 'YEARLY' }
]

export default function PremiumPage() {
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('yearly')

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return '$0'
    if (selectedCycle === 'yearly') {
      return `$${plan.yearlyPrice}`
    } else if (selectedCycle === 'quarterly') {
      return `$${29.95}`
    }
    return `$${plan.price}`
  }

  const getPeriod = () => {
    if (selectedCycle === 'yearly') return 'PAID YEARLY'
    if (selectedCycle === 'quarterly') return 'PAID QUARTERLY'
    return 'PER MONTH'
  }

  const getSavings = (plan: Plan) => {
    if (plan.price === 0 || selectedCycle === 'monthly') return null
    if (selectedCycle === 'yearly') {
      const savings = (plan.price * 12) - plan.yearlyPrice
      return `Save $${savings.toFixed(2)} annually`
    }
    if (selectedCycle === 'quarterly') {
      const savings = (plan.price * 3) - 29.95
      return `Save $${savings.toFixed(2)} quarterly`
    }
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Solid black background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Header */}
      <div className="relative z-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4">
            <span className="bg-gradient-to-r from-white via-[#E4E4E4] via-[rgb(var(--color-brand-400))] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent animate-gradient">
              SUBSCRIBE TO HORIZON RADAR
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Unlock comprehensive Web3 research insights with structured protocol dossiers and level-appropriate content
          </p>
        </div>

        {/* Billing Cycle Selector and CTA Button */}
        <div className="flex justify-between items-center mb-12">
          {/* Billing Cycle Selector */}
          <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 shadow-lg">
            {billingCycles.map((cycle) => (
              <button
                key={cycle.value}
                onClick={() => setSelectedCycle(cycle.value)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  selectedCycle === cycle.value
                    ? 'bg-[rgb(var(--color-horizon-green))] text-[rgb(var(--color-horizon-brown-dark))]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {cycle.label}
              </button>
            ))}
          </div>
          
          {/* CTA Button - Right Aligned */}
          <Link
            href="/about"
            className="group inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-light tracking-[-0.01em] bg-white/71 border border-white whitespace-nowrap backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
          >
            <span className="text-white group-hover:text-black transition-colors duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-white group-hover:text-[#3c3c3c] transition-colors duration-300">WHAT IS HORIZON?</span>
          </Link>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all ${
                plan.buttonVariant === 'primary' 
                  ? 'border-2 border-[rgb(var(--color-horizon-green))]' 
                  : 'border border-white/20'
              }`}
            >
              {/* Plan Header with Image and Content Side by Side */}
              <div className="flex flex-col lg:flex-row">
                {/* Plan Image Placeholder */}
                <div className="lg:w-1/3 h-48 lg:h-auto bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2 text-white">
                        {index === 0 ? (
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <line x1="9" y1="9" x2="9" y2="21"/>
                            <line x1="15" y1="9" x2="15" y2="21"/>
                            <line x1="9" y1="9" x2="15" y2="9"/>
                            <line x1="9" y1="15" x2="15" y2="15"/>
                          </svg>
                        )}
                      </div>
                      <div className="text-sm opacity-80">
                        {index === 0 ? 'Free Research' : 'Premium Analytics'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="lg:w-2/3 p-8">
                  <h3 className="text-2xl font-light mb-2 text-white">{plan.name}</h3>
                  <p className="text-white/80 mb-6">{plan.subtitle}</p>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="text-4xl font-light mb-1 text-white">
                      {getPrice(plan)}
                    </div>
                    <div className="text-sm text-white/70">
                      {plan.price > 0 ? getPeriod() : 'FOREVER'}
                    </div>
                    {getSavings(plan) && (
                      <div className="text-sm text-[rgb(var(--color-horizon-green))] mt-1">
                        {getSavings(plan)}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
                          feature.included 
                            ? 'bg-[rgb(var(--color-horizon-green))]' 
                            : 'bg-white/20'
                        }`}>
                          {feature.included && (
                            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${feature.included ? 'text-white' : 'text-white/60'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-4 px-6 rounded-full font-medium transition-all duration-300 ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-[rgb(var(--color-horizon-green))] text-black hover:bg-[rgb(var(--color-horizon-green))]/90'
                        : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Information */}
        <div className="text-center text-white/70">
          <p className="mb-4">
            Horizon Radar Premium provides comprehensive research tools for serious crypto investors.
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm">
            <Link href="/about" className="text-white hover:text-[rgb(var(--color-horizon-green))] transition-colors">
              LEARN MORE
            </Link>
            <div className="w-px h-4 bg-white/30"></div>
            <Link href="/research" className="text-white hover:text-[rgb(var(--color-horizon-green))] transition-colors">
              BROWSE RESEARCH
            </Link>
          </div>
        </div>
      </div>


    </div>
  )
}
