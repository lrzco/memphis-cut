import { z } from 'zod';
import { sanitize, limitInputLength } from './security';

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, 'L\'email est requis')
  .email('Adresse email invalide')
  .max(255, 'Email trop long')
  .transform((val) => sanitize(val.toLowerCase().trim()));

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Mot de passe trop long')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Nom trop long')
  .transform((val) => sanitize(limitInputLength(val.trim(), 100)));

// Phone validation schema
export const phoneSchema = z
  .string()
  .min(1, 'Le téléphone est requis')
  .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro de téléphone invalide')
  .transform((val) => sanitize(val.replace(/\s/g, '')));

// Registration form schema
export const registrationSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// Booking form schema
export const bookingSchema = z.object({
  service: z.string().min(1, 'Veuillez sélectionner un service'),
  barber: z.string().min(1, 'Veuillez sélectionner un barbier'),
  date: z.string().min(1, 'Veuillez sélectionner une date'),
  time: z.string().min(1, 'Veuillez sélectionner un horaire'),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type BookingData = z.infer<typeof bookingSchema>;
