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

  let cardholderName = [];
  let fullName = employee.fullName.split(" ");
  fullName.map((word: string, i) => {
    if (i === 0 || word === fullName[fullName.length - 1]) {
      return cardholderName.push(word);
    } else if (word.length > 2) {
      return cardholderName.push(word[0]);
    }
  });

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
