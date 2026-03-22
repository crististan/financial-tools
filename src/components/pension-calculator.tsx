'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PensionLabels {
  genderLabel: string;
  genderMale: string;
  genderFemale: string;
  currentAgeLabel: string;
  contributionYearsLabel: string;
  avgGrossSalaryLabel: string;
  nationalAvgSalaryLabel: string;
  pointValueLabel: string;
  resultMonthlyPensionLabel: string;
  resultRetirementAgeLabel: string;
  resultTotalPointsLabel: string;
  resultYearsUntilRetirementLabel: string;
  alreadyRetired: string;
  years: string;
  currency: string;
  showDetails: string;
  hideDetails: string;
  detailsTitle: string;
  detailsAnnualPoints: string;
  detailsTotalPoints: string;
  detailsPointValue: string;
  detailsRetirementAge: string;
  detailsContributionPeriod: string;
  detailsRate: string;
  detailsAmount: string;
}

interface PensionCalculatorProps {
  labels: PensionLabels;
  initialSalary?: number;
}

// 2026 values
const DEFAULT_POINT_VALUE = 2032;
const DEFAULT_NATIONAL_AVG_SALARY = 8000;
const RETIREMENT_AGE_MALE = 65;
const RETIREMENT_AGE_FEMALE = 63;

function formatNumber(value: number): string {
  return value.toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function PensionCalculator({ labels, initialSalary }: PensionCalculatorProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [currentAge, setCurrentAge] = useState<string>('35');
  const [contributionYears, setContributionYears] = useState<string>('15');
  const [avgGrossSalary, setAvgGrossSalary] = useState<string>(initialSalary?.toString() || '5000');
  const [nationalAvgSalary, setNationalAvgSalary] = useState<string>(DEFAULT_NATIONAL_AVG_SALARY.toString());
  const [pointValue, setPointValue] = useState<string>(DEFAULT_POINT_VALUE.toString());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (initialSalary && initialSalary > 0) {
      setAvgGrossSalary(initialSalary.toString());
    }
  }, [initialSalary]);

  const result = useMemo(() => {
    const salary = parseFloat(avgGrossSalary) || 0;
    const natAvg = parseFloat(nationalAvgSalary) || 0;
    const pValue = parseFloat(pointValue) || 0;
    const age = parseInt(currentAge) || 0;
    const years = parseInt(contributionYears) || 0;

    if (salary <= 0 || natAvg <= 0 || pValue <= 0 || years <= 0) return null;

    const retirementAge = gender === 'male' ? RETIREMENT_AGE_MALE : RETIREMENT_AGE_FEMALE;
    const annualPoints = Math.round((salary / natAvg) * 10000) / 10000;
    const totalPoints = Math.round(annualPoints * years * 100) / 100;
    const monthlyPension = Math.round(totalPoints * pValue * 100) / 100;
    const yearsUntilRetirement = Math.max(0, retirementAge - age);

    return {
      annualPoints,
      totalPoints,
      monthlyPension,
      retirementAge,
      yearsUntilRetirement,
    };
  }, [avgGrossSalary, nationalAvgSalary, pointValue, currentAge, contributionYears, gender]);

  return (
    <div className="w-full rounded-4xl bg-[var(--clr-neutral-900)] p-6 md:p-8">
      {/* Gender Toggle */}
      <div className="mb-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.genderLabel}
        </label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--clr-neutral-1000)] p-1">
          <button
            onClick={() => setGender('male')}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              gender === 'male'
                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                : 'text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)]'
            }`}
          >
            {labels.genderMale}
          </button>
          <button
            onClick={() => setGender('female')}
            className={`rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
              gender === 'female'
                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                : 'text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)]'
            }`}
          >
            {labels.genderFemale}
          </button>
        </div>
      </div>

      {/* Current Age */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.currentAgeLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(e.target.value)}
            min="18"
            max="70"
            className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--clr-neutral-100)]">
            {labels.years}
          </span>
        </div>
      </div>

      {/* Contribution Years */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.contributionYearsLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={contributionYears}
            onChange={(e) => setContributionYears(e.target.value)}
            min="0"
            max="45"
            className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--clr-neutral-100)]">
            {labels.years}
          </span>
        </div>
      </div>

      {/* Average Gross Salary */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.avgGrossSalaryLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={avgGrossSalary}
            onChange={(e) => setAvgGrossSalary(e.target.value)}
            min="0"
            className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--clr-neutral-100)]">
            {labels.currency}
          </span>
        </div>
      </div>

      {/* National Average Salary */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.nationalAvgSalaryLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={nationalAvgSalary}
            onChange={(e) => setNationalAvgSalary(e.target.value)}
            min="0"
            className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--clr-neutral-100)]">
            {labels.currency}
          </span>
        </div>
      </div>

      {/* Point Value */}
      <div className="mb-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.pointValueLabel}
        </label>
        <div className="relative">
          <input
            type="number"
            value={pointValue}
            onChange={(e) => setPointValue(e.target.value)}
            min="0"
            className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
            placeholder="0"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--clr-neutral-100)]">
            {labels.currency}
          </span>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultMonthlyPensionLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-green-500)]">
                {formatNumber(result.monthlyPension)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultRetirementAgeLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {result.retirementAge}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.years}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultTotalPointsLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {result.totalPoints.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">puncte</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultYearsUntilRetirementLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {result.yearsUntilRetirement > 0 ? result.yearsUntilRetirement : '—'}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">
                {result.yearsUntilRetirement > 0 ? labels.years : labels.alreadyRetired}
              </p>
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
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsAnnualPoints}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">
                      {formatNumber(parseFloat(avgGrossSalary) || 0)} / {formatNumber(parseFloat(nationalAvgSalary) || 0)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--clr-green-500)]">
                      {result.annualPoints.toLocaleString('ro-RO', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsContributionPeriod}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-0)]">
                      {contributionYears} {labels.years}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsTotalPoints}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">
                      {result.annualPoints.toLocaleString('ro-RO', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} × {contributionYears}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--clr-green-500)]">
                      {result.totalPoints.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsPointValue}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-0)]">
                      {formatNumber(parseFloat(pointValue) || 0)} {labels.currency}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 font-medium text-[var(--clr-neutral-0)]">{labels.detailsRetirementAge}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--clr-neutral-0)]">
                      {result.retirementAge} {labels.years}
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
