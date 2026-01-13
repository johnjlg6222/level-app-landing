import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'L\'email est requis')
  .email('Email invalide');

/**
 * Phone validation schema (French format)
 */
export const phoneSchema = z
  .string()
  .min(1, 'Le téléphone est requis')
  .regex(
    /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    'Numéro de téléphone invalide'
  );

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Le nom est trop long');

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  phone: phoneSchema,
  company: z.string().optional(),
});

/**
 * Validate contact info
 */
export function validateContact(data: {
  email: string;
  name: string;
  phone: string;
  company?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const result = contactSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((err) => {
    if (err.path[0]) {
      errors[err.path[0] as string] = err.message;
    }
  });

  return { valid: false, errors };
}

/**
 * Validate email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const result = emailSchema.safeParse(email);

  if (result.success) {
    return { valid: true };
  }

  return { valid: false, error: result.error.issues[0]?.message };
}

/**
 * Validate phone
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  const result = phoneSchema.safeParse(phone);

  if (result.success) {
    return { valid: true };
  }

  return { valid: false, error: result.error.issues[0]?.message };
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Check if value is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string for safe display
 */
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Quote form validation schema
 */
export const quoteFormSchema = z.object({
  clientInfo: z.object({
    company: z.string().min(1, 'Le nom de l\'entreprise est requis'),
    contact: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    sector: z.string().min(1, 'Le secteur est requis'),
  }),
  projectContext: z.object({
    projectName: z.string().min(1, 'Le nom du projet est requis'),
    problemToSolve: z.string().min(10, 'Décrivez le problème à résoudre'),
    projectType: z.string().min(1, 'Le type de projet est requis'),
    targetUsers: z.string().min(1, 'Les utilisateurs cibles sont requis'),
  }),
});
