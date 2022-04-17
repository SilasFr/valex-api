import * as companyRepo from "../repositories/companyRepository.js";
import * as errorUtils from "../utils/errorUtils.js";

export async function validate(apiKey: string) {
  const validation = await companyRepo.findByApiKey(apiKey);
  if (!validation) {
    throw errorUtils.authError("API key doesn't belong to any company");
  }
}
