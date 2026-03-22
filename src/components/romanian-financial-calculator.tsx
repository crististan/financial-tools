'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import SalaryCalculator from '@/components/salary-calculator';
import UnemploymentCalculator from '@/components/unemployment-calculator';
import PensionCalculator from '@/components/pension-calculator';

type CalculatorMode = 'salary' | 'unemployment' | 'pension';

interface RomanianFinancialCalculatorProps {
  primaryMode: CalculatorMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configData: Record<string, any>;
}

const TAB_CONFIG: { key: CalculatorMode; labelKey: string; slug: string }[] = [
  { key: 'salary', labelKey: 'tabSalary', slug: 'calculator-salariu' },
  { key: 'unemployment', labelKey: 'tabUnemployment', slug: 'calculator-somaj' },
  { key: 'pension', labelKey: 'tabPension', slug: 'calculator-pensie' },
];

function getSalaryFromUrl(): number {
  if (typeof window === 'undefined') return 0;
  const params = new URLSearchParams(window.location.search);
  return parseFloat(params.get('salary') || '0') || 0;
}

export default function RomanianFinancialCalculator({ primaryMode, labels, configData }: RomanianFinancialCalculatorProps) {
  const [initialSalaryFromUrl, setInitialSalaryFromUrl] = useState<number | undefined>(undefined);
  const [currentGrossSalary, setCurrentGrossSalary] = useState<number>(0);

  // Read salary from URL on mount (client-side only)
  useEffect(() => {
    const urlSalary = getSalaryFromUrl();
    if (urlSalary > 0) {
      setInitialSalaryFromUrl(urlSalary);
      setCurrentGrossSalary(urlSalary);
    }
  }, []);

  const handleSalaryChange = useCallback((gross: number) => {
    setCurrentGrossSalary(gross);
  }, []);

  const buildHref = (slug: string) => {
    const base = `/ro/financiar/${slug}`;
    if (currentGrossSalary > 0) {
      return `${base}?salary=${currentGrossSalary}`;
    }
    return base;
  };

  return (
    <div className="w-full">
      {/* Navigation Tab Bar */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-[var(--clr-neutral-1000)] p-1">
          {TAB_CONFIG.map(({ key, labelKey, slug }) => {
            const isActive = primaryMode === key;
            if (isActive) {
              return (
                <span
                  key={key}
                  className="rounded-lg px-3 py-2.5 text-center text-sm font-medium bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]"
                >
                  {labels[labelKey]}
                </span>
              );
            }
            return (
              <Link
                key={key}
                href={buildHref(slug)}
                className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors"
              >
                {labels[labelKey]}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Active Calculator — only the primary one */}
      {primaryMode === 'salary' && (
        <SalaryCalculator
          labels={labels.salary}
          configData={configData.salary}
          onSalaryChange={handleSalaryChange}
          initialSalary={initialSalaryFromUrl}
        />
      )}
      {primaryMode === 'unemployment' && (
        <UnemploymentCalculator
          labels={labels.unemployment}
          configData={configData.unemployment}
          initialSalary={initialSalaryFromUrl}
          onSalaryChange={handleSalaryChange}
        />
      )}
      {primaryMode === 'pension' && (
        <PensionCalculator
          labels={labels.pension}
          configData={configData.pension}
          initialSalary={initialSalaryFromUrl}
          onSalaryChange={handleSalaryChange}
        />
      )}
    </div>
  );
}
