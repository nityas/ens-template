"use client"

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  injectedWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import {
  OAuthMethod,
  Theme,
  getCapsuleWallet,
} from "@usecapsule/rainbowkit-wallet";

const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID
const CAPSULE_API_KEY = process.env.NEXT_PUBLIC_CAPSULE_API_KEY
const CAPSULE_ENV = process.env.NEXT_PUBLIC_CAPSULE_ENV

if (!WALLETCONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_ID')
}

if (!CAPSULE_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_CAPSULE_API_KEY')
}

if (!CAPSULE_ENV) {
  throw new Error('Missing NEXT_PUBLIC_CAPSULE_ENV')
}

const getCapsuleWalletOpts = {
  capsule: {
    environment: CAPSULE_ENV,
    apiKey: CAPSULE_API_KEY,
    constructorOpts: {
      // passkey configs
      portalBackgroundColor: '#FFFFFF',
      portalPrimaryButtonColor: '#5298FF',
      portalTextColor: '#000000',
      portalPrimaryButtonTextColor: '#FFFFFF',
      
      // email configs
      emailTheme: 'light',
      emailPrimaryColor: '#5298FF',
      githubUrl: 'https://github.com/ensdomains',
      xUrl: 'https://twitter.com/ensdomains',
      homepageUrl: 'https://ens.domains/',
      supportUrl: 'mailto:help@ens.domains',
    } ,
  },
  appName: 'ENS',
  theme: Theme.light,
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvaJ1zKHDtEqPik1OsCoPvQ8S92j7-AI1Q6F2j4yyE-Q&s",
  oAuthMethods: [
    OAuthMethod.GOOGLE,
    OAuthMethod.TWITTER,
    OAuthMethod.DISCORD,
    OAuthMethod.APPLE,
  ],
};

const chains = [mainnet] as const

export const wagmiConfig = getDefaultConfig({
  appName: 'ENS Frontend Template',
  projectId: WALLETCONNECT_ID,
  transports: {
    [mainnet.id]: http(),
  },
  chains,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, safeWallet, rainbowWallet, walletConnectWallet],
    },
    {
      groupName: "Custom",
      wallets: [getCapsuleWallet(getCapsuleWalletOpts)],
    },
  ],
})
