import { toNumber } from './formatters';

const annualContribution = (instrument) => {
  const amount = toNumber(instrument.contribution);
  if (instrument.contributionMode === 'monthly') return amount * 12;
  if (instrument.contributionMode === 'yearly') return amount;
  return 0;
};

export function calculateCompoundGrowth(principal, annualRate, years) {
  return toNumber(principal) * (1 + toNumber(annualRate) / 100) ** years;
}

export function calculateSIP(monthlyContribution, annualRate, years) {
  const months = years * 12;
  const monthlyRate = toNumber(annualRate) / 100 / 12;
  const pmt = toNumber(monthlyContribution);
  if (months <= 0) return 0;
  if (monthlyRate === 0) return pmt * months;
  // SIP future value assumes each monthly contribution compounds after deposit.
  return pmt * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
}

export function calculateEPF(instrument, year) {
  const salary = toNumber(instrument.salaryAnnual) * (1 + toNumber(instrument.salaryGrowth) / 100) ** Math.max(0, year - 1);
  const employee = annualContribution(instrument);
  const employer = salary * (toNumber(instrument.employerContributionRate, 3.67) / 100);
  const yearlyContribution = employee + employer;
  return calculateCompoundGrowth(instrument.currentValue, instrument.expectedReturn, year) + calculateYearlyAnnuity(yearlyContribution, instrument.expectedReturn, year);
}

export function calculateNPS(instrument, year) {
  return calculateGenericInstrument(instrument, year);
}

export function calculateGratuity(instrument, year) {
  const serviceYears = toNumber(instrument.yearsOfService) + year;
  if (serviceYears < 5) return 0;
  const monthlyBasic = (toNumber(instrument.salaryAnnual) * (1 + toNumber(instrument.salaryGrowth) / 100) ** year) / 12;
  // Indian gratuity formula approximation: last drawn basic+DA * 15 / 26 * completed service years.
  return monthlyBasic * (15 / 26) * serviceYears;
}

export function calculateYearlyAnnuity(yearlyContribution, annualRate, years) {
  const rate = toNumber(annualRate) / 100;
  const pmt = toNumber(yearlyContribution);
  if (years <= 0) return 0;
  if (rate === 0) return pmt * years;
  return pmt * (((1 + rate) ** years - 1) / rate);
}

export function calculateGenericInstrument(instrument, year) {
  const currentGrowth = calculateCompoundGrowth(instrument.currentValue, instrument.expectedReturn, year);
  if (instrument.contributionMode === 'monthly') {
    return currentGrowth + calculateSIP(instrument.contribution, instrument.expectedReturn, year);
  }
  return currentGrowth + calculateYearlyAnnuity(annualContribution(instrument), instrument.expectedReturn, year);
}

export function calculateInstrumentValue(instrument, year) {
  if (instrument.type === 'gratuity') return calculateGratuity(instrument, year);
  if (instrument.type === 'epf') return calculateEPF(instrument, year);
  if (instrument.type === 'nps') return calculateNPS(instrument, year);
  return calculateGenericInstrument(instrument, year);
}

export function aggregateNetWorth({ investments, horizonYears, inflationAdjusted = false, inflationRate = 6 }) {
  const years = Array.from({ length: horizonYears + 1 }, (_, year) => {
    const row = { year, label: year === 0 ? 'Today' : `Year ${year}` };
    let total = 0;
    investments.forEach((instrument) => {
      const value = year === 0 ? toNumber(instrument.currentValue) : calculateInstrumentValue(instrument, year);
      row[instrument.name] = value;
      total += value;
    });
    const discountFactor = inflationAdjusted ? (1 + toNumber(inflationRate) / 100) ** year : 1;
    row.total = total / discountFactor;
    row.nominalTotal = total;
    return row;
  });

  const finalRow = years[years.length - 1] ?? { total: 0 };
  const breakdown = investments.map((instrument) => ({
    name: instrument.name,
    type: instrument.type,
    category: instrument.category,
    value: finalRow[instrument.name] || 0,
  }));

  return { years, breakdown, currentTotal: years[0]?.total || 0, projectedTotal: finalRow.total };
}

export function compareScenarios(investments, horizonYears, presets) {
  return Object.entries(presets).map(([id, preset]) => {
    const adjusted = investments.map((item) => ({
      ...item,
      expectedReturn: preset.returns[item.type] ?? item.expectedReturn,
    }));
    const projection = aggregateNetWorth({ investments: adjusted, horizonYears });
    return { id, name: preset.label, value: projection.projectedTotal };
  });
}
