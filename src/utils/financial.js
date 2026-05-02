import { toNumber } from './formatters';

const annualContribution = (instrument) => {
  const amount = toNumber(instrument.contribution);
  if (instrument.contributionMode === 'monthly') return amount * 12;
  if (instrument.contributionMode === 'yearly') return amount;
  return 0;
};

const contributionYears = (instrument, year) => {
  const maxByRule = toNumber(instrument.maxContributionYears, year);
  const currentAge = toNumber(instrument.currentAge);
  const maturityAge = toNumber(instrument.maturityAge, currentAge + year);
  const maxByAge = Math.max(0, maturityAge - currentAge);
  const allowedYears = Math.min(year, maxByRule, maxByAge);
  return Math.max(0, allowedYears);
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
  const rate = toNumber(instrument.expectedReturn) / 100;
  let futureValue = calculateCompoundGrowth(instrument.currentValue, instrument.expectedReturn, year);
  const activeYears = contributionYears(instrument, year);

  for (let contributionYear = 1; contributionYear <= activeYears; contributionYear += 1) {
    const salary = toNumber(instrument.salaryAnnual) * (1 + toNumber(instrument.salaryGrowth) / 100) ** Math.max(0, contributionYear - 1);
    const employee = annualContribution(instrument);
    const employer = salary * (toNumber(instrument.employerContributionRate, 3.67) / 100);
    futureValue += (employee + employer) * (1 + rate) ** (year - contributionYear);
  }

  return futureValue;
}

export function calculateEPSMonthlyContribution(instrument) {
  const pensionableSalary = Math.min(toNumber(instrument.epsPensionableSalaryMonthly, 15000), toNumber(instrument.epsSalaryCapMonthly, 15000));
  return Math.min(1250, pensionableSalary * 0.0833);
}

export function calculateEPSMonthlyPension(instrument, year = 0, pensionStartAge = null) {
  const currentAge = toNumber(instrument.currentAge, 33);
  const fullPensionAge = toNumber(instrument.epsPensionAge, 58);
  const targetAge = pensionStartAge ?? fullPensionAge;
  const yearsUntilTarget = Math.max(0, Math.min(year, targetAge - currentAge));
  const rawServiceYears = toNumber(instrument.epsYearsOfService, instrument.yearsOfService) + yearsUntilTarget;
  const completedYears = Math.floor(rawServiceYears);
  const serviceFraction = rawServiceYears - completedYears;
  const pensionableService = completedYears + (serviceFraction > 0.5 ? 1 : 0);

  if (pensionableService < 10) return 0;

  const pensionableSalary = Math.min(toNumber(instrument.epsPensionableSalaryMonthly, 15000), toNumber(instrument.epsSalaryCapMonthly, 15000));
  const basePension = (pensionableSalary * pensionableService) / 70;
  const earlyReductionYears = Math.max(0, fullPensionAge - targetAge);
  const reducedPension = basePension * (1 - earlyReductionYears * 0.04);
  return Math.max(toNumber(instrument.epsMinimumPension, 1000), reducedPension);
}

export function calculateNPS(instrument, year) {
  return calculateGenericInstrument(instrument, year);
}

export function calculateGratuity(instrument, year) {
  const currentAge = toNumber(instrument.currentAge, 33);
  const maturityAge = toNumber(instrument.maturityAge, 55);
  const payableYears = Math.max(0, Math.min(year, maturityAge - currentAge));
  const rawServiceYears = toNumber(instrument.yearsOfService) + payableYears;
  const completedYears = Math.floor(rawServiceYears);
  const serviceFraction = rawServiceYears - completedYears;
  const serviceYears = completedYears + (serviceFraction > 0.5 ? 1 : 0);
  if (serviceYears < 5) return 0;
  const monthlyBasicDa = toNumber(instrument.basicDaMonthly, toNumber(instrument.salaryAnnual, 0) / 12);
  const growthRate = toNumber(instrument.basicDaGrowth, toNumber(instrument.salaryGrowth)) / 100;
  const lastDrawnSalary = monthlyBasicDa * (1 + growthRate) ** payableYears;
  const divisor = toNumber(instrument.gratuityDivisor, 26);
  // Gratuity is an employer-paid benefit: 15 days of last drawn Basic + DA per completed service year.
  return (15 * lastDrawnSalary * serviceYears) / divisor;
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
  const activeYears = contributionYears(instrument, year);
  const yearsAfterLastContribution = year - activeYears;
  if (instrument.contributionMode === 'monthly') {
    const sipValueAtStop = calculateSIP(instrument.contribution, instrument.expectedReturn, activeYears);
    return currentGrowth + calculateCompoundGrowth(sipValueAtStop, instrument.expectedReturn, yearsAfterLastContribution);
  }
  const annuityValueAtStop = calculateYearlyAnnuity(annualContribution(instrument), instrument.expectedReturn, activeYears);
  return currentGrowth + calculateCompoundGrowth(annuityValueAtStop, instrument.expectedReturn, yearsAfterLastContribution);
}

export function calculateRentIncome(instrument, year) {
  const corpusGrowth = calculateCompoundGrowth(instrument.currentValue, instrument.expectedReturn, year);
  const rate = toNumber(instrument.rentalYieldReinvestRate, toNumber(instrument.expectedReturn)) / 100;
  const activeYears = contributionYears(instrument, year);
  let rentCorpus = 0;

  for (let rentYear = 1; rentYear <= activeYears; rentYear += 1) {
    const rent = toNumber(instrument.rentAnnual) * (1 + toNumber(instrument.rentGrowth) / 100) ** Math.max(0, rentYear - 1);
    rentCorpus += rent * (1 + rate) ** (year - rentYear);
  }

  return corpusGrowth + rentCorpus;
}

export function calculateRealEstateFlat(instrument, year) {
  const propertyValue = calculateCompoundGrowth(instrument.currentValue, instrument.expectedReturn, year);
  return propertyValue + calculateRentIncome({ ...instrument, currentValue: 0, expectedReturn: instrument.rentalYieldReinvestRate ?? instrument.expectedReturn }, year);
}

export function calculateInstrumentValue(instrument, year) {
  if (instrument.type === 'gratuity') return calculateGratuity(instrument, year);
  if (instrument.type === 'epf') return calculateEPF(instrument, year);
  if (instrument.type === 'nps') return calculateNPS(instrument, year);
  if (instrument.type === 'rent_income') return calculateRentIncome(instrument, year);
  if (instrument.type === 'real_estate_flat') return calculateRealEstateFlat(instrument, year);
  return calculateGenericInstrument(instrument, year);
}

export function aggregateNetWorth({ investments, horizonYears, inflationAdjusted = false, inflationRate = 6 }) {
  const years = Array.from({ length: horizonYears + 1 }, (_, year) => {
    const row = { year, label: year === 0 ? 'Today' : `Year ${year}` };
    let total = 0;
    investments.forEach((instrument) => {
      const rawValue = year === 0 && instrument.type !== 'gratuity' ? toNumber(instrument.currentValue) : calculateInstrumentValue(instrument, year);
      const value = Number.isFinite(rawValue) ? rawValue : 0;
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
