import { useMemo } from 'react';
import { aggregateNetWorth, compareScenarios } from '../utils/financial';
import { scenarioPresets } from '../features/investments/instrumentConfig';

export function useProjection(investments, horizonYears, inflationAdjusted, inflationRate) {
  return useMemo(
    () => ({
      projection: aggregateNetWorth({ investments, horizonYears, inflationAdjusted, inflationRate }),
      comparisons: compareScenarios(investments, horizonYears, scenarioPresets),
    }),
    [investments, horizonYears, inflationAdjusted, inflationRate],
  );
}
