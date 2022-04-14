import * as companyRepo from "../repositories/companyRepository.js";

export async function createCard(
  employee: number,
  cardType: string,
  apiKey: string
) {
  const company = companyRepo.findByApiKey(apiKey);
  if (!company) {
    throw {
      type: "not_found",
      message: "The company api-key is not registered or does not exist",
    };
  }
}
