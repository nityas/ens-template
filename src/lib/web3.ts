import { connectorsForWallets } from '@usecapsule/rainbowkit'
import {
  CapsuleModalProps,
  CapsuleWeb,
  ConstructorOpts,
  Environment,
  GetCapsuleIntegratedOpts,
  OAuthMethod,
  getCapsuleWalletIntegrated,
} from '@usecapsule/rainbowkit-wallet'
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@usecapsule/rainbowkit/wallets'
import { createClient } from 'viem'
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID
const CAPSULE_API_KEY = process.env.NEXT_PUBLIC_CAPSULE_API_KEY
const CAPSULE_ENV = process.env
  .NEXT_PUBLIC_CAPSULE_ENV as keyof typeof Environment
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME

if (!WALLETCONNECT_ID) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_ID')
}

if (!CAPSULE_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_CAPSULE_API_KEY')
}

if (!CAPSULE_ENV || !(CAPSULE_ENV in Environment)) {
  throw new Error(`Invalid CAPSULE_ENV: ${CAPSULE_ENV}`)
}

if (!APP_NAME) {
  throw new Error('Missing NEXT_PUBLIC_APP_NAME')
}

// These options are used to brand Capsule to your app
// More details: https://docs.usecapsule.com/integration-guide/customize-capsule
const capsuleConstructorOpts: ConstructorOpts = {
  // Passkey Portal Branding
  portalBackgroundColor: '#FFFFFF',
  portalPrimaryButtonColor: '#5298FF',
  portalTextColor: '#000000',
  portalPrimaryButtonTextColor: '#FFFFFF',

  // User Email Branding
  emailTheme: 'light' as any,
  emailPrimaryColor: '#5298FF',
  githubUrl: 'https://github.com/ensdomains',
  xUrl: 'https://twitter.com/ensdomains',
  homepageUrl: 'https://ens.domains/',
  supportUrl: 'mailto:help@ens.domains',
}

// Create a Capsule instance with the provided API key and environment and branding options
export const capsuleClient = new CapsuleWeb(
  Environment[CAPSULE_ENV],
  CAPSULE_API_KEY,
  capsuleConstructorOpts
)

// RainbowKit capsule Integration options
const capsuleWalletIntegratedOpts: GetCapsuleIntegratedOpts = {
  capsule: capsuleClient,
  nameOverride: `Sign in with ${APP_NAME}`,
  iconOverride:
    'https://cryptologos.cc/logos/ethereum-name-service-ens-logo.png',
  iconBackgroundOverride: '#ffffff',
}

export const capsuleIntegratedProps = {
  appName: APP_NAME,
  oAuthMethods: [
    OAuthMethod.GOOGLE,
    OAuthMethod.TWITTER,
    OAuthMethod.DISCORD,
    OAuthMethod.APPLE,
    OAuthMethod.FACEBOOK,
  ],
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvaJ1zKHDtEqPik1OsCoPvQ8S92j7-AI1Q6F2j4yyE-Q&s',
}

// Add Capsule as a custom connector
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, metaMaskWallet],
    },
    {
      groupName: 'Others',
      wallets: [coinbaseWallet, walletConnectWallet],
    },
    {
      groupName: 'Custom',
      wallets: [getCapsuleWalletIntegrated(capsuleWalletIntegratedOpts)],
    },
  ],
  {
    appName: APP_NAME,
    projectId: WALLETCONNECT_ID,
  }
)

// Wagmi chains to use with the connectors
const chains = [mainnet] as const

// Lastly, create the Wagmi config with the connectors, chains, and client
export const wagmiConfig = createConfig({
  connectors,
  chains,
  multiInjectedProviderDiscovery: false,
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})
