import {
  ApprovalForAll as ApprovalForAllEvent,
  ConditionPreparation as ConditionPreparationEvent,
  ConditionResolution as ConditionResolutionEvent,
  PayoutRedemption as PayoutRedemptionEvent,
  PositionSplit as PositionSplitEvent,
  PositionsMerge as PositionsMergeEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent
} from "../generated/ConditionalTokens/ConditionalTokens"
import {
  ApprovalForAll,
  ConditionPreparation,
  ConditionResolution,
  PayoutRedemption,
  PositionSplit,
  PositionsMerge,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/schema"

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved
  entity.save()
}

export function handleConditionPreparation(
  event: ConditionPreparationEvent
): void {
  let entity = new ConditionPreparation(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.conditionId = event.params.conditionId
  entity.oracle = event.params.oracle
  entity.questionId = event.params.questionId
  entity.outcomeSlotCount = event.params.outcomeSlotCount
  entity.save()
}

export function handleConditionResolution(
  event: ConditionResolutionEvent
): void {
  let entity = new ConditionResolution(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.conditionId = event.params.conditionId
  entity.oracle = event.params.oracle
  entity.questionId = event.params.questionId
  entity.outcomeSlotCount = event.params.outcomeSlotCount
  entity.payoutNumerators = event.params.payoutNumerators
  entity.save()
}

export function handlePayoutRedemption(event: PayoutRedemptionEvent): void {
  let entity = new PayoutRedemption(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.redeemer = event.params.redeemer
  entity.collateralToken = event.params.collateralToken
  entity.parentCollectionId = event.params.parentCollectionId
  entity.conditionId = event.params.conditionId
  entity.indexSets = event.params.indexSets
  entity.payout = event.params.payout
  entity.save()
}

export function handlePositionSplit(event: PositionSplitEvent): void {
  let entity = new PositionSplit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.stakeholder = event.params.stakeholder
  entity.collateralToken = event.params.collateralToken
  entity.parentCollectionId = event.params.parentCollectionId
  entity.conditionId = event.params.conditionId
  entity.partition = event.params.partition
  entity.amount = event.params.amount
  entity.save()
}

export function handlePositionsMerge(event: PositionsMergeEvent): void {
  let entity = new PositionsMerge(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.stakeholder = event.params.stakeholder
  entity.collateralToken = event.params.collateralToken
  entity.parentCollectionId = event.params.parentCollectionId
  entity.conditionId = event.params.conditionId
  entity.partition = event.params.partition
  entity.amount = event.params.amount
  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values
  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.id = event.params.id
  entity.value = event.params.value
  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.value = event.params.value
  entity.id = event.params.id
  entity.save()
}
