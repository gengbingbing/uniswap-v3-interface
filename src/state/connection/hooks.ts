import { useWeb3React } from '@web3-react/core'
import { CurrencyAmount, Token } from '@weconomy/sdk-core'
import { useTokenBalancesWithLoadingIndicator } from 'lib/hooks/useCurrencyBalance'
import { useMemo } from 'react'

import { useDefaultActiveTokens } from '../../hooks/Tokens'

export {
  default as useCurrencyBalance,
  useCurrencyBalances,
  useNativeCurrencyBalances,
  useTokenBalance,
  useTokenBalances,
  useTokenBalancesWithLoadingIndicator,
} from 'lib/hooks/useCurrencyBalance'

// mimics useAllBalances
export function useAllTokenBalances(): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { account } = useWeb3React()
  const allTokens = useDefaultActiveTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(account ?? undefined, allTokensArray)
  console.log(allTokensArray, '=========allTokensArray=========', account)
  return [balances ?? {}, balancesIsLoading]
}
