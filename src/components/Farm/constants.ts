// import { Price } from '@weconomy/sdk-core'
import { Currency, Price, Token } from '@weconomy/sdk-core'
import { ChainId } from '@weconomy/smart-order-router'
import { Pair } from '@weconomy/v2-sdk'
import { TokenList } from '@uniswap/token-lists'
import { BigNumber } from 'ethers/lib/ethers'
import { TokenAmount } from 'graphql/utils/types'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'
import { Presets } from 'state/mint/v3/reducer'

interface CommonStakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount?: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount?: TokenAmount
  ended: boolean
  name: string
  lp: string
  baseToken: Token
  pair: string
  oneYearFeeAPY?: number
  oneDayFee?: number
  accountFee?: number
  tvl?: string
  perMonthReturnInRewards?: number
  totalSupply?: TokenAmount
  usdPrice?: Price<Currency, Currency>
  stakingTokenPair?: Pair | null
  sponsored: boolean
  sponsorLink: string
}

export interface StakingInfo extends CommonStakingInfo {
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount?: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate?: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate?: TokenAmount
  rewardToken: Token
  rewardTokenPrice: number
  rate: number
  valueOfTotalStakedAmountInBaseToken?: TokenAmount
}

export interface DualStakingInfo extends CommonStakingInfo {
  rewardTokenA: Token
  rewardTokenB: Token
  rewardTokenBBase: Token
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmountA?: TokenAmount
  earnedAmountB?: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRateA: TokenAmount
  totalRewardRateB: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRateA?: TokenAmount
  rewardRateB?: TokenAmount

  rateA: number
  rateB: number
  rewardTokenAPrice: number
  rewardTokenBPrice: number
}

export interface FarmPair {
  type: Presets
  title: string
  address: string
  token0Address: string
  token1Address: string
  ableToFarm: boolean
  feerTier: number
  pid: number
  hypervisor: string
}

interface GammaPairTokens {
  address: string
  title: string
  type: Presets
  token0Address: string
  token0:
    | Token
    | {
        token: WrappedTokenInfo
        list?: TokenList
      }
  token1Address: string
  token1:
    | Token
    | {
        token: WrappedTokenInfo
        list?: TokenList
      }
  ableToFarm?: boolean
  pid?: number
}

export interface itemFarmToken extends FarmPair {
  token0:
    | Token
    | {
        token: WrappedTokenInfo
        list?: TokenList
      }
    | null
  token1:
    | Token
    | {
        token: WrappedTokenInfo
        list?: TokenList
      }
    | null
}

interface Returns {
  daily: {
    feeApr: number
    feeApy: number
  }
  weekly: {
    feeApr: number
    feeApy: number
  }
  monthly: {
    feeApr: number
    feeApy: number
  }
  allTime: {
    feeApr: number
    feeApy: number
  }
  status: string
}

export interface FarmPoolData {
  baseLower: number
  baseUpper: number
  capacityUsed: string
  createDate: string
  decimals0: number
  decimals1: number
  depositCap0: number
  depositCap1: number
  feesReinvested0: number
  feesReinvested1: number
  feesReinvestedUSD: string
  grossFeesClaimed0: number
  grossFeesClaimed1: number
  grossFeesClaimedUSD: string
  inRange: boolean
  maxTotalSupply: number
  name: string
  observationIndex: string
  poolAddress: string
  poolFeesUSD: string
  poolTvlUSD: string
  returns: Returns
  sqrtPrice: string
  tick: number
  token0: string
  token1: string
  totalSupply: number
  tvl0: number
  tvl1: number
  tvlUSD: string
}

interface Returns {
  initialTokenUSD: number
  initialTokenCurrentUSD: number
  currentUSD: number
  netMarketReturnsUSD: number
  netMarketReturnsPercentage: string
  hypervisorReturnsUSD: number
  hypervisorReturnsPercentage: string
}

interface AddressInfo {
  shares: number
  shareOfSupply: number
  balance0: number
  balance1: number
  balanceUSD: number
  returns: Returns
}

interface OwnerInfo {
  owner: string
  gammaStaked: number
  gammaStakedUSD: number
  gammaDeposited: number
  pendingGammaEarned: number
  pendingGammaEarnedUSD: number
  totalGammaEarned: number
  totalGammaEarnedUSD: number
  gammaStakedShare: number
  xgammaAmount: number
}

