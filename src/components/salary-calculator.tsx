'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SalaryLabels {
  modeLabel: string;
  modeBrutToNet: string;
  modeNetToBrut: string;
  salaryLabel: string;
  salaryNetLabel: string;
  semesterLabel: string;
  semesterS1: string;
  semesterS2: string;
  dependentsLabel: string;
  dependents0: string;
  dependents1: string;
  dependents2: string;
  dependents3: string;
  dependents4: string;
  disabilityLabel: string;
  disabilityDescription: string;
  minimumWageLabel: string;
  minimumWageDescription: string;
  resultNetLabel: string;
  resultBrutLabel: string;
  resultContributionsLabel: string;
  resultTaxLabel: string;
  resultEmployerCostLabel: string;
  detailsTitle: string;
  detailsCAS: string;
  detailsCASS: string;
  detailsPersonalDeduction: string;
  detailsTaxableBase: string;
  detailsIncomeTax: string;
  detailsCAM: string;
  detailsNonTaxableAmount: string;
  detailsRate: string;
  detailsAmount: string;
  currency: string;
  showDetails: string;
  hideDetails: string;
}

interface SalaryCalculatorProps {
  labels: SalaryLabels;
}

// Semester configuration
const SEMESTERS = {
  S1: { minWage: 4050, nonTaxableAmount: 300, nonTaxableCeiling: 4300 },
  S2: { minWage: 4325, nonTaxableAmount: 200, nonTaxableCeiling: 4600 },
};

// Tax rates
const CAS_RATE = 0.25;
const CASS_RATE = 0.10;
const TAX_RATE = 0.10;
const CAM_RATE = 0.0225;

// Personal deduction bonus per dependent category (percentage points)
const DEPENDENT_BONUS: Record<number, number> = {
  0: 0,
  1: 5,
  2: 10,
  3: 15,
  4: 25,
};

/**
 * Calculate personal deduction percentage based on gross salary and dependents.
 * The deduction starts at a base rate at minimum wage and decreases by 0.5pp per 50 lei above minimum.
 * There are 40 brackets total. Above minWage + 2000, deduction is 0.
 */
function getPersonalDeductionPercent(gross: number, minWage: number, dependents: number): number {
  const maxEligible = minWage + 2000;
  if (gross > maxEligible) return 0;

  const baseAtMin = 20; // base percentage at minimum wage for 0 dependents
  const bonus = DEPENDENT_BONUS[Math.min(dependents, 4)] || 0;

  if (gross <= minWage) {
    return baseAtMin + bonus;
  }

  const overMin = gross - minWage;
  // Each 50 lei bracket reduces by 0.5pp
  const bracketIndex = Math.ceil(overMin / 50);
  const reduction = bracketIndex * 0.5;
  const basePercent = Math.max(0, baseAtMin - reduction);

  return Math.max(0, basePercent + bonus);
}

/**
 * Calculate net salary from gross (brut → net).
 */
function calculateBrutToNet(
  gross: number,
  semester: 'S1' | 'S2',
  dependents: number,
  hasDisability: boolean,
  isMinimumWage: boolean
) {
  const config = SEMESTERS[semester];

  let effectiveGross = gross;
  let nonTaxableAmount = 0;

  // Minimum wage non-taxable amount
  if (isMinimumWage && gross <= config.nonTaxableCeiling && gross === config.minWage) {
    nonTaxableAmount = config.nonTaxableAmount;
    effectiveGross = gross - nonTaxableAmount;
  }

  const cas = Math.round(effectiveGross * CAS_RATE * 100) / 100;
  const cass = Math.round(effectiveGross * CASS_RATE * 100) / 100;

  // Personal deduction applied to the full gross salary
  const deductionPercent = getPersonalDeductionPercent(gross, config.minWage, dependents);
  const personalDeduction = Math.round(gross * (deductionPercent / 100) * 100) / 100;

  // Taxable base
  const taxableBase = Math.max(0, effectiveGross - cas - cass - personalDeduction);

  // Income tax (0 for disability)
  const incomeTax = hasDisability ? 0 : Math.round(taxableBase * TAX_RATE * 100) / 100;

  // Net = gross - cas - cass - incomeTax
  // CAS and CASS are calculated on effectiveGross (gross - nonTaxableAmount)
  const actualNet = Math.round((gross - cas - cass - incomeTax) * 100) / 100;

  const cam = Math.round(gross * CAM_RATE * 100) / 100;
  const employerCost = Math.round((gross + cam) * 100) / 100;
  const totalContributions = Math.round((cas + cass + incomeTax) * 100) / 100;

  return {
    gross,
    net: actualNet,
    cas,
    cass,
    personalDeduction,
    taxableBase,
    incomeTax,
    cam,
    employerCost,
    totalContributions,
    nonTaxableAmount,
    deductionPercent,
  };
}

