import { useWeb3React } from '@web3-react/core'
import { NativeCurrency, Token } from '@weconomy/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { nativeOnChain } from 'constants/tokens'
import { useMemo } from 'react'

export default function useNativeCurrency(): NativeCurrency | Token {
  const { chainId } = useWeb3React()
  console.log(chainId, 'chainId', chainId && nativeOnChain(chainId))
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(SupportedChainId.ROLLUX),
    [chainId]
  )
}
