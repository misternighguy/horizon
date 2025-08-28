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
            novice: 'SolarXYZ enables retail to fund real-world solar projects with crypto rewards.',
            technical: 'SolarXYZ channels capital into solar infra with bitcoin-style incentives.',
            analyst: 'Mechanism design mirrors UTXO-era issuance; collateralized RWAs back yield streams.',
          },
      architecture: {
        novice: 'On-chain contracts hold capital; off-chain oracles track solar output.',
        technical: 'Core contracts manage deposits, rewards; oracles feed production data.',
        analyst: 'UUPS proxies for upgradeability; cross-chain settlement via messaging bridge.',
      },
      mechanics: {
        deposit: {
          novice: 'Users deposit tokens.',
          technical: 'LP deposits accrue rewards.',
          analyst: 'AMM routing + staking adapters.',
        },
        withdraw: {
          novice: 'Users can withdraw anytime.',
          technical: 'Fees may apply.',
          analyst: 'Timelocks protect liquidity shocks.',
        },
        incentives: {
          novice: 'Earn SLR tokens.',
          technical: 'Rewards decay over time.',
          analyst: 'Emissions curve matches growth targets.',
        },
        riskEngine: {
          novice: 'Risks are monitored.',
          technical: 'Oracle failures handled.',
          analyst: 'Circuit breakers & TWA oracles.',
        },
      },
      problemUsersValue: {
        problem: {
          novice: 'Green energy needs funding.',
          technical: 'Capex heavy infra underfunded.',
          analyst: 'Fragmented financing & volatility.',
        },
        users: {
          novice: 'Retail and solar operators.',
          technical: 'Yield seekers & providers.',
          analyst: 'Creditworthy operators + DeFi LPs.',
        },
        value: {
          novice: 'Simple yield from solar.',
          technical: 'Transparent metrics.',
          analyst: 'Capital-efficient RWA on-chain exposures.',
        },
      },
      tokenomics: {
        novice: 'SLR rewards early users.',
        technical: 'Vesting and cliffs protect long-term holders.',
        analyst: 'Allocation: Team 20% (48m, 12m cliff); Emissions decay; fee buybacks.',
      },
      authorSources: {
        novice: 'Compiled from docs & dashboards.',
        technical: 'Citations with timestamps.',
        analyst: 'Snapshot block recorded for metrics.',
      },
      disclaimer: {
        novice: 'Not financial advice.',
        technical: 'Use at your own risk.',
        analyst: 'Methodology notes & caveats available.',
      },
      community: {
        novice: 'Member ratings coming soon.',
        technical: 'Bull/Bear theses stubs.',
        analyst: 'Opinion data stored separately.',
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