/**
 * Calculate gross salary from net (net → brut).
 * Uses algebraic solving + bracket search for personal deduction.
 */
function calculateNetToBrut(
  targetNet: number,
  semester: 'S1' | 'S2',
  dependents: number,
  hasDisability: boolean,
  isMinimumWage: boolean
): ReturnType<typeof calculateBrutToNet> {
  // For disability: net = gross - cas - cass = gross - 0.25*gross - 0.10*gross = 0.65*gross
  // (simplified without non-taxable amount and deductions affecting only tax which is 0)
  if (hasDisability && !isMinimumWage) {
    // net = gross - 0.25*gross - 0.10*gross = 0.65*gross
    const estimatedGross = targetNet / 0.65;
    return calculateBrutToNet(Math.round(estimatedGross * 100) / 100, semester, dependents, true, false);
  }

  // Binary search approach for precision
  let low = targetNet;
  let high = targetNet * 2.5;
  let bestResult = calculateBrutToNet(low, semester, dependents, hasDisability, isMinimumWage);

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const roundedMid = Math.round(mid * 100) / 100;
    const result = calculateBrutToNet(roundedMid, semester, dependents, hasDisability, isMinimumWage);

    if (Math.abs(result.net - targetNet) < 0.5) {
      bestResult = result;
      break;
    }

    if (result.net < targetNet) {
      low = mid;
    } else {
      high = mid;
    }
    bestResult = result;
  }

  return bestResult;
}

