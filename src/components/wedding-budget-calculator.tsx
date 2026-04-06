'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

type CategoryConfig = {
    key: string;
    name: string;
    percentage: number;
};

type DefaultCategoryConfig = {
    key: string;
    percentage: number;
};

type WeddingBudgetCalculatorProps = {
    labels: {
        totalBudgetLabel: string;
        totalBudgetPlaceholder: string;
        numberOfGuestsLabel: string;
        numberOfGuestsPlaceholder: string;
        currencyLabel: string;
        categoriesTitle: string;
        categoryNames: Record<string, string>;
        percentageLabel: string;
        amountLabel: string;
        totalAllocatedLabel: string;
        warningNotHundred: string;
        resultTotalBudget: string;
        resultAllocated: string;
        resultRemaining: string;
        resultOverBudget: string;
        resultCostPerGuest: string;
        breakdownTitle: string;
        chartTitle: string;
        currencySymbol: string;
        resetLabel: string;
        addCategoryLabel: string;
        newCategoryNamePlaceholder: string;
        editCategoryAriaLabel: string;
        deleteCategoryAriaLabel: string;
        confirmDeleteMessage: string;
        confirmLabel: string;
        cancelLabel: string;
        confirmResetMessage: string;
    };
    defaultCategories: DefaultCategoryConfig[];
};

const STORAGE_KEY = 'toolframe_wedding_budget';

const CURRENCIES = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'lei', label: 'RON (lei)' },
];

const CHART_COLORS = [
    '#09E789', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
];

function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

function formatValue(value: number, currency: string): string {
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    if (currency === 'lei') return `${formatted} ${currency}`;
    return `${currency}${formatted}`;
}

function buildDefaultCategories(
    defaults: DefaultCategoryConfig[],
    categoryNames: Record<string, string>
): CategoryConfig[] {
    return defaults.map((c) => ({
        key: c.key,
        name: categoryNames[c.key] || c.key,
        percentage: c.percentage,
    }));
}

