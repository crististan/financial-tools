'use client';

import { useState, useMemo } from 'react';

type MovingCostEstimatorProps = {
    labels: {
        distanceLabel: string;
        distancePlaceholder: string;
        distanceUnit: string;
        volumeLabel: string;
        volumeSmall: string;
        volumeMedium: string;
        volumeLarge: string;
        volumeXL: string;
        packingLabel: string;
        packingNone: string;
        packingPartial: string;
        packingFull: string;
        storageLabel: string;
        storageYes: string;
        storageNo: string;
        storageDurationLabel: string;
        storageDurationUnit: string;
        flexibilityLabel: string;
        flexibilityFlexible: string;
        flexibilityFixed: string;
        currencyLabel: string;
        resultEstimatedCost: string;
        resultTransportCost: string;
        resultPackingCost: string;
        resultStorageCost: string;
        summaryTitle: string;
        summaryTransport: string;
        summaryPacking: string;
        summaryStorage: string;
        summarySurcharge: string;
        summaryTotal: string;
        currencySymbol: string;
    };
    configData: {
        baseRatePerKmPerM3: number;
        volumeTiers: { small: number; medium: number; large: number; xl: number };
        packingMultipliers: { none: number; partial: number; full: number };
        storageRatePerWeekPerM3: number;
        peakSurcharge: number;
        costRangeSpread: number;
    };
};

type VolumeTier = 'small' | 'medium' | 'large' | 'xl';
type PackingLevel = 'none' | 'partial' | 'full';

const CURRENCIES = [
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' },
    { symbol: 'lei', label: 'RON (lei)' },
];

function formatValue(value: number, currency: string): string {
    const formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    if (currency === 'lei') return `${formatted} ${currency}`;
    return `${currency}${formatted}`;
}

function formatRange(low: number, high: number, currency: string): string {
    return `${formatValue(low, currency)} – ${formatValue(high, currency)}`;
}

export default function MovingCostEstimator({ labels, configData }: MovingCostEstimatorProps) {
    const [distance, setDistance] = useState(100);
    const [volume, setVolume] = useState<VolumeTier>('medium');
    const [packing, setPacking] = useState<PackingLevel>('none');
    const [storageNeeded, setStorageNeeded] = useState(false);
    const [storageDuration, setStorageDuration] = useState(2);
    const [flexibility, setFlexibility] = useState<'flexible' | 'fixed'>('flexible');
    const [currency, setCurrency] = useState(labels.currencySymbol);

    const results = useMemo(() => {
        const dist = Math.max(0, distance || 0);
        const volumeM3 = configData.volumeTiers[volume];
        const baseTransport = dist * volumeM3 * configData.baseRatePerKmPerM3;
        const packingCost = baseTransport * configData.packingMultipliers[packing];
        const storageCost = storageNeeded
            ? storageDuration * volumeM3 * configData.storageRatePerWeekPerM3
            : 0;
        const subtotal = baseTransport + packingCost + storageCost;
        const surcharge = flexibility === 'fixed' ? subtotal * configData.peakSurcharge : 0;
        const total = subtotal + surcharge;
        const spread = configData.costRangeSpread;
        const low = Math.round(total * (1 - spread));
        const high = Math.round(total * (1 + spread));

        return {
            transportCost: Math.round(baseTransport),
            packingCost: Math.round(packingCost),
            storageCost: Math.round(storageCost),
            surcharge: Math.round(surcharge),
            total: Math.round(total),
            low,
            high,
        };
    }, [distance, volume, packing, storageNeeded, storageDuration, flexibility, configData]);

    const volumeOptions: { value: VolumeTier; label: string }[] = [
        { value: 'small', label: labels.volumeSmall },
        { value: 'medium', label: labels.volumeMedium },
        { value: 'large', label: labels.volumeLarge },
        { value: 'xl', label: labels.volumeXL },
    ];

    const packingOptions: { value: PackingLevel; label: string }[] = [
        { value: 'none', label: labels.packingNone },
        { value: 'partial', label: labels.packingPartial },
        { value: 'full', label: labels.packingFull },
    ];

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8 space-y-6">
            {/* Distance */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.distanceLabel}
                </label>
                <div className="relative">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={distance || ''}
                        onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                        placeholder={labels.distancePlaceholder}
                        className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] placeholder:text-[var(--clr-neutral-100)] pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                        {labels.distanceUnit}
                    </span>
                </div>
            </div>

            {/* Volume */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.volumeLabel}
                </label>
                <select
                    value={volume}
                    onChange={(e) => setVolume(e.target.value as VolumeTier)}
                    className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)]"
                >
                    {volumeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Packing Service */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.packingLabel}
                </label>
                <div className="flex gap-2 flex-wrap">
                    {packingOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setPacking(opt.value)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                packing === opt.value
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Storage */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.storageLabel}
                </label>
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setStorageNeeded(false)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            !storageNeeded
                                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                        }`}
                    >
                        {labels.storageNo}
                    </button>
                    <button
                        onClick={() => setStorageNeeded(true)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            storageNeeded
                                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                        }`}
                    >
                        {labels.storageYes}
                    </button>
                </div>
                {storageNeeded && (
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.storageDurationLabel}
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                step="1"
                                value={storageDuration}
                                onChange={(e) => setStorageDuration(Math.min(12, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-full bg-[var(--clr-neutral-800)] border border-[var(--clr-neutral-1000)] rounded-md px-3 py-3 text-[var(--clr-neutral-0)] pr-24"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--clr-neutral-100)] text-sm">
                                {labels.storageDurationUnit}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Flexibility */}
            <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                    {labels.flexibilityLabel}
                </label>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFlexibility('flexible')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            flexibility === 'flexible'
                                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                        }`}
                    >
                        {labels.flexibilityFlexible}
                    </button>
                    <button
                        onClick={() => setFlexibility('fixed')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            flexibility === 'fixed'
                                ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-1000)]'
                        }`}
                    >
                        {labels.flexibilityFixed}
                    </button>
                </div>
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

            {/* Result Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultEstimatedCost}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-[var(--clr-green-500)]">
                        {formatRange(results.low, results.high, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultTransportCost}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.transportCost, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultPackingCost}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.packingCost, currency)}
                    </p>
                </div>
                <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">
                        {labels.resultStorageCost}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[var(--clr-neutral-0)]">
                        {formatValue(results.storageCost, currency)}
                    </p>
                </div>
            </div>

            {/* Summary Breakdown */}
            <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-[var(--clr-neutral-0)] uppercase tracking-wider">
                    {labels.summaryTitle}
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryTransport}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.transportCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryPacking}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.packingCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--clr-neutral-100)]">
                        <span>{labels.summaryStorage}</span>
                        <span className="text-[var(--clr-neutral-0)]">{formatValue(results.storageCost, currency)}</span>
                    </div>
                    {results.surcharge > 0 && (
                        <div className="flex justify-between text-[var(--clr-neutral-100)]">
                            <span>{labels.summarySurcharge}</span>
                            <span className="text-[var(--clr-neutral-0)]">{formatValue(results.surcharge, currency)}</span>
                        </div>
                    )}
                    <div className="border-t border-[var(--clr-neutral-800)] pt-2 flex justify-between font-semibold">
                        <span className="text-[var(--clr-neutral-0)]">{labels.summaryTotal}</span>
                        <span className="text-[var(--clr-green-500)]">{formatValue(results.total, currency)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}