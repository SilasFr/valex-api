import * as companyRepo from "../repositories/companyRepository.js";
import * as employeeRepo from "../repositories/employeeRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";
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

  let cardholderName = await genCardName(employee);

  const newCard: cardRepo.CardInsertData = {
    employeeId,
    number: faker.finance.creditCardNumber("Mastercard"),
    cardholderName: cardholderName.join(" ").toUpperCase(),
    securityCode: bcrypt.hashSync(faker.finance.creditCardCVV(), 10),
    expirationDate: dayjs(Date.now()).add(5, "year").format("MM/YY"),
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: true,
    type: cardType,
  };

  await cardRepo.insert(newCard);
  return;
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
  return cardholderName;
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

async function verifyEpirationDate(date: string) {
  const date1 = dayjs(date);
  const date2 = dayjs(Date.now());

  if (date1.diff(date2, "month") > 0) {
    throw errorUtils.forbidenError("Card has already expired");
  }
}
