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
      { text: 'Top 5 popular protocols', included: true },
      { text: 'Top 3 trending protocols', included: true },
      { text: 'Basic protocol summaries', included: true },
      { text: 'Beginner level content only', included: true },
      { text: 'Limited research access', included: true }
    ],
    buttonText: 'EXPLORE FOR FREE',
    buttonVariant: 'secondary'
  },
  {
    name: 'PRO PLAN',
    subtitle: 'Unlock comprehensive research insights',
    price: 29,
    yearlyPrice: 290,
    features: [
      { text: 'All Free features', included: true },
      { text: 'Unlimited protocol access', included: true },
      { text: 'Intermediate & Advanced content', included: true },
      { text: 'Detailed protocol dossiers', included: true },
      { text: 'Protocol comparison tools', included: true },
      { text: 'Research bookmarking', included: true },
      { text: 'Priority support access', included: true },
      { text: 'Weekly research digests', included: true }
    ],
    buttonText: 'SUBSCRIBE TO PRO',
    buttonVariant: 'primary'
  },
  {
    name: 'ULTIMATE PLAN',
    subtitle: 'Access enterprise-level research tools',
    price: 99,
    yearlyPrice: 990,
    features: [
      { text: 'All Pro features', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Custom research reports', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'API access for integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'White-label research solutions', included: true }
    ],
    buttonText: 'SUBSCRIBE TO ULTIMATE',
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
      return `$${Math.round(plan.price * 3 * 0.9)}`
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
      return `Save $${savings} annually`
    }
    if (selectedCycle === 'quarterly') {
      const savings = (plan.price * 3) - Math.round(plan.price * 3 * 0.9)
      return `Save $${savings} quarterly`
    }
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative z-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light mb-4">
            <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
              SUBSCRIBE TO HORIZON RADAR
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Unlock comprehensive Web3 research insights with structured protocol dossiers and level-appropriate content
          </p>
        </div>

        {/* Billing Cycle Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
            {billingCycles.map((cycle) => (
              <button
                key={cycle.value}
                onClick={() => setSelectedCycle(cycle.value)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  selectedCycle === cycle.value
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {cycle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden ${
                plan.buttonVariant === 'primary' 
                  ? 'bg-white/5 border border-white/20' 
                  : 'bg-white/3 border border-white/10'
              }`}
            >
              {/* Plan Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">
                      {index === 0 ? '🔍' : index === 1 ? '📊' : '🚀'}
                    </div>
                    <div className="text-sm opacity-80">
                      {index === 0 ? 'Free Research' : index === 1 ? 'Pro Analytics' : 'Ultimate Tools'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-8">
                <h3 className="text-2xl font-light mb-2">{plan.name}</h3>
                <p className="text-white/70 mb-6">{plan.subtitle}</p>
                
                {/* Pricing */}
                <div className="mb-6">
                  <div className="text-4xl font-light mb-1">
                    {getPrice(plan)}
                  </div>
                  <div className="text-sm text-white/50">
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
                      <span className={`text-sm ${feature.included ? 'text-white' : 'text-white/40'}`}>
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
          ))}
        </div>

        {/* Bottom Information */}
        <div className="text-center text-white/70">
          <p className="mb-4">
            Horizon Radar Ultimate is also available for enterprise teams and research institutions.
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

      {/* Chat Support */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 rounded-full bg-[rgb(var(--color-horizon-green))] text-black flex items-center justify-center hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
