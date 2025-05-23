import { Trade } from '@weconomy/router-sdk'
import { Currency, Percent } from '@weconomy/sdk-core'
import {
  OnTxSuccess,
  TradeType,
  Transaction,
  TransactionEventHandlers,
  TransactionInfo,
  TransactionType,
  TransactionType as WidgetTransactionType,
} from '@pollum-io/widgets'
import { useWeb3React } from '@web3-react/core'
import {
  formatPercentInBasisPointsNumber,
  formatSwapSignedAnalyticsEventProperties,
  formatToDecimal,
  getTokenAddress,
} from 'lib/utils/analytics'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder } from 'state/transactions/hooks'
import {
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionType as AppTransactionType,
  WrapTransactionInfo,
} from 'state/transactions/types'
import { currencyId } from 'utils/currencyId'
import { computeRealizedPriceImpact } from 'utils/prices'

interface AnalyticsEventProps {
  trade: Trade<Currency, Currency, TradeType>
  gasUsed?: string
  blockNumber?: number
  hash?: string
  allowedSlippage: Percent
  succeeded: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formatAnalyticsEventProperties = ({
  trade,
  hash,
  allowedSlippage,
  succeeded,
  gasUsed,
  blockNumber,
}: AnalyticsEventProps) => ({
  estimated_network_fee_usd: gasUsed,
  transaction_hash: hash,
  token_in_address: getTokenAddress(trade.inputAmount.currency),
  token_out_address: getTokenAddress(trade.outputAmount.currency),
  token_in_symbol: trade.inputAmount.currency.symbol,
  token_out_symbol: trade.outputAmount.currency.symbol,
  token_in_amount: formatToDecimal(trade.inputAmount, trade.inputAmount.currency.decimals),
  token_out_amount: formatToDecimal(trade.outputAmount, trade.outputAmount.currency.decimals),
  price_impact_basis_points: formatPercentInBasisPointsNumber(computeRealizedPriceImpact(trade)),
  allowed_slippage_basis_points: formatPercentInBasisPointsNumber(allowedSlippage),
  chain_id:
    trade.inputAmount.currency.chainId === trade.outputAmount.currency.chainId
      ? trade.inputAmount.currency.chainId
      : undefined,
  swap_quote_block_number: blockNumber,
  succeeded,
})

/** Integrates the Widget's transactions, showing the widget's transactions in the app. */
export function useSyncWidgetTransactions() {
  const { chainId } = useWeb3React()
  const addTransaction = useTransactionAdder()

  const onTxSubmit = useCallback(
    (_hash: string, transaction: Transaction<TransactionInfo>) => {
      const { type, response } = transaction.info

      if (!type || !response) {
        return
      } else if (type === WidgetTransactionType.WRAP || type === WidgetTransactionType.UNWRAP) {
        const { type, amount: transactionAmount } = transaction.info

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const eventProperties = {
          // get this info from widget handlers
          token_in_address: getTokenAddress(transactionAmount.currency),
          token_out_address: getTokenAddress(transactionAmount.currency.wrapped),
          token_in_symbol: transactionAmount.currency.symbol,
          token_out_symbol: transactionAmount.currency.wrapped.symbol,
          chain_id: transactionAmount.currency.chainId,
          amount: transactionAmount
            ? formatToDecimal(transactionAmount, transactionAmount?.currency.decimals)
            : undefined,
          type: type === WidgetTransactionType.WRAP ? TransactionType.WRAP : TransactionType.UNWRAP,
        }
        const { amount } = transaction.info
        addTransaction(response, {
          type: AppTransactionType.WRAP,
          unwrapped: type === WidgetTransactionType.UNWRAP,
          currencyAmountRaw: amount.quotient.toString(),
          chainId,
        } as WrapTransactionInfo)
      } else if (type === WidgetTransactionType.SWAP) {
        const { slippageTolerance, trade, tradeType } = transaction.info

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const eventProperties = {
        //   ...formatSwapSignedAnalyticsEventProperties({
        //     trade,
        //     // TODO: add once Widgets adds fiat values to callback
        //     fiatValues: { amountIn: undefined, amountOut: undefined },
        //     txHash: transaction.receipt?.transactionHash ?? '',
        //   }),
        // }
        const baseTxInfo = {
          type: AppTransactionType.SWAP,
          tradeType,
          inputCurrencyId: currencyId(trade.inputAmount.currency),
          outputCurrencyId: currencyId(trade.outputAmount.currency),
        }
        if (tradeType === TradeType.EXACT_OUTPUT) {
          addTransaction(response, {
            ...baseTxInfo,
            maximumInputCurrencyAmountRaw: trade.maximumAmountIn(slippageTolerance).quotient.toString(),
            outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
          } as ExactOutputSwapTransactionInfo)
        } else {
          addTransaction(response, {
            ...baseTxInfo,
            inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(slippageTolerance).quotient.toString(),
          } as ExactInputSwapTransactionInfo)
        }
      }
    },
    [addTransaction, chainId]
  )

  const onTxSuccess: OnTxSuccess = useCallback((hash: string, tx) => {
    if (tx.info.type === TransactionType.SWAP) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { trade, slippageTolerance } = tx.info
    }
  }, [])

  const txHandlers: TransactionEventHandlers = useMemo(() => ({ onTxSubmit, onTxSuccess }), [onTxSubmit, onTxSuccess])

  return { transactions: { ...txHandlers } }
}
