/**
 * Validators — input validation helpers.
 * Lightweight custom validators (no Zod dependency in SPFx).
 */

export interface IValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRequired(
  value: string | undefined,
  fieldName: string,
): string | undefined {
  if (!value || value.trim() === "") return `${fieldName} is required.`;
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email format.";
  return undefined;
}

export function validateBidNumber(bidNumber: string): string | undefined {
  if (!bidNumber) return "BID number is required.";
  const re = /^BID-\d{4}-\d{3,4}$/;
  if (!re.test(bidNumber))
    return "BID number must follow the format BID-YYYY-NNN.";
  return undefined;
}

export function validateDateRange(
  startDate: string,
  endDate: string,
): string | undefined {
  if (!startDate || !endDate) return undefined;
  if (new Date(endDate) < new Date(startDate))
    return "End date must be after start date.";
  return undefined;
}

export function validatePositiveNumber(
  value: number,
  fieldName: string,
): string | undefined {
  if (value < 0) return `${fieldName} must be a positive number.`;
  return undefined;
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string,
): string | undefined {
  if (value && value.length > max)
    return `${fieldName} must be at most ${max} characters.`;
  return undefined;
}

export function validateBidRequest(data: {
  client?: string;
  projectName?: string;
  division?: string;
  projectDescription?: string;
  desiredDueDate?: string;
  serviceLine?: string;
  bidType?: string;
}): IValidationResult {
  const errors: string[] = [];
  const r1 = validateRequired(data.client, "Client");
  if (r1) errors.push(r1);
  const r2 = validateRequired(data.projectName, "Project Name");
  if (r2) errors.push(r2);
  const r3 = validateRequired(data.division, "Division");
  if (r3) errors.push(r3);
  const r4 = validateRequired(data.projectDescription, "Description");
  if (r4) errors.push(r4);
  const r5 = validateRequired(data.desiredDueDate, "Desired Due Date");
  if (r5) errors.push(r5);
  const r6 = validateRequired(data.serviceLine, "Service Line");
  if (r6) errors.push(r6);
  const r7 = validateRequired(data.bidType, "BID Type");
  if (r7) errors.push(r7);
  return { isValid: errors.length === 0, errors };
}

export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}