export default function WeddingBudgetCalculator({ labels, defaultCategories }: WeddingBudgetCalculatorProps) {
    const [totalBudget, setTotalBudget] = useState(25000);
    const [numberOfGuests, setNumberOfGuests] = useState(100);
    const [currency, setCurrency] = useState(labels.currencySymbol);
    const [categories, setCategories] = useState<CategoryConfig[]>([]);
    const [loaded, setLoaded] = useState(false);

    // UI-only state (not persisted)
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryPercentage, setNewCategoryPercentage] = useState('');

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.categories?.length) {
                    setTotalBudget(data.totalBudget ?? 25000);
                    setNumberOfGuests(data.numberOfGuests ?? 100);
                    setCurrency(data.currency ?? labels.currencySymbol);
                    setCategories(data.categories);
                    setLoaded(true);
                    return;
                }
            }
        } catch { /* ignore parse errors */ }

        setCategories(buildDefaultCategories(defaultCategories, labels.categoryNames));
        setLoaded(true);
    }, [defaultCategories, labels.categoryNames, labels.currencySymbol]);

    // Save to localStorage on changes
    const saveToStorage = useCallback(
        (budget: number, guests: number, curr: string, cats: CategoryConfig[]) => {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ totalBudget: budget, numberOfGuests: guests, currency: curr, categories: cats })
                );
            } catch { /* storage full */ }
        },
        []
    );

    useEffect(() => {
        if (loaded) saveToStorage(totalBudget, numberOfGuests, currency, categories);
    }, [totalBudget, numberOfGuests, currency, categories, loaded, saveToStorage]);

    const totalPercentage = useMemo(
        () => categories.reduce((sum, c) => sum + c.percentage, 0),
        [categories]
    );

    const results = useMemo(() => {
        const budget = totalBudget || 0;
        const guests = Math.max(1, numberOfGuests || 1);
        const allocated = categories.reduce(
            (sum, c) => sum + (budget * c.percentage) / 100,
            0
        );
        const remaining = budget - allocated;
        const costPerGuest = budget / guests;

        return { allocated, remaining, costPerGuest };
    }, [totalBudget, numberOfGuests, categories]);

    const isOver = results.remaining < 0;

    // --- Category handlers ---

    const handlePercentageChange = useCallback((index: number, value: string) => {
        const num = parseFloat(value) || 0;
        setCategories((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], percentage: Math.max(0, Math.min(100, num)) };
            return next;
        });
    }, []);

    const handleAmountChange = useCallback((index: number, value: string) => {
        const amount = parseFloat(value) || 0;
        const budget = totalBudget || 1;
        const pct = Math.round((amount / budget) * 10000) / 100;
        setCategories((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], percentage: Math.max(0, Math.min(100, pct)) };
            return next;
        });
    }, [totalBudget]);

    const handleNormalize = useCallback(() => {
        if (totalPercentage === 0) return;
        setCategories((prev) =>
            prev.map((c) => ({
                ...c,
                percentage: Math.round((c.percentage / totalPercentage) * 10000) / 100,
            }))
        );
    }, [totalPercentage]);

    // Reset to defaults with inline confirmation
    const handleResetConfirm = useCallback(() => {
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        setCategories(buildDefaultCategories(defaultCategories, labels.categoryNames));
        setTotalBudget(25000);
        setNumberOfGuests(100);
        setCurrency(labels.currencySymbol);
        setConfirmReset(false);
        setEditingIndex(null);
        setConfirmDeleteIndex(null);
    }, [defaultCategories, labels.categoryNames, labels.currencySymbol]);

    // Edit category
    const startEdit = useCallback((index: number) => {
        setEditingIndex(index);
        setEditName(categories[index].name);
        setConfirmDeleteIndex(null);
    }, [categories]);

    const confirmEdit = useCallback(() => {
        if (editingIndex === null) return;
        const trimmed = editName.trim();
        if (!trimmed) return;
        // Check duplicate (case-insensitive, excluding self)
        const isDuplicate = categories.some(
            (c, i) => i !== editingIndex && c.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (isDuplicate) return;
        setCategories((prev) => {
            const next = [...prev];
            next[editingIndex] = { ...next[editingIndex], name: trimmed };
            return next;
        });
        setEditingIndex(null);
        setEditName('');
    }, [editingIndex, editName, categories]);

    const cancelEdit = useCallback(() => {
        setEditingIndex(null);
        setEditName('');
    }, []);

    // Delete category with redistribution
    const confirmDelete = useCallback((index: number) => {
        setCategories((prev) => {
            const removed = prev[index];
            const remaining = prev.filter((_, i) => i !== index);
            if (remaining.length === 0 || removed.percentage === 0) return remaining;
            const share = Math.round((removed.percentage / remaining.length) * 100) / 100;
            return remaining.map((c) => ({
                ...c,
                percentage: Math.round((c.percentage + share) * 100) / 100,
            }));
        });
        setConfirmDeleteIndex(null);
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditName('');
        }
    }, [editingIndex]);

    // Add category
    const canAdd = useMemo(() => {
        const trimmed = newCategoryName.trim();
        if (!trimmed) return false;
        return !categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase());
    }, [newCategoryName, categories]);

    const handleAddCategory = useCallback(() => {
        const trimmed = newCategoryName.trim();
        if (!trimmed || !canAdd) return;
        const pct = parseFloat(newCategoryPercentage) || 0;
        setCategories((prev) => [
            ...prev,
            { key: `custom_${generateId()}`, name: trimmed, percentage: Math.max(0, Math.min(100, pct)) },
        ]);
        setNewCategoryName('');
        setNewCategoryPercentage('');
    }, [newCategoryName, newCategoryPercentage, canAdd]);

    const chartData = useMemo(
        () =>
            categories
                .filter((c) => c.percentage > 0)
                .map((c, _, filtered) => ({
                    name: c.name,
                    value: Math.round((totalBudget * c.percentage) / 100),
                    percentage: c.percentage,
                    originalIndex: categories.indexOf(filtered.find((f) => f.key === c.key)!),
                })),
        [categories, totalBudget]
    );

    // Don't render until localStorage has been checked
    if (!loaded) return null;

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Total Budget */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.totalBudgetLabel}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="0"
                        step="1000"
                        value={totalBudget || ''}
                        onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                        placeholder={labels.totalBudgetPlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pl-12"
                    />
                </div>
            </div>

            {/* Number of Guests */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.numberOfGuestsLabel}
                </label>
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={numberOfGuests || ''}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 0)}
                    placeholder={labels.numberOfGuestsPlaceholder}
                    className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                />
            </div>

            {/* Currency Selector */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.currencyLabel}
                </label>
                <div className="flex gap-2 flex-wrap">
                    {CURRENCIES.map((c) => (
                        <button
                            key={c.symbol}
                            onClick={() => setCurrency(c.symbol)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                currency === c.symbol
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Categories */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">
                        {labels.categoriesTitle}
                    </label>
                    {/* Reset with inline confirmation */}
                    {confirmReset ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#F59E0B]">{labels.confirmResetMessage}</span>
                            <button
                                onClick={handleResetConfirm}
                                aria-label={labels.confirmLabel}
                                className="w-6 h-6 rounded grid place-items-center text-[var(--clr-green-500)] hover:bg-[var(--clr-green-500)]/20 transition-colors"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => setConfirmReset(false)}
                                aria-label={labels.cancelLabel}
                                className="w-6 h-6 rounded grid place-items-center text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmReset(true)}
                            className="text-xs text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors"
                        >
                            {labels.resetLabel}
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {categories.map((cat, i) => {
                        const amount = Math.round((totalBudget * cat.percentage) / 100);
                        const isEditing = editingIndex === i;
                        const isConfirmingDelete = confirmDeleteIndex === i;

                        return (
                            <div key={cat.key} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                />

                                {/* Name: static or editable */}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') confirmEdit();
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                        className="w-36 md:w-48 bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-2 py-1 text-sm text-[var(--clr-neutral-0)] shrink-0"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-sm text-[var(--clr-neutral-0)] w-36 md:w-48 truncate shrink-0">
                                        {cat.name}
                                    </span>
                                )}

                                {/* Percentage input */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={cat.percentage || ''}
                                        onChange={(e) => handlePercentageChange(i, e.target.value)}
                                        className="w-16 bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-2 py-1.5 text-sm text-[var(--clr-neutral-0)] text-right"
                                    />
                                    <span className="text-xs text-[var(--clr-neutral-100)]">{labels.percentageLabel}</span>
                                </div>

                                {/* Amount input */}
                                <div className="flex-1 min-w-0">
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={amount || ''}
                                        onChange={(e) => handleAmountChange(i, e.target.value)}
                                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-2 py-1.5 text-sm text-[var(--clr-neutral-0)] text-right"
                                    />
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {isConfirmingDelete ? (
                                        <>
                                            <span className="text-xs text-[#F59E0B] hidden sm:inline">{labels.confirmDeleteMessage}</span>
                                            <button
                                                onClick={() => confirmDelete(i)}
                                                aria-label={labels.confirmLabel}
                                                className="w-7 h-7 rounded grid place-items-center text-[var(--clr-green-500)] hover:bg-[var(--clr-green-500)]/20 transition-colors"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteIndex(null)}
                                                aria-label={labels.cancelLabel}
                                                className="w-7 h-7 rounded grid place-items-center text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : isEditing ? (
                                        <>
                                            <button
                                                onClick={confirmEdit}
                                                disabled={!editName.trim() || categories.some(
                                                    (c, idx) => idx !== i && c.name.toLowerCase() === editName.trim().toLowerCase()
                                                )}
                                                aria-label={labels.confirmLabel}
                                                className="w-7 h-7 rounded grid place-items-center text-[var(--clr-green-500)] hover:bg-[var(--clr-green-500)]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                aria-label={labels.cancelLabel}
                                                className="w-7 h-7 rounded grid place-items-center text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => startEdit(i)}
                                                aria-label={labels.editCategoryAriaLabel}
                                                className="w-7 h-7 rounded grid place-items-center text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setConfirmDeleteIndex(i);
                                                    setEditingIndex(null);
                                                }}
                                                aria-label={labels.deleteCategoryAriaLabel}
                                                className="w-7 h-7 rounded grid place-items-center text-[var(--clr-neutral-100)] hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Category */}
                <div className="flex items-center gap-2 mt-3">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && canAdd) handleAddCategory(); }}
                        placeholder={labels.newCategoryNamePlaceholder}
                        className="flex-1 bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-2 py-1.5 text-sm text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)]"
                    />
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={newCategoryPercentage}
                        onChange={(e) => setNewCategoryPercentage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && canAdd) handleAddCategory(); }}
                        placeholder="%"
                        className="w-16 bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-2 py-1.5 text-sm text-[var(--clr-neutral-0)] text-right placeholder:text-[var(--clr-neutral-100)]"
                    />
                    <button
                        onClick={handleAddCategory}
                        disabled={!canAdd}
                        className="flex items-center gap-1 text-sm text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">{labels.addCategoryLabel}</span>
                    </button>
                </div>

                {/* Total Percentage Warning / Normalize */}
                <div className="mt-3 flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                        Math.abs(totalPercentage - 100) < 0.01
                            ? 'text-[var(--clr-green-500)]'
                            : 'text-[#F59E0B]'
                    }`}>
                        {labels.totalAllocatedLabel}: {totalPercentage.toFixed(1)}%
                    </span>
                    {Math.abs(totalPercentage - 100) >= 0.01 && (
                        <button
                            onClick={handleNormalize}
                            className="text-xs px-3 py-1 rounded-md bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)] transition-colors"
                        >
                            → 100%
                        </button>
                    )}
                </div>
                {Math.abs(totalPercentage - 100) >= 0.01 && (
                    <p className="text-xs text-[#F59E0B] mt-1">{labels.warningNotHundred}</p>
                )}
            </div>

            {/* Result Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultTotalBudget}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-green-500)]">
                        {formatValue(totalBudget, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultAllocated}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(Math.round(results.allocated), currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {isOver ? labels.resultOverBudget : labels.resultRemaining}
                    </p>
                    <p className={`text-xl md:text-2xl font-bold ${isOver ? 'text-[#EF4444]' : 'text-[var(--clr-green-500)]'}`}>
                        {formatValue(Math.abs(Math.round(results.remaining)), currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultCostPerGuest}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(Math.round(results.costPerGuest), currency)}
                    </p>
                </div>
            </div>

            {/* Donut Chart */}
            {chartData.length > 0 && (
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-[var(--clr-neutral-0)] uppercase tracking-wider mb-4">
                        {labels.chartTitle}
                    </h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="50%"
                                    outerRadius="80%"
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CHART_COLORS[
                                                categories.findIndex((c) => c.key === categories.filter((cc) => cc.percentage > 0)[index]?.key)
                                                % CHART_COLORS.length
                                            ]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--clr-neutral-1000)',
                                        border: '1px solid var(--clr-neutral-800)',
                                        borderRadius: '8px',
                                        color: 'var(--clr-neutral-0)',
                                    }}
                                    formatter={(value) => formatValue(Number(value), currency)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Budget Breakdown */}
            {categories.length > 0 && (
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--clr-neutral-0)] uppercase tracking-wider">
                        {labels.breakdownTitle}
                    </h3>
                    <div className="space-y-2">
                        {categories.map((cat, i) => {
                            const amount = Math.round((totalBudget * cat.percentage) / 100);
                            return (
                                <div key={cat.key}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                            />
                                            <span className="text-[var(--clr-neutral-100)]">
                                                {cat.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[var(--clr-neutral-100)] text-xs">
                                                {cat.percentage.toFixed(1)}%
                                            </span>
                                            <span className="text-[var(--clr-neutral-0)] font-medium">
                                                {formatValue(amount, currency)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-[var(--clr-neutral-800)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.min(cat.percentage, 100)}%`,
                                                backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
