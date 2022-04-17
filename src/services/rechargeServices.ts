import dayjs from "dayjs";
import * as rechargeRepo from "../repositories/rechargeRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";
import * as errorUtils from "../utils/errorUtils.js";

export async function recharge(cardId: number, amount: number) {
  const card: cardRepo.Card = await cardRepo.findById(cardId);
  if (!card) {
    throw errorUtils.notFoundError("Card not found");
  }
  verifyEpirationDate(card.expirationDate);

  const rechargeData: rechargeRepo.RechargeInsertData = { cardId, amount };
  await rechargeRepo.insert(rechargeData);
}

async function verifyEpirationDate(date: string) {
  const date1 = dayjs(date);
  const date2 = dayjs(Date.now()).format("MM/YY");

  if (date1.diff(date2, "month") < 0) {
    throw errorUtils.forbidenError("Card has already expired");
  }
}
