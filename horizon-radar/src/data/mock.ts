import { Protocol, ProtocolSummary } from '../types'

// This file now serves as a fallback for the old protocol system
// The new database system is in localStorageDB.ts
export const mockSummaries: ProtocolSummary[] = [
  {
    slug: 'solarxyz',
    name: 'SolarXYZ',
    ticker: 'SLR',
    category: ['DeFi', 'Real-World Assets'],
    chains: ['Ethereum', 'Base'],
    status: 'Mainnet',
    premium: false,
    radarRating: 78,
    lastUpdated: '2025-08-01',
  },
  {
    slug: 'oraclia',
    name: 'Oraclia',
    category: ['Oracle'],
    chains: ['Arbitrum'],
    premium: true,
    lastUpdated: '2025-07-15',
  },
  {
    slug: 'dexterm',
    name: 'DEXTerm',
    category: ['Trading Terminal'],
    chains: ['Web App'],
    premium: false,
    lastUpdated: '2025-08-10',
  },
]

export const mockProtocols: Record<string, Protocol> = {
  solarxyz: {
    slug: 'solarxyz',
    name: 'SolarXYZ',
    ticker: 'SLR',
    category: ['DeFi', 'Real-World Assets'],
    chains: ['Ethereum', 'Base'],
    status: 'Mainnet',
    premium: false,
    radarRating: 78,
    growthPotential: 'Medium-High',
    lastUpdated: '2025-08-01',
    investmentOpportunityText: 'Compelling if RWA execution continues; see risks.',
    sections: {
      abstract: {
        beginner: 'SolarXYZ enables retail to fund real-world solar projects with crypto rewards.',
        intermediate: 'SolarXYZ channels capital into solar infra with bitcoin-style incentives.',
        advanced: 'Mechanism design mirrors UTXO-era issuance; collateralized RWAs back yield streams.',
      },
      architecture: {
        beginner: 'On-chain contracts hold capital; off-chain oracles track solar output.',
        intermediate: 'Core contracts manage deposits, rewards; oracles feed production data.',
        advanced: 'UUPS proxies for upgradeability; cross-chain settlement via messaging bridge.',
      },
      mechanics: {
        deposit: {
          beginner: 'Users deposit tokens.',
          intermediate: 'LP deposits accrue rewards.',
          advanced: 'AMM routing + staking adapters.',
        },
        withdraw: {
          beginner: 'Users can withdraw anytime.',
          intermediate: 'Fees may apply.',
          advanced: 'Timelocks protect liquidity shocks.',
        },
        incentives: {
          beginner: 'Earn SLR tokens.',
          intermediate: 'Rewards decay over time.',
          advanced: 'Emissions curve matches growth targets.',
        },
        riskEngine: {
          beginner: 'Risks are monitored.',
          intermediate: 'Oracle failures handled.',
          advanced: 'Circuit breakers & TWA oracles.',
        },
      },
      problemUsersValue: {
        problem: {
          beginner: 'Green energy needs funding.',
          intermediate: 'Capex heavy infra underfunded.',
          advanced: 'Fragmented financing & volatility.',
        },
        users: {
          beginner: 'Retail and solar operators.',
          intermediate: 'Yield seekers & providers.',
          advanced: 'Creditworthy operators + DeFi LPs.',
        },
        value: {
          beginner: 'Simple yield from solar.',
          intermediate: 'Transparent metrics.',
          advanced: 'Capital-efficient RWA on-chain exposures.',
        },
      },
      tokenomics: {
        beginner: 'SLR rewards early users.',
        intermediate: 'Vesting and cliffs protect long-term holders.',
        advanced: 'Allocation: Team 20% (48m, 12m cliff); Emissions decay; fee buybacks.',
      },
      authorSources: {
        beginner: 'Compiled from docs & dashboards.',
        intermediate: 'Citations with timestamps.',
        advanced: 'Snapshot block recorded for metrics.',
      },
      disclaimer: {
        beginner: 'Not financial advice.',
        intermediate: 'Use at your own risk.',
        advanced: 'Methodology notes & caveats available.',
      },
      community: {
        beginner: 'Member ratings coming soon.',
        intermediate: 'Bull/Bear theses stubs.',
        advanced: 'Opinion data stored separately.',
      },
    },
    metricSnapshots: [
      {
        asOf: '2025-08-01',
        tvl: 12500000,
        volume24h: 820000,
      },
    ],
  },
}