interface DynamicObject {
  [key: string]: AddressInfo
}

export type InfoAddress = OwnerInfo & DynamicObject

export const GammaPairs = {
  [ChainId.ROLLUX]: {
    '0x28c9c7fb3fe3104d2116af26cc8ef7905547349c-0x368433cac2a0b8d76e64681a9835502a1f2a8a30': [
      {
        type: Presets.GAMMA_NARROW,
        title: 'Narrow',
        address: '0x197e0865e759235699a758c5428944964627cde1',
        token0Address: '0x28c9c7fb3fe3104d2116af26cc8ef7905547349c',
        token1Address: '0x368433cac2a0b8d76e64681a9835502a1f2a8a30',
        ableToFarm: true,
        feerTier: 500,
        pid: 0,
        hypervisor: '0xf3b1125c8505f038503e002e61a78253610d4f60',
      },
    ],
    '0x28c9c7fb3fe3104d2116af26cc8ef7905547349c-0x48023b16c3e81aa7f6effbdeb35bb83f4f31a8fd': [
      {
        type: Presets.GAMMA_NARROW,
        title: 'Narrow',
        address: '0xab07b0c933dacb9d776af7dfaa814a4e3bea8d9a',
        token0Address: '0x28c9c7fb3fe3104d2116af26cc8ef7905547349c',
        token1Address: '0x48023b16c3e81aa7f6effbdeb35bb83f4f31a8fd',
        ableToFarm: true,
        feerTier: 3000,
        pid: 1,
        hypervisor: '0x8421c6102ee8a147facc01977df3b159f7921d54',
      },
    ],
    '0x368433cac2a0b8d76e64681a9835502a1f2a8a30-0x4200000000000000000000000000000000000006': [
      {
        type: Presets.GAMMA_NARROW,
        title: 'Narrow',
        address: '0x391bca3c3c5a71e369d284b0cd81a7fe8c097e20',
        token0Address: '0x368433cac2a0b8d76e64681a9835502a1f2a8a30',
        token1Address: '0x4200000000000000000000000000000000000006',
        ableToFarm: true,
        feerTier: 3000,
        pid: 2,
        hypervisor: '0x0b15a5e3ca0d4b492c3b476d0f807535f9b72079',
      },
    ],
    '0x4200000000000000000000000000000000000006-0x48023b16c3e81aa7f6effbdeb35bb83f4f31a8fd': [
      {
        type: Presets.GAMMA_NARROW,
        title: 'Narrow',
        address: '0xdafeb8351d63df6a85359142cc78aa5e319a6ffe',
        token0Address: '0x4200000000000000000000000000000000000006',
        token1Address: '0x48023b16c3e81aa7f6effbdeb35bb83f4f31a8fd',
        ableToFarm: true,
        feerTier: 3000,
        pid: 3,
        hypervisor: '0xb5a638528c2e15dd3475f57fd063ccffb587943c',
      },
    ],
    '0x4200000000000000000000000000000000000006-0xaa1c53afd099e415208f47fcfa2c880f659e6904': [
      {
        type: Presets.GAMMA_NARROW,
        title: 'Narrow',
        address: '0xb0631942b2d862ccf9c4b753c1ef068e6bec1cfb',
        token0Address: '0x4200000000000000000000000000000000000006',
        token1Address: '0xaa1c53afd099e415208f47fcfa2c880f659e6904',
        ableToFarm: true,
        feerTier: 3000,
        pid: 4,
        hypervisor: '0x05c731f5f922835796c49412a30615c46cca4d9e',
      },
    ],
  },
}

export const GlobalConst = {
  utils: {
    v3FarmSortBy: {
      pool: '1',
      tvl: '2',
      rewards: '3',
      apr: '4',
    },
    v3FarmFilter: {
      allFarms: '0',
      stableCoin: '1',
      blueChip: '2',
      stableLP: '3',
      otherLP: '4',
    },
  },
  v3LiquidityRangeType: {
    MANUAL_RANGE: '0',
    GAMMA_RANGE: '1',
  },
}

export enum FarmingType {
  ETERNAL = 0,
  LIMIT = 1,
}

export const ZERO = BigNumber.from('0')
export const ONE_TOKEN = BigNumber.from('1000000000000000000')

