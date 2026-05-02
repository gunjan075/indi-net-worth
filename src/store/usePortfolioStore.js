import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { instrumentTemplates, sampleInvestments, scenarioPresets } from '../features/investments/instrumentConfig';

const normalizeInvestment = (investment) => {
  const template = instrumentTemplates[investment.type] ?? {};
  const merged = { ...template, ...investment };

  if (merged.type === 'gratuity') {
    return {
      ...merged,
      contribution: 0,
      contributionMode: 'none',
      expectedReturn: 0,
      currentAge: 33,
      maturityAge: 55,
      maxContributionYears: 22,
      basicDaMonthly: 180000,
      basicDaGrowth: merged.basicDaGrowth ?? merged.salaryGrowth ?? 7,
      gratuityDivisor: merged.gratuityDivisor ?? 26,
      gratuityTaxExemption: merged.gratuityTaxExemption ?? 2000000,
    };
  }

  if (merged.type === 'epf') {
    return {
      ...merged,
      currentValue: 1837505,
      contribution: 33000,
      contributionMode: 'monthly',
      currentAge: 33,
      maturityAge: 58,
      maxContributionYears: 25,
      employerContributionRate: 0,
      epsMonthlyContribution: 1250,
      epsSalaryCapMonthly: 15000,
      epsPensionableSalaryMonthly: 15000,
      epsYearsOfService: merged.epsYearsOfService ?? merged.yearsOfService ?? 6,
      epsPensionAge: 58,
      epsEarlyPensionAge: 50,
      epsMinimumPension: 1000,
    };
  }

  return {
    ...merged,
    currentAge: merged.currentAge === 32 ? 33 : merged.currentAge,
  };
};

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      investments: sampleInvestments,
      horizonYears: 20,
      inflationAdjusted: false,
      inflationRate: 6,
      darkMode: false,
      scenario: 'moderate',
      addInvestment: (type) => {
        const template = instrumentTemplates[type];
        set({ investments: [...get().investments, { ...template, id: crypto.randomUUID() }] });
      },
      updateInvestment: (id, patch) => {
        set({ investments: get().investments.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
      },
      removeInvestment: (id) => {
        set({ investments: get().investments.filter((item) => item.id !== id) });
      },
      applyScenario: (scenario) => {
        const preset = scenarioPresets[scenario];
        set({
          scenario,
          investments: get().investments.map((item) => ({
            ...item,
            expectedReturn: preset.returns[item.type] ?? item.expectedReturn,
          })),
        });
      },
      setHorizonYears: (horizonYears) => set({ horizonYears }),
      setInflationAdjusted: (inflationAdjusted) => set({ inflationAdjusted }),
      setInflationRate: (inflationRate) => set({ inflationRate }),
      setDarkMode: (darkMode) => set({ darkMode }),
      reset: () => set({ investments: sampleInvestments, horizonYears: 20, inflationAdjusted: false, inflationRate: 6, scenario: 'moderate' }),
    }),
    {
      name: 'indi-net-worth-profile',
      version: 3,
      migrate: (persistedState) => ({
        ...persistedState,
        investments: (persistedState.investments ?? sampleInvestments).map(normalizeInvestment),
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.investments) {
          state.investments = state.investments.map(normalizeInvestment);
        }
      },
    },
  ),
);
