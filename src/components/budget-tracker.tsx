'use client';

import { useState, useMemo, useEffect, useCallback, type ChangeEvent } from 'react';

type BudgetCategory = {
    id: string;
    name: string;
    planned: number;
    actual: number;
};

type BudgetTrackerProps = {
    labels: {
        incomeTitle: string;
        expensesTitle: string;
        categoryLabel: string;
        categoryPlaceholder: string;
        plannedLabel: string;
        plannedPlaceholder: string;
        actualLabel: string;
        actualPlaceholder: string;
        addButtonLabel: string;
        removeButtonAriaLabel: string;
        summaryTitle: string;
        totalIncomePlanLabel: string;
        totalIncomeActualLabel: string;
        totalExpensesPlanLabel: string;
        totalExpensesActualLabel: string;
        balancePlanLabel: string;
        balanceActualLabel: string;
        differenceLabel: string;
        resetButtonLabel: string;
        resetConfirmMessage: string;
        noDataMessage: string;
        progressLabel: string;
    };
    defaultCategories: {
        income: Array<{ name: string; planned: number }>;
        expenses: Array<{ name: string; planned: number }>;
    };
};

const STORAGE_KEY = 'financial-tools-budget-data';

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function formatCurrency(value: number): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function createDefaults(defaults: Array<{ name: string; planned: number }>): BudgetCategory[] {
    return defaults.map(d => ({
        id: generateId(),
        name: d.name,
        planned: d.planned,
        actual: 0,
    }));
}