export const MINICHEF_ABI = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'address', name: '_rewardToken', internalType: 'address' },
      { type: 'address', name: '_firstOwner', internalType: 'address' },
    ],
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'to', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyWithdraw',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'to', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FunderAdded',
    inputs: [{ type: 'address', name: 'funder', internalType: 'address', indexed: false }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'FunderRemoved',
    inputs: [{ type: 'address', name: 'funder', internalType: 'address', indexed: false }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Harvest',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogRewardPerSecond',
    inputs: [{ type: 'uint256', name: 'rewardPerSecond', internalType: 'uint256', indexed: false }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'LogRewardsExpiration',
    inputs: [{ type: 'uint256', name: 'rewardsExpiration', internalType: 'uint256', indexed: false }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Migrate',
    inputs: [{ type: 'uint256', name: 'pid', internalType: 'uint256', indexed: false }],
    anonymous: false,
  },
  { type: 'event', name: 'MigratorDisabled', inputs: [], anonymous: false },
  {
    type: 'event',
    name: 'MigratorSet',
    inputs: [{ type: 'address', name: 'migrator', internalType: 'address', indexed: false }],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      { type: 'address', name: 'previousOwner', internalType: 'address', indexed: true },
      { type: 'address', name: 'newOwner', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PoolAdded',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'allocPoint', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'lpToken', internalType: 'contract IERC20', indexed: true },
      { type: 'address', name: 'rewarder', internalType: 'contract IRewarder', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PoolSet',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'allocPoint', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'rewarder', internalType: 'contract IRewarder', indexed: true },
      { type: 'bool', name: 'overwrite', internalType: 'bool', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PoolUpdate',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint64', name: 'lastRewardTime', internalType: 'uint64', indexed: false },
      { type: 'uint256', name: 'lpSupply', internalType: 'uint256', indexed: false },
      { type: 'uint256', name: 'accRewardPerShare', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdraw',
    inputs: [
      { type: 'address', name: 'user', internalType: 'address', indexed: true },
      { type: 'uint256', name: 'pid', internalType: 'uint256', indexed: true },
      { type: 'uint256', name: 'amount', internalType: 'uint256', indexed: false },
      { type: 'address', name: 'to', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'contract IERC20' }],
    name: 'REWARD',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'addFunder',
    inputs: [{ type: 'address', name: '_funder', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'addPool',
    inputs: [
      { type: 'uint256', name: '_allocPoint', internalType: 'uint256' },
      { type: 'address', name: '_lpToken', internalType: 'contract IERC20' },
      { type: 'address', name: '_rewarder', internalType: 'contract IRewarder' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'addPools',
    inputs: [
      { type: 'uint256[]', name: '_allocPoints', internalType: 'uint256[]' },
      { type: 'address[]', name: '_lpTokens', internalType: 'contract IERC20[]' },
      { type: 'address[]', name: '_rewarders', internalType: 'contract IRewarder[]' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'addedTokens',
    inputs: [{ type: 'address', name: '', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'deposit',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256' },
      { type: 'uint256', name: 'amount', internalType: 'uint256' },
      { type: 'address', name: 'to', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'depositWithPermit',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256' },
      { type: 'uint256', name: 'amount', internalType: 'uint256' },
      { type: 'address', name: 'to', internalType: 'address' },
      { type: 'uint256', name: 'deadline', internalType: 'uint256' },
      { type: 'uint8', name: 'v', internalType: 'uint8' },
      { type: 'bytes32', name: 'r', internalType: 'bytes32' },
      { type: 'bytes32', name: 's', internalType: 'bytes32' },
    ],
  },
  { type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'disableMigrator', inputs: [] },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'emergencyWithdraw',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256' },
      { type: 'address', name: 'to', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'extendRewardsViaDuration',
    inputs: [
      { type: 'uint256', name: 'extension', internalType: 'uint256' },
      { type: 'uint256', name: 'maxFunding', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'extendRewardsViaFunding',
    inputs: [
      { type: 'uint256', name: 'funding', internalType: 'uint256' },
      { type: 'uint256', name: 'minExtension', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'fundRewards',
    inputs: [
      { type: 'uint256', name: 'funding', internalType: 'uint256' },
      { type: 'uint256', name: 'duration', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'harvest',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256' },
      { type: 'address', name: 'to', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: 'allowed', internalType: 'bool' }],
    name: 'isFunder',
    inputs: [{ type: 'address', name: '_funder', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'contract IERC20' }],
    name: 'lpToken',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address[]', name: '', internalType: 'contract IERC20[]' }],
    name: 'lpTokens',
    inputs: [],
  },
  { type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'massUpdateAllPools', inputs: [] },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'massUpdatePools',
    inputs: [{ type: 'uint256[]', name: 'pids', internalType: 'uint256[]' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'migrate',
    inputs: [{ type: 'uint256', name: '_pid', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'migrationDisabled',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'contract IMigratorChef' }],
    name: 'migrator',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'address' }],
    name: 'owner',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: 'pending', internalType: 'uint256' }],
    name: 'pendingReward',
    inputs: [
      { type: 'uint256', name: '_pid', internalType: 'uint256' },
      { type: 'address', name: '_user', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint128', name: 'accRewardPerShare', internalType: 'uint128' },
      { type: 'uint64', name: 'lastRewardTime', internalType: 'uint64' },
      { type: 'uint64', name: 'allocPoint', internalType: 'uint64' },
    ],
    name: 'poolInfo',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      {
        type: 'tuple[]',
        name: '',
        internalType: 'struct MiniChefV2.PoolInfo[]',
        components: [
          { type: 'uint128', name: 'accRewardPerShare', internalType: 'uint128' },
          { type: 'uint64', name: 'lastRewardTime', internalType: 'uint64' },
          { type: 'uint64', name: 'allocPoint', internalType: 'uint64' },
        ],
      },
    ],
    name: 'poolInfos',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: 'pools', internalType: 'uint256' }],
    name: 'poolLength',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'removeFunder',
    inputs: [{ type: 'address', name: '_funder', internalType: 'address' }],
  },
  { type: 'function', stateMutability: 'nonpayable', outputs: [], name: 'renounceOwnership', inputs: [] },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'resetRewardsDuration',
    inputs: [{ type: 'uint256', name: 'duration', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'rewardPerSecond',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'contract IRewarder' }],
    name: 'rewarder',
    inputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'rewardsExpiration',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setMigrator',
    inputs: [{ type: 'address', name: '_migrator', internalType: 'contract IMigratorChef' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setPool',
    inputs: [
      { type: 'uint256', name: '_pid', internalType: 'uint256' },
      { type: 'uint256', name: '_allocPoint', internalType: 'uint256' },
      { type: 'address', name: '_rewarder', internalType: 'contract IRewarder' },
      { type: 'bool', name: 'overwrite', internalType: 'bool' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setPools',
    inputs: [
      { type: 'uint256[]', name: 'pids', internalType: 'uint256[]' },
      { type: 'uint256[]', name: 'allocPoints', internalType: 'uint256[]' },
      { type: 'address[]', name: 'rewarders', internalType: 'contract IRewarder[]' },
      { type: 'bool[]', name: 'overwrites', internalType: 'bool[]' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'totalAllocPoint',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'transferOwnership',
    inputs: [{ type: 'address', name: 'newOwner', internalType: 'address' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [
      {
        type: 'tuple',
        name: 'pool',
        internalType: 'struct MiniChefV2.PoolInfo',
        components: [
          { type: 'uint128', name: 'accRewardPerShare', internalType: 'uint128' },
          { type: 'uint64', name: 'lastRewardTime', internalType: 'uint64' },
          { type: 'uint64', name: 'allocPoint', internalType: 'uint64' },
        ],
      },
    ],
    name: 'updatePool',
    inputs: [{ type: 'uint256', name: 'pid', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [
      { type: 'uint256', name: 'amount', internalType: 'uint256' },
      { type: 'int256', name: 'rewardDebt', internalType: 'int256' },
    ],
    name: 'userInfo',
    inputs: [
      { type: 'uint256', name: '', internalType: 'uint256' },
      { type: 'address', name: '', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdraw',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256' },
      { type: 'uint256', name: 'amount', internalType: 'uint256' },
      { type: 'address', name: 'to', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'withdrawAndHarvest',
    inputs: [
      { type: 'uint256', name: 'pid', internalType: 'uint256' },
      { type: 'uint256', name: 'amount', internalType: 'uint256' },
      { type: 'address', name: 'to', internalType: 'address' },
    ],
  },
]
