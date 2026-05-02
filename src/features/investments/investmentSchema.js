import { z } from 'zod';

export const investmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(2, 'Category is required'),
  currentValue: z.coerce.number().min(0),
  contribution: z.coerce.number().min(0),
  contributionMode: z.enum(['monthly', 'yearly', 'none']),
  expectedReturn: z.coerce.number().min(0).max(40),
  lockInYears: z.coerce.number().min(0).max(60),
  salaryAnnual: z.coerce.number().min(0).optional(),
  salaryGrowth: z.coerce.number().min(0).max(30).optional(),
  yearsOfService: z.coerce.number().min(0).max(60).optional(),
  employerContributionRate: z.coerce.number().min(0).max(12).optional(),
});