export default function BudgetTracker({ labels, defaultCategories }: BudgetTrackerProps) {
    const [income, setIncome] = useState<BudgetCategory[]>([]);
    const [expenses, setExpenses] = useState<BudgetCategory[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.income?.length || data.expenses?.length) {
                    setIncome(data.income || []);
                    setExpenses(data.expenses || []);
                    setLoaded(true);
                    return;
                }
            }
        } catch { /* ignore parse errors */ }

        setIncome(createDefaults(defaultCategories.income));
        setExpenses(createDefaults(defaultCategories.expenses));
        setLoaded(true);
    }, [defaultCategories]);

    // Save to localStorage on changes
    const saveToStorage = useCallback((inc: BudgetCategory[], exp: BudgetCategory[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ income: inc, expenses: exp }));
        } catch { /* storage full */ }
    }, []);

    useEffect(() => {
        if (loaded) saveToStorage(income, expenses);
    }, [income, expenses, loaded, saveToStorage]);

    // Summary calculations
    const summary = useMemo(() => {
        const totalIncomePlan = income.reduce((sum, c) => sum + c.planned, 0);
        const totalIncomeActual = income.reduce((sum, c) => sum + c.actual, 0);
        const totalExpensesPlan = expenses.reduce((sum, c) => sum + c.planned, 0);
        const totalExpensesActual = expenses.reduce((sum, c) => sum + c.actual, 0);
        const balancePlan = totalIncomePlan - totalExpensesPlan;
        const balanceActual = totalIncomeActual - totalExpensesActual;
        const difference = balanceActual - balancePlan;

        return {
            totalIncomePlan,
            totalIncomeActual,
            totalExpensesPlan,
            totalExpensesActual,
            balancePlan,
            balanceActual,
            difference,
        };
    }, [income, expenses]);

    // Handlers
    function updateCategory(
        list: BudgetCategory[],
        setList: (v: BudgetCategory[]) => void,
        id: string,
        field: 'name' | 'planned' | 'actual',
        value: string
    ) {
        setList(list.map(c => {
            if (c.id !== id) return c;
            if (field === 'name') return { ...c, name: value };
            const num = parseFloat(value);
            return { ...c, [field]: isNaN(num) ? 0 : num };
        }));
    }

    function addCategory(list: BudgetCategory[], setList: (v: BudgetCategory[]) => void) {
        setList([...list, { id: generateId(), name: '', planned: 0, actual: 0 }]);
    }

    function removeCategory(list: BudgetCategory[], setList: (v: BudgetCategory[]) => void, id: string) {
        setList(list.filter(c => c.id !== id));
    }

    function handleReset() {
        if (confirm(labels.resetConfirmMessage)) {
            const newIncome = createDefaults(defaultCategories.income);
            const newExpenses = createDefaults(defaultCategories.expenses);
            setIncome(newIncome);
            setExpenses(newExpenses);
        }
    }

    function getProgressPercent(actual: number, planned: number): number {
        if (planned <= 0) return actual > 0 ? 100 : 0;
        return Math.min(Math.round((actual / planned) * 100), 100);
    }

    function getProgressColor(actual: number, planned: number, isExpense: boolean): string {
        if (planned <= 0) return 'bg-[var(--clr-neutral-100)]';
        const ratio = actual / planned;
        if (isExpense) {
            if (ratio <= 0.8) return 'bg-[var(--clr-green-500)]';
            if (ratio <= 1.0) return 'bg-yellow-500';
            return 'bg-red-500';
        }
        if (ratio >= 1.0) return 'bg-[var(--clr-green-500)]';
        if (ratio >= 0.8) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    // Don't render until localStorage has been checked
    if (!loaded) return null;

    const hasData = income.length > 0 || expenses.length > 0;

    return (
        <div className="w-full max-w-[800px] mx-auto">
            {/* Income Section */}
            <CategorySection
                title={labels.incomeTitle}
                categories={income}
                labels={labels}
                isExpense={false}
                onUpdate={(id, field, value) => updateCategory(income, setIncome, id, field, value)}
                onAdd={() => addCategory(income, setIncome)}
                onRemove={(id) => removeCategory(income, setIncome, id)}
                getProgressPercent={getProgressPercent}
                getProgressColor={getProgressColor}
            />

            {/* Expenses Section */}
            <div className="mt-8">
                <CategorySection
                    title={labels.expensesTitle}
                    categories={expenses}
                    labels={labels}
                    isExpense={true}
                    onUpdate={(id, field, value) => updateCategory(expenses, setExpenses, id, field, value)}
                    onAdd={() => addCategory(expenses, setExpenses)}
                    onRemove={(id) => removeCategory(expenses, setExpenses, id)}
                    getProgressPercent={getProgressPercent}
                    getProgressColor={getProgressColor}
                />
            </div>

            {/* Summary */}
            <div className="mt-8 bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-6">{labels.summaryTitle}</h3>

                {hasData ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <SummaryRow label={labels.totalIncomePlanLabel} value={summary.totalIncomePlan} />
                            <SummaryRow label={labels.totalIncomeActualLabel} value={summary.totalIncomeActual} positive={summary.totalIncomeActual >= summary.totalIncomePlan} />
                            <SummaryRow label={labels.totalExpensesPlanLabel} value={summary.totalExpensesPlan} />
                            <SummaryRow label={labels.totalExpensesActualLabel} value={summary.totalExpensesActual} positive={summary.totalExpensesActual <= summary.totalExpensesPlan} />
                        </div>

                        <div className="h-px bg-[var(--clr-neutral-1000)] my-5" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SummaryCard label={labels.balancePlanLabel} value={summary.balancePlan} highlight={false} />
                            <SummaryCard label={labels.balanceActualLabel} value={summary.balanceActual} highlight={true} />
                            <SummaryCard label={labels.differenceLabel} value={summary.difference} highlight={false} />
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-sm text-[var(--clr-neutral-100)] hover:text-red-500 transition-colors cursor-pointer"
                            >
                                {labels.resetButtonLabel}
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-[var(--clr-neutral-100)] text-center py-8">{labels.noDataMessage}</p>
                )}
            </div>
        </div>
    );
}

// --- Sub-components ---

type CategorySectionProps = {
    title: string;
    categories: BudgetCategory[];
    labels: BudgetTrackerProps['labels'];
    isExpense: boolean;
    onUpdate: (id: string, field: 'name' | 'planned' | 'actual', value: string) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
    getProgressPercent: (actual: number, planned: number) => number;
    getProgressColor: (actual: number, planned: number, isExpense: boolean) => string;
};

