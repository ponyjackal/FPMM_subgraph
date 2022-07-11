import { BigInt, log } from "@graphprotocol/graph-ts";

import { FixedProductMarketMaker, Transaction } from "../generated/schema";
import { FPMMSingleBuy } from "../generated/BatchBet/BatchBet";
import { nthRoot } from "./utils/nth-root";
import {
  updateVolumes,
  updateLiquidityFields,
  updateFeeFields,
  calculatePrices,
} from "./utils/fpmm-utils";
import { updateMarketPositionFromTrade } from "./utils/market-positions-utils";
import { bigOne, TRADE_TYPE_BUY } from "./utils/constants";
import { getCollateralScale } from "./utils/collateralTokens";
import { updateGlobalVolume } from "./utils/global-utils";
import { increment } from "./utils/maths";
import {
  incrementAccountTrades,
  markAccountAsSeen,
  updateUserVolume,
} from "./utils/account-utils";

function recordBuy(event: FPMMSingleBuy): void {
  let buy = new Transaction(event.transaction.hash.toHexString());
  buy.type = TRADE_TYPE_BUY;
  buy.timestamp = event.block.timestamp;
  buy.market = event.params.market.toHexString();
  buy.user = event.params.buyer.toHexString();
  buy.tradeAmount = event.params.investmentAmount;
  buy.feeAmount = event.params.feeAmount;
  buy.outcomeIndex = event.params.outcomeIndex;
  buy.outcomeTokensAmount = event.params.outcomeTokensBought;
  buy.save();
}

export function handleSingleBuy(event: FPMMSingleBuy): void {
  let fpmmAddress = event.params.market.toHexString();
  let fpmm = FixedProductMarketMaker.load(fpmmAddress);
  if (fpmm == null) {
    log.error("cannot buy: FixedProductMarketMaker instance for {} not found", [
      fpmmAddress,
    ]);
    return;
  }

  let oldAmounts = fpmm.outcomeTokenAmounts;
  let investmentAmountMinusFees = event.params.investmentAmount.minus(
    event.params.feeAmount
  );

  let outcomeIndex = event.params.outcomeIndex.toI32();

  let newAmounts = new Array<BigInt>(oldAmounts.length);
  let amountsProduct = bigOne;
  for (let i = 0; i < newAmounts.length; i += 1) {
    if (i == outcomeIndex) {
      newAmounts[i] = oldAmounts[i]
        .plus(investmentAmountMinusFees)
        .minus(event.params.outcomeTokensBought);
    } else {
      newAmounts[i] = oldAmounts[i].plus(investmentAmountMinusFees);
    }
    amountsProduct = amountsProduct.times(newAmounts[i]);
  }
  fpmm.outcomeTokenAmounts = newAmounts;
  fpmm.outcomeTokenPrices = calculatePrices(newAmounts);
  let liquidityParameter = nthRoot(amountsProduct, newAmounts.length);
  let collateralScale = getCollateralScale(fpmm.collateralToken);
  let collateralScaleDec = collateralScale.toBigDecimal();
  updateLiquidityFields(
    fpmm as FixedProductMarketMaker,
    liquidityParameter,
    collateralScaleDec
  );

  updateVolumes(
    fpmm as FixedProductMarketMaker,
    event.block.timestamp,
    event.params.investmentAmount,
    collateralScaleDec,
    TRADE_TYPE_BUY
  );
  updateFeeFields(
    fpmm as FixedProductMarketMaker,
    event.params.feeAmount,
    collateralScaleDec
  );

  fpmm.tradesQuantity = increment(fpmm.tradesQuantity);
  fpmm.buysQuantity = increment(fpmm.buysQuantity);
  fpmm.save();

  updateUserVolume(
    event.params.buyer.toHexString(),
    event.params.investmentAmount,
    collateralScaleDec,
    event.block.timestamp
  );
  markAccountAsSeen(event.params.buyer.toHexString(), event.block.timestamp);
  incrementAccountTrades(
    event.params.buyer.toHexString(),
    event.block.timestamp
  );
  recordBuy(event);
  updateGlobalVolume(
    event.params.investmentAmount,
    event.params.feeAmount,
    collateralScaleDec,
    TRADE_TYPE_BUY
  );
  updateMarketPositionFromTrade(event);
}
