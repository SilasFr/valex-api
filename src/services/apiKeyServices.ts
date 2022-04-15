import * as companyRepo from "../repositories/companyRepository.js";
import * as errorUtils from "../utils/errorUtils.js";

export async function validate(apiKey: string) {
  const validation = companyRepo.findByApiKey(apiKey);
  if (!validation) {
    throw errorUtils.authError("API key doesnt belong to any company");
  }
}
