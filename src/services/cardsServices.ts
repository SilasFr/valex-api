import * as companyRepo from "../repositories/companyRepository.js";
import * as employeeRepo from "../repositories/employeeRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";

export async function createCard(
  employeeId: number,
  cardType: cardRepo.TransactionTypes,
  apiKey: string
) {
  const company = await companyRepo.findByApiKey(apiKey);
  if (!company) {
    throw {
      type: "not_found",
      message: "The company api-key is not registered or does not exist",
    };
  }

  const employee = await employeeRepo.findById(employeeId);
  if (!employee) {
    throw {
      type: "not_found",
      message: "The employee id is not registered or does not exist",
    };
  }

  const validateCardTypeByEmployee = await cardRepo.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );

  if (validateCardTypeByEmployee) {
    throw {
      type: "forbiden",
      message: "Cannot register the same Transaction Type twice per employee",
    };
  }

  const creditCardBrand = "Mastercard";
  let cardholderName = [];
  employee.fullName.split(" ").map((word: string, i) => {
    if (i === 0 || i === employee.fullName.length - 1) {
      cardholderName.push(word);
    } else {
      cardholderName.push(word[0]);
    }
  });

  //   const newCard: cardRepo.CardInsertData = {
  //     employeeId,
  //     number,
  //     cardholderName: cardholderName.join(' ').toUpperCase(),
  //     securityCode,
  //     expirationDate: ,
  //     password,
  //     isVirtual,
  //     originalCardId,
  //     isBlocked: true,
  //     type: cardType,
  //   };
}
