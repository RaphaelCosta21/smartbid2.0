/**
 * Validators — input validation helpers.
 * Lightweight custom validators (no Zod dependency in SPFx).
 */

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRequired(
  value: string | null | undefined,
  fieldName: string,
): string | null {
  if (!value || value.trim() === "") return `${fieldName} is required.`;
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email format.";
  return null;
}

export function validateBidNumber(bidNumber: string): string | null {
  if (!bidNumber) return "BID number is required.";
  const re = /^BID-\d{4}-\d{3,4}$/;
  if (!re.test(bidNumber))
    return "BID number must follow the format BID-YYYY-NNN.";
  return null;
}

export function validateDateRange(
  startDate: string,
  endDate: string,
): string | null {
  if (!startDate || !endDate) return null;
  if (new Date(endDate) < new Date(startDate))
    return "End date must be after start date.";
  return null;
}

export function validatePositiveNumber(
  value: number,
  fieldName: string,
): string | null {
  if (value < 0) return `${fieldName} must be a positive number.`;
  return null;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string,
): string | null {
  if (value && value.length > max)
    return `${fieldName} must be at most ${max} characters.`;
  return null;
}

export function validateBidRequest(data: {
  client?: string;
  projectName?: string;
  division?: string;
  desiredDueDate?: string;
}): IValidationResult {
  const errors: string[] = [];
  const r1 = validateRequired(data.client, "Client");
  if (r1) errors.push(r1);
  const r2 = validateRequired(data.projectName, "Project Name");
  if (r2) errors.push(r2);
  const r3 = validateRequired(data.division, "Division");
  if (r3) errors.push(r3);
  const r4 = validateRequired(data.desiredDueDate, "Desired Due Date");
  if (r4) errors.push(r4);
  return { isValid: errors.length === 0, errors };
}

export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}