function formatNumber(value: number): string {
  return value.toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SalaryCalculator({ labels }: SalaryCalculatorProps) {
  const [mode, setMode] = useState<'brutToNet' | 'netToBrut'>('brutToNet');
  const [salary, setSalary] = useState<string>('5000');
  const [semester, setSemester] = useState<'S1' | 'S2'>('S2');
  const [dependents, setDependents] = useState<number>(0);
  const [hasDisability, setHasDisability] = useState(false);
  const [isMinimumWage, setIsMinimumWage] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => {
    const salaryValue = parseFloat(salary) || 0;
    if (salaryValue <= 0) return null;

    if (mode === 'brutToNet') {
      return calculateBrutToNet(salaryValue, semester, dependents, hasDisability, isMinimumWage);
    } else {
      return calculateNetToBrut(salaryValue, semester, dependents, hasDisability, isMinimumWage);
    }
  }, [salary, mode, semester, dependents, hasDisability, isMinimumWage]);

  return (
    <div className="w-full rounded-4xl bg-[var(--clr-neutral-900)] p-6 md:p-8">
      {/* Mode Toggle */}
      <div className="mb-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.modeLabel}
        </label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--clr-neutral-1000)] p-1">
          <button
            onClick={() => setMode('brutToNet')}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === 'brutToNet'
                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                : 'text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)]'
            }`}
          >
            {labels.modeBrutToNet}
          </button>
          <button
            onClick={() => setMode('netToBrut')}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === 'netToBrut'
                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                : 'text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)]'
            }`}
          >
            {labels.modeNetToBrut}
          </button>
        </div>
      </div>

      {/* Salary Input */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {mode === 'brutToNet' ? labels.salaryLabel : labels.salaryNetLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            min="0"
            className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--clr-neutral-100)]">
            {labels.currency}
          </span>
        </div>
      </div>

      {/* Semester Select */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.semesterLabel}
        </label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value as 'S1' | 'S2')}
          className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
        >
          <option value="S1" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
            {labels.semesterS1}
          </option>
          <option value="S2" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
            {labels.semesterS2}
          </option>
        </select>
      </div>

      {/* Dependents Select */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.dependentsLabel}
        </label>
        <select
          value={dependents}
          onChange={(e) => setDependents(parseInt(e.target.value))}
          className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
        >
          <option value={0} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.dependents0}</option>
          <option value={1} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.dependents1}</option>
          <option value={2} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.dependents2}</option>
          <option value={3} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.dependents3}</option>
          <option value={4} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.dependents4}</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="mb-6 space-y-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={hasDisability}
            onChange={(e) => setHasDisability(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded accent-[var(--clr-green-500)]"
          />
          <div>
            <span className="text-sm font-medium text-[var(--clr-neutral-0)]">{labels.disabilityLabel}</span>
            <p className="text-xs text-[var(--clr-neutral-100)]">{labels.disabilityDescription}</p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isMinimumWage}
            onChange={(e) => setIsMinimumWage(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded accent-[var(--clr-green-500)]"
          />
          <div>
            <span className="text-sm font-medium text-[var(--clr-neutral-0)]">{labels.minimumWageLabel}</span>
            <p className="text-xs text-[var(--clr-neutral-100)]">{labels.minimumWageDescription}</p>
          </div>
        </label>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {mode === 'brutToNet' ? labels.resultNetLabel : labels.resultBrutLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-green-500)]">
                {formatNumber(mode === 'brutToNet' ? result.net : result.gross)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultContributionsLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {formatNumber(result.totalContributions)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultTaxLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {formatNumber(result.incomeTax)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultEmployerCostLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {formatNumber(result.employerCost)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>
          </div>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--clr-neutral-1000)] px-4 py-3 text-sm font-medium text-[var(--clr-neutral-0)] transition-colors hover:bg-[var(--clr-neutral-800)]"
          >
            {showDetails ? labels.hideDetails : labels.showDetails}
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Details Table */}
          {showDetails && (
            <div className="overflow-hidden rounded-xl bg-[var(--clr-neutral-1000)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                      {labels.detailsTitle}
                    </th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                      {labels.detailsRate}
                    </th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                      {labels.detailsAmount}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.nonTaxableAmount > 0 && (
                    <tr className="border-b border-[var(--clr-neutral-800)]">
                      <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsNonTaxableAmount}</td>
                      <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                      <td className="px-4 py-3 text-right text-[var(--clr-green-500)]">
                        -{formatNumber(result.nonTaxableAmount)} {labels.currency}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsCAS}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">25%</td>
                    <td className="px-4 py-3 text-right text-red-400">
                      -{formatNumber(result.cas)} {labels.currency}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsCASS}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">10%</td>
                    <td className="px-4 py-3 text-right text-red-400">
                      -{formatNumber(result.cass)} {labels.currency}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsPersonalDeduction}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">
                      {result.deductionPercent > 0 ? `${result.deductionPercent}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--clr-green-500)]">
                      {result.personalDeduction > 0 ? `${formatNumber(result.personalDeduction)} ${labels.currency}` : '0,00 ' + labels.currency}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsTaxableBase}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-0)]">
                      {formatNumber(result.taxableBase)} {labels.currency}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsIncomeTax}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">10%</td>
                    <td className="px-4 py-3 text-right text-red-400">
                      -{formatNumber(result.incomeTax)} {labels.currency}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 font-medium text-[var(--clr-neutral-0)]">{labels.detailsCAM}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">2,25%</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">
                      {formatNumber(result.cam)} {labels.currency}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}