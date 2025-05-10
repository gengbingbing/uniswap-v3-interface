import { Currency } from '@weconomy/sdk-core'

export function currencyId(currency: Currency): string {
  if (currency.isNative) return 'SYS'
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}
