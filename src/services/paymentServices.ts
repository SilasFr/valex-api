import * as cardRepo from "../repositories/cardRepository.js";
import * as paymentRepo from "../repositories/paymentRepository.js";
import * as businessesRepo from "../repositories/businessRepository.js";
import * as errorUtils from "../utils/errorUtils.js";
import { getExtract, verifyEpirationDate } from "./cardsServices.js";
import bcrypt from "bcrypt";

export async function buy(
  cardId: number,
  password: string,
  amount: number,
  businessId: number
) {
  const card: cardRepo.Card = await verifyCard(cardId);

  await verifyEpirationDate(card.expirationDate);

  await verifyCardPassword(password, card);

  await verifyBusiness(businessId, card);

  await verifyCardBalance(cardId, amount);

  const paymentData = { cardId, businessId, amount };

  await paymentRepo.insert(paymentData);
}

async function verifyCardBalance(cardId: number, amount: number) {
  const { balance } = await getExtract(cardId);

  if (amount > balance) {
    throw errorUtils.forbidenError("Insuficient funds");
  }
}

async function verifyCardPassword(password: string, card: cardRepo.Card) {
  const passwordIsValid: boolean = bcrypt.compareSync(password, card.password);
  if (!passwordIsValid) {
    throw errorUtils.forbidenError("Invalid password");
  }
}

async function verifyCard(cardId: number) {
  const card: cardRepo.Card = await cardRepo.findById(cardId);
  if (!card) {
    throw errorUtils.notFoundError("Card not found");
  }
  return card;
}

async function verifyBusiness(businessId: number, card: cardRepo.Card) {
  const business: businessesRepo.Business = await businessesRepo.findById(
    businessId
  );
  if (!business) {
    throw errorUtils.notFoundError("Company not found");
  }
  if (card.type !== business.type) {
    throw errorUtils.forbidenError("Card not allowed in this business type");
  }
}
