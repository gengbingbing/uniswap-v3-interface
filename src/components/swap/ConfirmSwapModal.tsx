import { Trans } from '@lingui/macro'
import { Trade } from '@weconomy/router-sdk'
import { Currency, Percent, TradeType } from '@weconomy/sdk-core'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { InterfaceTrade } from 'state/routing/types'
import { tradeMeaningfullyDiffers } from 'utils/tradeMeaningFullyDiffer'

import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from '../TransactionConfirmationModal'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'

export default function ConfirmSwapModal({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  onDismiss,
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  swapQuoteReceivedDate,
  fiatValueInput,
  fiatValueOutput,
}: {
  isOpen: boolean
  trade?: InterfaceTrade<Currency, Currency, TradeType>
  originalTrade?: Trade<Currency, Currency, TradeType>
  attemptingTxn: boolean
  txHash?: string
  recipient: string | null
  allowedSlippage: Percent
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: ReactNode
  onDismiss: () => void
  swapQuoteReceivedDate?: Date
  fiatValueInput: { data?: number; isLoading: boolean }
  fiatValueOutput: { data?: number; isLoading: boolean }
}) {
  // shouldLogModalCloseEvent lets the child SwapModalHeader component know when modal has been closed
  // and an event triggered by modal closing should be logged.
  const [shouldLogModalCloseEvent, setShouldLogModalCloseEvent] = useState(false)
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade]
  )

  const onModalDismiss = useCallback(() => {
    if (isOpen) setShouldLogModalCloseEvent(true)
    onDismiss()
  }, [isOpen, onDismiss])

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        trade={trade}
        shouldLogModalCloseEvent={shouldLogModalCloseEvent}
        setShouldLogModalCloseEvent={setShouldLogModalCloseEvent}
        allowedSlippage={allowedSlippage}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [allowedSlippage, onAcceptChanges, recipient, showAcceptChanges, trade, shouldLogModalCloseEvent])

  const modalBottom = useCallback(() => {
    return trade ? (
      <SwapModalFooter
        onConfirm={onConfirm}
        trade={trade}
        hash={txHash}
        allowedSlippage={allowedSlippage}
        disabledConfirm={showAcceptChanges}
        swapErrorMessage={swapErrorMessage}
        swapQuoteReceivedDate={swapQuoteReceivedDate}
        fiatValueInput={fiatValueInput}
        fiatValueOutput={fiatValueOutput}
      />
    ) : null
  }, [
    onConfirm,
    showAcceptChanges,
    swapErrorMessage,
    trade,
    allowedSlippage,
    txHash,
    swapQuoteReceivedDate,
    fiatValueInput,
    fiatValueOutput,
  ])

  // text to show while loading
  const pendingText = (
    <Trans>
      Swapping {trade?.inputAmount?.toSignificant(6)} {trade?.inputAmount?.currency?.symbol} for{' '}
      {trade?.outputAmount?.toSignificant(6)} {trade?.outputAmount?.currency?.symbol}
    </Trans>
  )

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent onDismiss={onModalDismiss} message={swapErrorMessage} />
      ) : (
        <ConfirmationModalContent
          title={<Trans>Confirm Swap</Trans>}
          onDismiss={onModalDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onModalDismiss, modalBottom, modalHeader, swapErrorMessage]
  )

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onModalDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
      currencyToAdd={trade?.outputAmount.currency}
    />
  )
}