function CategorySection({ title, categories, labels, isExpense, onUpdate, onAdd, onRemove, getProgressPercent, getProgressColor }: CategorySectionProps) {
    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-5">{title}</h3>

            {/* Header row - visible on md+ */}
            <div className="hidden md:grid grid-cols-[1fr_120px_120px_80px] gap-3 mb-3 px-1">
                <span className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.categoryLabel}</span>
                <span className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.plannedLabel}</span>
                <span className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.actualLabel}</span>
                <span></span>
            </div>

            {/* Category rows */}
            <div className="space-y-3">
                {categories.map((category) => {
                    const percent = getProgressPercent(category.actual, category.planned);
                    const barColor = getProgressColor(category.actual, category.planned, isExpense);
                    const progressText = labels.progressLabel.replace('{percent}', percent.toString());

                    return (
                        <div key={category.id} className="bg-[var(--clr-neutral-1000)] rounded-xl p-3 md:p-4">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_80px] gap-3 items-center">
                                <input
                                    type="text"
                                    className="w-full p-2 bg-[var(--clr-neutral-800)] text-sm text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                                    placeholder={labels.categoryPlaceholder}
                                    value={category.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(category.id, 'name', e.target.value)}
                                />
                                <div>
                                    <span className="md:hidden text-xs text-[var(--clr-neutral-100)] mb-1 block">{labels.plannedLabel}</span>
                                    <input
                                        type="number"
                                        className="w-full p-2 bg-[var(--clr-neutral-800)] text-sm text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                                        placeholder={labels.plannedPlaceholder}
                                        value={category.planned || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(category.id, 'planned', e.target.value)}
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <span className="md:hidden text-xs text-[var(--clr-neutral-100)] mb-1 block">{labels.actualLabel}</span>
                                    <input
                                        type="number"
                                        className="w-full p-2 bg-[var(--clr-neutral-800)] text-sm text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                                        placeholder={labels.actualPlaceholder}
                                        value={category.actual || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdate(category.id, 'actual', e.target.value)}
                                        min={0}
                                    />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => onRemove(category.id)}
                                        aria-label={labels.removeButtonAriaLabel}
                                        className="w-8 h-8 rounded-full grid place-items-center hover:bg-red-500/20 text-[var(--clr-neutral-100)] hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {category.planned > 0 && (
                                <div className="mt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-[var(--clr-neutral-100)]">{progressText}</span>
                                        <span className="text-xs text-[var(--clr-neutral-100)]">${formatCurrency(category.actual)} / ${formatCurrency(category.planned)}</span>
                                    </div>
                                    <div className="h-1.5 bg-[var(--clr-neutral-800)] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                                            style={{ width: `${Math.min(percent, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add button */}
            <button
                type="button"
                onClick={onAdd}
                className="mt-4 flex items-center gap-2 text-sm text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {labels.addButtonLabel}
            </button>
        </div>
    );
}

type SummaryRowProps = {
    label: string;
    value: number;
    positive?: boolean;
};

function SummaryRow({ label, value, positive }: SummaryRowProps) {
    const colorClass = positive === undefined
        ? 'text-[var(--clr-neutral-0)]'
        : positive
            ? 'text-[var(--clr-green-500)]'
            : 'text-red-500';

    return (
        <div className="flex justify-between items-center bg-[var(--clr-neutral-1000)] rounded-xl px-4 py-3">
            <span className="text-sm text-[var(--clr-neutral-100)]">{label}</span>
            <span className={`text-sm font-mono font-medium ${colorClass}`}>
                ${formatCurrency(value)}
            </span>
        </div>
    );
}

type SummaryCardProps = {
    label: string;
    value: number;
    highlight: boolean;
};

function SummaryCard({ label, value, highlight }: SummaryCardProps) {
    const valueColor = value >= 0
        ? highlight ? 'text-[var(--clr-green-500)]' : 'text-[var(--clr-neutral-0)]'
        : 'text-red-500';

    return (
        <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{label}</p>
            <p className={`text-xl md:text-2xl font-bold ${valueColor}`}>
                {value < 0 ? '-' : ''}${formatCurrency(Math.abs(value))}
            </p>
        </div>
    );
}
