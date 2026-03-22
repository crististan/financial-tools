'use client';

import { useState, useCallback } from 'react';
import SalaryCalculator from '@/components/salary-calculator';
import UnemploymentCalculator from '@/components/unemployment-calculator';
import PensionCalculator from '@/components/pension-calculator';

type CalculatorMode = 'salary' | 'unemployment' | 'pension';

interface RomanianFinancialCalculatorProps {
  primaryMode: CalculatorMode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: Record<string, any>;
}

const TAB_CONFIG: { key: CalculatorMode; labelKey: string }[] = [
  { key: 'salary', labelKey: 'tabSalary' },
  { key: 'unemployment', labelKey: 'tabUnemployment' },
  { key: 'pension', labelKey: 'tabPension' },
];

export default function RomanianFinancialCalculator({ primaryMode, labels }: RomanianFinancialCalculatorProps) {
  const [activeTab, setActiveTab] = useState<CalculatorMode>(primaryMode);
  const [sharedGrossSalary, setSharedGrossSalary] = useState<number>(0);

  const handleSalaryChange = useCallback((gross: number) => {
    setSharedGrossSalary(gross);
  }, []);

  return (
    <div className="w-full">
      {/* Tab Bar */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-[var(--clr-neutral-1000)] p-1">
          {TAB_CONFIG.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                  : 'text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)]'
              }`}
            >
              {labels[labelKey]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Panel */}
      {activeTab === 'salary' && (
        <SalaryCalculator
          labels={labels.salary}
          onSalaryChange={handleSalaryChange}
        />
      )}
      {activeTab === 'unemployment' && (
        <UnemploymentCalculator
          labels={labels.unemployment}
          initialSalary={sharedGrossSalary > 0 ? sharedGrossSalary : undefined}
        />
      )}
      {activeTab === 'pension' && (
        <PensionCalculator
          labels={labels.pension}
          initialSalary={sharedGrossSalary > 0 ? sharedGrossSalary : undefined}
        />
      )}
    </div>
  );
}
