import { Price, Token } from '@weconomy/sdk-core'
import { tickToPrice } from '@weconomy/v3-sdk'

export function getTickToPrice(
  baseToken?: Token,
  quoteToken?: Token,
  tick?: number
): Price<Token, Token> | undefined | any {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return tickToPrice(baseToken, quoteToken, tick)
}
