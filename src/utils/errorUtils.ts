export function notFoundError(message: string) {
  return { type: "not_found", message };
}

export function forbidenError(message: string) {
  return { type: "forbiden", message };
}
