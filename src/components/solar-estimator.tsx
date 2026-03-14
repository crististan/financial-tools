'use client';

import { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Types for config data from site-config.json
type Region = {
    id: string;
    label: string;
    kwhPerKwp: number;
    counties: string;
};

type EnergyProvider = {
    id: string;
    name: string;
    retailPrice: number;
    prosumerPrice: number;
};

type SystemCostsTier = { min: number; avg: number; premium: number };

type SelfConsumptionConfig = {
    homeBaseRate: number;
    officeBaseRate: number;
    batteryFactor: number;
    maxRate: number;
};

type AdvancedParams = {
    panelDegradation: number;
    energyPriceIncrease: number;
    panelLifespan: number;
    batteryLifespan: number;
    performanceRatio: number;
    casaVerdeSubsidy: number;
    casaVerdeMinContribution: number;
};

export type SolarEstimatorConfig = {
    regions: Region[];
    monthlyDistribution: number[];
    monthNames: string[];
    energyProviders: EnergyProvider[];
    systemCosts: {
        panelsPerKw: SystemCostsTier;
        batteryPerKwh: SystemCostsTier;
        baseInstallation: SystemCostsTier;
    };
    selfConsumption: SelfConsumptionConfig;
    advancedParams: AdvancedParams;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Labels = Record<string, any>;

type SolarEstimatorProps = {
    labels: Labels;
    config: SolarEstimatorConfig;
};

type MonthlyData = {
    month: string;
    production: number;
    selfConsumption: number;
    surplus: number;
    gridConsumption: number;
    savings: number;
};

function formatNumber(value: number, decimals = 0): string {
    return value.toLocaleString('ro-RO', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export default function SolarEstimator({ labels, config }: SolarEstimatorProps) {
    const [systemPower, setSystemPower] = useState(labels.systemPowerDefault || 6);
    const [regionId, setRegionId] = useState(config.regions[4]?.id || 'medie-nationala');
    const [hasBattery, setHasBattery] = useState(false);
    const [batteryCapacity, setBatteryCapacity] = useState(labels.batteryCapacityDefault || 10);
    const [consumptionProfile, setConsumptionProfile] = useState<'home' | 'office'>('office');
    const [monthlyConsumption, setMonthlyConsumption] = useState(labels.monthlyConsumptionDefault || 420);
    const [providerId, setProviderId] = useState(config.energyProviders[6]?.id || 'medie');
    const [showMonthlyTable, setShowMonthlyTable] = useState(false);

    const region = useMemo(
        () => config.regions.find((r) => r.id === regionId) || config.regions[4],
        [regionId, config.regions]
    );

    const provider = useMemo(
        () => config.energyProviders.find((p) => p.id === providerId) || config.energyProviders[6],
        [providerId, config.energyProviders]
    );

    // Normalize monthly distribution to 100%
    const normalizedDistribution = useMemo(() => {
        const total = config.monthlyDistribution.reduce((sum, v) => sum + v, 0);
        return config.monthlyDistribution.map((v) => v / total);
    }, [config.monthlyDistribution]);

    // Self-consumption rate
    const selfConsumptionRate = useMemo(() => {
        const sc = config.selfConsumption;
        const baseRate = consumptionProfile === 'home' ? sc.homeBaseRate : sc.officeBaseRate;
        if (!hasBattery) return baseRate;
        return Math.min(sc.maxRate, baseRate + batteryCapacity * sc.batteryFactor);
    }, [hasBattery, batteryCapacity, consumptionProfile, config.selfConsumption]);

    // Annual production
    const annualProduction = useMemo(
        () => systemPower * region.kwhPerKwp,
        [systemPower, region]
    );

    // Monthly breakdown
    const monthlyData: MonthlyData[] = useMemo(() => {
        return normalizedDistribution.map((pct, i) => {
            const production = annualProduction * pct;
            const rawSelfConsumption = production * selfConsumptionRate;
            const selfCons = Math.min(rawSelfConsumption, monthlyConsumption);
            const surplus = production - selfCons;
            const gridConsumption = Math.max(0, monthlyConsumption - selfCons);
            const savingsFromSelfCons = selfCons * provider.retailPrice;
            const surplusValue = surplus * provider.prosumerPrice;
            const savings = savingsFromSelfCons + surplusValue;

            return {
                month: config.monthNames[i],
                production: Math.round(production),
                selfConsumption: Math.round(selfCons),
                surplus: Math.round(surplus),
                gridConsumption: Math.round(gridConsumption),
                savings: Math.round(savings),
            };
        });
    }, [annualProduction, normalizedDistribution, selfConsumptionRate, monthlyConsumption, provider, config.monthNames]);

    // Totals
    const totals = useMemo(() => {
        const totalProduction = monthlyData.reduce((s, m) => s + m.production, 0);
        const totalSelfConsumption = monthlyData.reduce((s, m) => s + m.selfConsumption, 0);
        const totalSurplus = monthlyData.reduce((s, m) => s + m.surplus, 0);
        const totalSavings = monthlyData.reduce((s, m) => s + m.savings, 0);
        return { totalProduction, totalSelfConsumption, totalSurplus, totalSavings };
    }, [monthlyData]);

    const selfConsumptionPercent = useMemo(
        () => totals.totalProduction > 0 ? (totals.totalSelfConsumption / totals.totalProduction * 100) : 0,
        [totals]
    );

    // System cost estimate (average tier)
    const systemCost = useMemo(() => {
        const costs = config.systemCosts;
        let cost = systemPower * costs.panelsPerKw.avg + costs.baseInstallation.avg;
        if (hasBattery) {
            cost += batteryCapacity * costs.batteryPerKwh.avg;
        }
        return cost;
    }, [systemPower, hasBattery, batteryCapacity, config.systemCosts]);

    // ROI calculations
    const roi = useMemo(() => {
        const ap = config.advancedParams;
        const paybackNoSubsidy = totals.totalSavings > 0 ? systemCost / totals.totalSavings : 0;
        const subsidizedCost = Math.max(ap.casaVerdeMinContribution, systemCost - ap.casaVerdeSubsidy);
        const paybackWithSubsidy = totals.totalSavings > 0 ? subsidizedCost / totals.totalSavings : 0;

        // 25-year cumulative savings with degradation and price increase
        let cumulativeSavings = 0;
        for (let year = 1; year <= ap.panelLifespan; year++) {
            const degradationFactor = Math.pow(1 - ap.panelDegradation, year - 1);
            const priceIncreaseFactor = Math.pow(1 + ap.energyPriceIncrease, year - 1);
            cumulativeSavings += totals.totalSavings * degradationFactor * priceIncreaseFactor;
        }

        return {
            paybackNoSubsidy: Math.round(paybackNoSubsidy * 10) / 10,
            paybackWithSubsidy: Math.round(paybackWithSubsidy * 10) / 10,
            subsidizedCost,
            cumulativeSavings: Math.round(cumulativeSavings),
        };
    }, [systemCost, totals.totalSavings, config.advancedParams]);

    // Comparison: with vs without battery
    const comparison = useMemo(() => {
        const sc = config.selfConsumption;
        const costs = config.systemCosts;
        const baseRate = consumptionProfile === 'home' ? sc.homeBaseRate : sc.officeBaseRate;
        const withBatteryRate = Math.min(sc.maxRate, baseRate + 10 * sc.batteryFactor);

        const calcSavings = (rate: number) => {
            return normalizedDistribution.reduce((total, pct) => {
                const prod = annualProduction * pct;
                const selfCons = Math.min(prod * rate, monthlyConsumption);
                const surplus = prod - selfCons;
                return total + selfCons * provider.retailPrice + surplus * provider.prosumerPrice;
            }, 0);
        };

        const noBatterySavings = calcSavings(baseRate);
        const withBatterySavings = calcSavings(withBatteryRate);

        const noBatteryCost = systemPower * costs.panelsPerKw.avg + costs.baseInstallation.avg;
        const withBatteryCost = noBatteryCost + 10 * costs.batteryPerKwh.avg;

        return {
            noBattery: {
                rate: Math.round(baseRate * 100),
                savings: Math.round(noBatterySavings),
                payback: noBatterySavings > 0 ? Math.round(noBatteryCost / noBatterySavings * 10) / 10 : 0,
            },
            withBattery: {
                rate: Math.round(withBatteryRate * 100),
                savings: Math.round(withBatterySavings),
                payback: withBatterySavings > 0 ? Math.round(withBatteryCost / withBatterySavings * 10) / 10 : 0,
            },
        };
    }, [annualProduction, normalizedDistribution, monthlyConsumption, provider, consumptionProfile, systemPower, config.selfConsumption, config.systemCosts]);

    // Chart data (short month names for display)
    const chartData = useMemo(() => {
        return monthlyData.map((m) => ({
            name: m.month.substring(0, 3),
            [labels.chartSelfConsumption]: m.selfConsumption,
            [labels.chartSurplus]: m.surplus,
            [labels.chartConsumption]: m.gridConsumption,
        }));
    }, [monthlyData, labels]);

    const inputClasses = "w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md";
    const labelClasses = "block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2";
    const resultCardClasses = "bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center";

    return (
        <div className="w-full max-w-[800px] mx-auto space-y-8">
            {/* Input Form */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                {/* System Power - Slider */}
                <div className="mb-5">
                    <label className={labelClasses}>
                        {labels.systemPowerLabel}: <span className="text-[var(--clr-green-500)] font-bold text-sm">{systemPower} kWp</span>
                    </label>
                    <input
                        type="range"
                        className="w-full accent-[var(--clr-green-500)] h-2 cursor-pointer"
                        min={labels.systemPowerMin}
                        max={labels.systemPowerMax}
                        step={0.5}
                        value={systemPower}
                        onChange={(e) => setSystemPower(parseFloat(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-[var(--clr-neutral-100)] mt-1">
                        <span>{labels.systemPowerMin} kWp</span>
                        <span>{labels.systemPowerMax} kWp</span>
                    </div>
                </div>

                {/* Region */}
                <div className="mb-5">
                    <label className={labelClasses}>{labels.regionLabel}</label>
                    <select
                        className={inputClasses}
                        value={regionId}
                        onChange={(e) => setRegionId(e.target.value)}
                    >
                        {config.regions.map((r) => (
                            <option key={r.id} value={r.id} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
                                {r.label} ({r.kwhPerKwp} kWh/kWp/an)
                            </option>
                        ))}
                    </select>
                    {region.counties && (
                        <p className="text-xs text-[var(--clr-neutral-100)] mt-1">{region.counties}</p>
                    )}
                </div>

                {/* Consumption Profile */}
                <div className="mb-5">
                    <label className={labelClasses}>{labels.consumptionProfileLabel}</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className={`flex-1 p-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                consumptionProfile === 'home'
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)]'
                            }`}
                            onClick={() => setConsumptionProfile('home')}
                        >
                            {labels.profileHome}
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                consumptionProfile === 'office'
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)]'
                            }`}
                            onClick={() => setConsumptionProfile('office')}
                        >
                            {labels.profileOffice}
                        </button>
                    </div>
                </div>

                {/* Monthly Consumption */}
                <div className="mb-5">
                    <label className={labelClasses}>{labels.monthlyConsumptionLabel}</label>
                    <input
                        type="number"
                        className={inputClasses}
                        value={monthlyConsumption || ''}
                        onChange={(e) => {
                            const v = parseInt(e.target.value);
                            setMonthlyConsumption(isNaN(v) ? 0 : v);
                        }}
                        min={0}
                    />
                </div>

                {/* Battery Toggle */}
                <div className="mb-5">
                    <label className={labelClasses}>{labels.hasBatteryLabel}</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className={`flex-1 p-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                !hasBattery
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)]'
                            }`}
                            onClick={() => setHasBattery(false)}
                        >
                            {labels.batteryNo}
                        </button>
                        <button
                            type="button"
                            className={`flex-1 p-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                                hasBattery
                                    ? 'bg-[var(--clr-green-500)] text-[var(--clr-neutral-1000)]'
                                    : 'bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)]'
                            }`}
                            onClick={() => setHasBattery(true)}
                        >
                            {labels.batteryYes}
                        </button>
                    </div>
                </div>

                {/* Battery Capacity Slider */}
                {hasBattery && (
                    <div className="mb-5">
                        <label className={labelClasses}>
                            {labels.batteryCapacityLabel}: <span className="text-[var(--clr-green-500)] font-bold text-sm">{batteryCapacity} kWh</span>
                        </label>
                        <input
                            type="range"
                            className="w-full accent-[var(--clr-green-500)] h-2 cursor-pointer"
                            min={labels.batteryCapacityMin}
                            max={labels.batteryCapacityMax}
                            step={1}
                            value={batteryCapacity}
                            onChange={(e) => setBatteryCapacity(parseInt(e.target.value))}
                        />
                        <div className="flex justify-between text-xs text-[var(--clr-neutral-100)] mt-1">
                            <span>{labels.batteryCapacityMin} kWh</span>
                            <span>{labels.batteryCapacityMax} kWh</span>
                        </div>
                    </div>
                )}

                {/* Energy Provider */}
                <div className="mb-5">
                    <label className={labelClasses}>{labels.providerLabel}</label>
                    <select
                        className={inputClasses}
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                    >
                        {config.energyProviders.map((p) => (
                            <option key={p.id} value={p.id} className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">
                                {p.name} — {p.retailPrice.toFixed(2)} {labels.leiUnit}/kWh
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-[var(--clr-neutral-100)] mt-1">
                        {labels.retailPriceNote}: {provider.retailPrice.toFixed(2)} {labels.leiUnit}/kWh | {labels.prosumerPriceNote}: {provider.prosumerPrice.toFixed(2)} {labels.leiUnit}/kWh
                    </p>
                </div>
            </div>

            {/* Results */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[var(--clr-neutral-0)] mb-6">{labels.resultsTitle}</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.annualProductionLabel}</p>
                        <p className="text-xl font-bold text-[var(--clr-green-500)]">{formatNumber(totals.totalProduction)}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.kwhPerYearUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.selfConsumptionLabel}</p>
                        <p className="text-xl font-bold text-[var(--clr-neutral-0)]">{formatNumber(totals.totalSelfConsumption)}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.kwhPerYearUnit} ({formatNumber(selfConsumptionPercent, 0)}%)</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.surplusLabel}</p>
                        <p className="text-xl font-bold text-[var(--clr-neutral-0)]">{formatNumber(totals.totalSurplus)}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.kwhPerYearUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.totalAnnualSavingsLabel}</p>
                        <p className="text-xl font-bold text-[var(--clr-green-500)]">{formatNumber(totals.totalSavings)}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.leiPerYearUnit}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.monthlyProductionLabel}</p>
                        <p className="text-lg font-bold text-[var(--clr-neutral-0)]">{formatNumber(Math.round(totals.totalProduction / 12))}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.kwhUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.savingsFromSelfConsumptionLabel}</p>
                        <p className="text-lg font-bold text-[var(--clr-neutral-0)]">{formatNumber(Math.round(totals.totalSelfConsumption * provider.retailPrice))}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.leiPerYearUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.surplusValueLabel}</p>
                        <p className="text-lg font-bold text-[var(--clr-neutral-0)]">{formatNumber(Math.round(totals.totalSurplus * provider.prosumerPrice))}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.leiPerYearUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.totalMonthlySavingsLabel}</p>
                        <p className="text-lg font-bold text-[var(--clr-green-500)]">{formatNumber(Math.round(totals.totalSavings / 12))}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.leiPerMonthUnit}</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[var(--clr-neutral-0)] mb-6">{labels.chartTitle}</h3>
                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-neutral-800)" />
                            <XAxis dataKey="name" tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--clr-neutral-1000)',
                                    border: '1px solid var(--clr-neutral-800)',
                                    borderRadius: '8px',
                                    color: 'var(--clr-neutral-0)',
                                }}
                                labelStyle={{ color: 'var(--clr-neutral-0)' }}
                            />
                            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--clr-neutral-100)' }} />
                            <Bar dataKey={labels.chartSelfConsumption} stackId="production" fill="#09E789" radius={[0, 0, 0, 0]} />
                            <Bar dataKey={labels.chartSurplus} stackId="production" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                            <Bar dataKey={labels.chartConsumption} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-[var(--clr-neutral-100)] mt-4">{labels.netMeteringNote}</p>
            </div>

            {/* Comparison: with vs without battery */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[var(--clr-neutral-0)] mb-6">{labels.comparisonTitle}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-5">
                        <h4 className="text-sm font-bold text-[var(--clr-neutral-0)] mb-4">{labels.comparisonWithoutBattery}</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.comparisonSelfConsumption}</p>
                                <p className="text-lg font-bold text-[var(--clr-neutral-0)]">{comparison.noBattery.rate}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.comparisonAnnualSavings}</p>
                                <p className="text-lg font-bold text-[var(--clr-neutral-0)]">{formatNumber(comparison.noBattery.savings)} {labels.leiUnit}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.comparisonPayback}</p>
                                <p className="text-lg font-bold text-[var(--clr-neutral-0)]">{comparison.noBattery.payback} {labels.yearsUnit}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-5 border border-[var(--clr-green-500)]">
                        <h4 className="text-sm font-bold text-[var(--clr-green-500)] mb-4">{labels.comparisonWithBattery}</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.comparisonSelfConsumption}</p>
                                <p className="text-lg font-bold text-[var(--clr-green-500)]">{comparison.withBattery.rate}%</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.comparisonAnnualSavings}</p>
                                <p className="text-lg font-bold text-[var(--clr-green-500)]">{formatNumber(comparison.withBattery.savings)} {labels.leiUnit}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.comparisonPayback}</p>
                                <p className="text-lg font-bold text-[var(--clr-green-500)]">{comparison.withBattery.payback} {labels.yearsUnit}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROI Section */}
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-[var(--clr-neutral-0)] mb-6">{labels.roiTitle}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.systemCostLabel}</p>
                        <p className="text-xl font-bold text-[var(--clr-neutral-0)]">{formatNumber(systemCost)}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.leiUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.paybackPeriodLabel} ({labels.withoutSubsidyLabel})</p>
                        <p className="text-xl font-bold text-[var(--clr-neutral-0)]">{roi.paybackNoSubsidy}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.yearsUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.paybackPeriodLabel} ({labels.withSubsidyLabel})</p>
                        <p className="text-xl font-bold text-[var(--clr-green-500)]">{roi.paybackWithSubsidy}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.yearsUnit}</p>
                    </div>
                    <div className={resultCardClasses}>
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">{labels.savings25YearsLabel}</p>
                        <p className="text-xl font-bold text-[var(--clr-green-500)]">{formatNumber(roi.cumulativeSavings)}</p>
                        <p className="text-xs text-[var(--clr-neutral-100)]">{labels.leiUnit}</p>
                    </div>
                </div>
                <p className="text-xs text-[var(--clr-neutral-100)]">{labels.casaVerdeNote}</p>
            </div>

            {/* Monthly Breakdown Table (collapsible) */}
            <div>
                <button
                    type="button"
                    className="flex items-center gap-2 text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer mb-4"
                    onClick={() => setShowMonthlyTable(!showMonthlyTable)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className={`transition-transform duration-300 ${showMonthlyTable ? 'rotate-90' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-medium">{labels.monthlyBreakdownTitle}</span>
                </button>

                {showMonthlyTable && (
                    <div className="overflow-x-auto rounded-xl border border-[var(--clr-neutral-800)]">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--clr-neutral-900)] sticky top-0">
                                <tr>
                                    <th className="text-left p-3 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.monthlyHeaders.month}</th>
                                    <th className="text-right p-3 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.monthlyHeaders.production}</th>
                                    <th className="text-right p-3 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.monthlyHeaders.selfConsumption}</th>
                                    <th className="text-right p-3 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.monthlyHeaders.surplus}</th>
                                    <th className="text-right p-3 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.monthlyHeaders.savings}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyData.map((row) => (
                                    <tr key={row.month} className="border-t border-[var(--clr-neutral-800)]">
                                        <td className="p-3 text-[var(--clr-neutral-0)] font-medium">{row.month}</td>
                                        <td className="p-3 text-right text-[var(--clr-neutral-0)]">{formatNumber(row.production)}</td>
                                        <td className="p-3 text-right text-[var(--clr-green-500)]">{formatNumber(row.selfConsumption)}</td>
                                        <td className="p-3 text-right text-amber-400">{formatNumber(row.surplus)}</td>
                                        <td className="p-3 text-right text-[var(--clr-green-500)] font-medium">{formatNumber(row.savings)}</td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-[var(--clr-neutral-100)] font-bold">
                                    <td className="p-3 text-[var(--clr-neutral-0)]">TOTAL</td>
                                    <td className="p-3 text-right text-[var(--clr-neutral-0)]">{formatNumber(totals.totalProduction)}</td>
                                    <td className="p-3 text-right text-[var(--clr-green-500)]">{formatNumber(totals.totalSelfConsumption)}</td>
                                    <td className="p-3 text-right text-amber-400">{formatNumber(totals.totalSurplus)}</td>
                                    <td className="p-3 text-right text-[var(--clr-green-500)]">{formatNumber(totals.totalSavings)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-[var(--clr-neutral-100)] leading-relaxed bg-[var(--clr-neutral-900)] rounded-lg p-4 border-l-4 border-amber-400">
                {labels.disclaimer}
            </p>
        </div>
    );
}
