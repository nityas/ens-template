'use client'

import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@usecapsule/rainbowkit'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { WagmiProvider } from 'wagmi'

import StyledComponentsRegistry from '@/lib/sc-registry'
import { capsuleClient, capsuleIntegratedProps, wagmiConfig } from '@/lib/web3'

const queryClient = new QueryClient()

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={lightTheme}>
            <ThorinGlobalStyles />
            <RainbowKitProvider
              capsule={capsuleClient}
              capsuleIntegratedProps={capsuleIntegratedProps}
            >
              {isMounted && children}
            </RainbowKitProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
