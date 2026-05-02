import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { instrumentTemplates, sampleInvestments, scenarioPresets } from '../features/investments/instrumentConfig';

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
    { name: 'indi-net-worth-profile' },
  ),
);
