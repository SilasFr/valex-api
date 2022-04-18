import * as companyRepo from "../repositories/companyRepository.js";
import * as employeeRepo from "../repositories/employeeRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";
import * as paymentRepo from "../repositories/paymentRepository.js";
import * as rechargeRepo from "../repositories/rechargeRepository.js";
import * as errorUtils from "../utils/errorUtils.js";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

export async function createCard(
  employeeId: number,
  cardType: cardRepo.TransactionTypes,
  apiKey: string
) {
  const company = await companyRepo.findByApiKey(apiKey);
  if (!company) {
    throw errorUtils.notFoundError("companynot found");
  }

  const employee = await employeeRepo.findById(employeeId);
  if (!employee) {
    throw errorUtils.notFoundError("employee found");
  }

  const validateCardTypeByEmployee = await cardRepo.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );

  if (validateCardTypeByEmployee) {
    throw errorUtils.forbidenError(
      "Cannot register the same Transaction Type twice"
    );
  }

  const cardholderName: string = genCardName(employee);
  const number: string = faker.finance.creditCardNumber("Mastercard");
  const securityCode: string = faker.finance.creditCardCVV();
  const expirationDate: string = dayjs(Date.now())
    .add(5, "year")
    .format("MM/YY");

  const newCard: cardRepo.CardInsertData = {
    employeeId,
    number,
    cardholderName,
    securityCode: bcrypt.hashSync(securityCode, 10),
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: cardType,
  };

  await cardRepo.insert(newCard);
  return { cardholderName, number, securityCode, expirationDate };
}

function genCardName(employee: any) {
  let cardholderName = [];
  let fullName = employee.fullName.split(" ");
  fullName.map((word: string, i) => {
    if (i === 0 || word === fullName[fullName.length - 1]) {
      return cardholderName.push(word);
    } else if (word.length > 2) {
      return cardholderName.push(word[0]);
    }
  });
  return cardholderName.join(" ").toUpperCase();
}

export async function activateCard(cardData: any) {
  const { id, securityCode, password } = cardData;

  const registeredCard: cardRepo.Card = await cardRepo.findById(id);
  if (!registeredCard) {
    throw errorUtils.notFoundError("Card id not found");
  }

  verifyEpirationDate(registeredCard.expirationDate);

  if (registeredCard.password) {
    throw errorUtils.forbidenError("Card has already been activated");
  }

  verifySecurityCode(securityCode, registeredCard);

  await updatePassword(password, id);
}

async function updatePassword(password: string, id: number) {
  if (!(password.length === 4)) {
    throw errorUtils.forbidenError("Password must have 4 digits");
  }

  const encriptedPassword = bcrypt.hashSync(password, 10);
  await cardRepo.update(id, { password: encriptedPassword, isBlocked: false });
  return;
}

async function verifySecurityCode(
  securityCode: any,
  registeredCard: cardRepo.Card
) {
  const securityCodeIsValid = bcrypt.compareSync(
    securityCode,
    registeredCard.securityCode
  );
  if (!securityCodeIsValid) {
    throw errorUtils.forbidenError("Invalid CVC (Security code)");
  }
  return;
}

export async function verifyEpirationDate(date: string) {
  const date1 = dayjs(date);
  const date2 = dayjs(Date.now()).format("MM/YY");

  if (date1.diff(date2, "month") < 0) {
    throw errorUtils.forbidenError("Card has already expired");
  }
}

export async function getExtract(cardId: number) {
  const card: cardRepo.Card = await cardRepo.findById(cardId);
  if (!card) {
    throw errorUtils.notFoundError("Card not found");
  }

  const recharges: rechargeRepo.Recharge[] = await rechargeRepo.findByCardId(
    cardId
  );
  const totalRechargeAmount: number = recharges
    .map((row) => row.amount)
    .reduce((sum, current) => sum + current, 0);

  const transactions: paymentRepo.Payment[] = await paymentRepo.findByCardId(
    cardId
  );
  const totalTransactionsAmount: number = transactions
    .map((row) => row.amount)
    .reduce((sum, current) => sum + current, 0);

  const balance = totalRechargeAmount - totalTransactionsAmount;

  return { balance, transactions, recharges };
}
