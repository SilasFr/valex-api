import * as cardRepo from "../repositories/cardRepository.js";
import * as errorUtils from "../utils/errorUtils.js";

export async function buy(cardId: number, amount: number, businessId: number) {
  const card: cardRepo.Card = await cardRepo.findById(cardId);
  if (!card) {
    throw errorUtils.notFoundError("Card not found");
  }
}
