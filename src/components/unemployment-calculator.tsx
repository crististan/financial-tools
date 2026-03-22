'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';

interface BracketData {
  key: string;
  label: string;
  durationMonths: number;
  salaryPercent: number;
}

interface UnemploymentData {
  isrValue: number;
  isrPercentWorker: number;
  isrPercentGraduate: number;
  graduateDurationMonths: number;
  brackets: BracketData[];
}

interface UnemploymentLabels {
  data: UnemploymentData;
  avgGrossSalaryLabel: string;
  contributionYearsLabel: string;
  isrLabel: string;
  resultBenefitLabel: string;
  resultDurationLabel: string;
  resultTotalLabel: string;
  resultIsrComponentLabel: string;
  notEligibleMessage: string;
  graduateNote: string;
  months: string;
  currency: string;
  showDetails: string;
  hideDetails: string;
  detailsTitle: string;
  detailsISRBase: string;
  detailsSalaryComponent: string;
  detailsDuration: string;
  detailsMonthlyTotal: string;
  detailsRate: string;
  detailsAmount: string;
}

interface UnemploymentCalculatorProps {
  labels: UnemploymentLabels;
  initialSalary?: number;
}

function formatNumber(value: number): string {
  return value.toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function UnemploymentCalculator({ labels, initialSalary }: UnemploymentCalculatorProps) {
  const { data } = labels;
  const [avgGrossSalary, setAvgGrossSalary] = useState<string>(initialSalary?.toString() || '5000');
  const [selectedBracket, setSelectedBracket] = useState<string>(data.brackets[2]?.key || '1-3');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (initialSalary && initialSalary > 0) {
      setAvgGrossSalary(initialSalary.toString());
    }
  }, [initialSalary]);

  const bracket = useMemo(() => {
    return data.brackets.find(b => b.key === selectedBracket) || data.brackets[2];
  }, [selectedBracket, data.brackets]);

  const isGraduate = selectedBracket === 'graduate';
  const isNotEligible = selectedBracket === 'under-12m';

  const result = useMemo(() => {
    if (isNotEligible) return null;

    const salary = parseFloat(avgGrossSalary) || 0;

    if (isGraduate) {
      const isrPercent = data.isrPercentGraduate / 100;
      const monthlyBenefit = Math.round(data.isrValue * isrPercent * 100) / 100;
      const duration = data.graduateDurationMonths;
      const totalEstimated = Math.round(monthlyBenefit * duration * 100) / 100;

      return {
        isrComponent: monthlyBenefit,
        isrPercent: data.isrPercentGraduate,
        salaryPercent: 0,
        salaryComponent: 0,
        monthlyBenefit,
        duration,
        totalEstimated,
      };
    }

    if (salary <= 0) return null;

    const isrPercent = data.isrPercentWorker / 100;
    const isrComponent = Math.round(data.isrValue * isrPercent * 100) / 100;
    const salaryPercent = bracket.salaryPercent / 100;
    const salaryComponent = Math.round(salary * salaryPercent * 100) / 100;
    const monthlyBenefit = Math.round((isrComponent + salaryComponent) * 100) / 100;
    const duration = bracket.durationMonths;
    const totalEstimated = Math.round(monthlyBenefit * duration * 100) / 100;

    return {
      isrComponent,
      isrPercent: data.isrPercentWorker,
      salaryPercent: bracket.salaryPercent,
      salaryComponent,
      monthlyBenefit,
      duration,
      totalEstimated,
    };
  }, [avgGrossSalary, bracket, isGraduate, isNotEligible, data]);

  return (
    <div className="w-full rounded-4xl bg-[var(--clr-neutral-900)] p-6 md:p-8">
      {/* Contribution Bracket Select */}
      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
          {labels.contributionYearsLabel}
        </label>
        <select
          value={selectedBracket}
          onChange={(e) => setSelectedBracket(e.target.value)}
          className="w-full rounded-md border border-[var(--clr-neutral-1000)] bg-[var(--clr-neutral-800)] px-4 py-3 text-[var(--clr-neutral-0)] outline-none focus:border-[var(--clr-green-500)]"
        >
          {data.brackets.map((b) => (
            <option key={b.key} value={b.key} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Not Eligible Warning */}
      {isNotEligible && (
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-amber-500/10 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-sm text-[var(--clr-neutral-0)]">{labels.notEligibleMessage}</p>
        </div>
      )}

      {/* Graduate Note */}
      {isGraduate && (
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-blue-500/10 p-4">
          <Info size={20} className="mt-0.5 shrink-0 text-blue-500" />
          <p className="text-sm text-[var(--clr-neutral-0)]">{labels.graduateNote}</p>
        </div>
      )}

      {/* Average Gross Salary Input — hidden for graduates */}
      {!isGraduate && !isNotEligible && (
        <div className="mb-6">
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
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultBenefitLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-green-500)]">
                {formatNumber(result.monthlyBenefit)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultDurationLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {result.duration}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.months}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultTotalLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {formatNumber(result.totalEstimated)}
              </p>
              <p className="text-xs text-[var(--clr-neutral-100)]">{labels.currency}</p>
            </div>

            <div className="rounded-xl bg-[var(--clr-neutral-1000)] p-4 text-center">
              <p className="mb-1 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                {labels.resultIsrComponentLabel}
              </p>
              <p className="text-2xl font-bold text-[var(--clr-neutral-0)]">
                {formatNumber(result.isrComponent)}
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
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">
                      {labels.detailsISRBase} ({result.isrPercent}% × {formatNumber(data.isrValue)} {labels.currency})
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">{result.isrPercent}%</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-green-500)]">
                      {formatNumber(result.isrComponent)} {labels.currency}
                    </td>
                  </tr>
                  {!isGraduate && result.salaryPercent > 0 && (
                    <tr className="border-b border-[var(--clr-neutral-800)]">
                      <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsSalaryComponent}</td>
                      <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">
                        {result.salaryPercent}%
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--clr-green-500)]">
                        {formatNumber(result.salaryComponent)} {labels.currency}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 text-[var(--clr-neutral-0)]">{labels.detailsDuration}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-0)]">
                      {result.duration} {labels.months}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-[var(--clr-neutral-800)]">
                    <td className="px-4 py-3 font-medium text-[var(--clr-neutral-0)]">{labels.detailsMonthlyTotal}</td>
                    <td className="px-4 py-3 text-right text-[var(--clr-neutral-100)]">—</td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--clr-green-500)]">
                      {formatNumber(result.monthlyBenefit)} {labels.currency}
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
