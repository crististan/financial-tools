'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

type EngineType = 'outboard' | 'inboard' | 'sailAux';
type WindCondition = 'calm' | 'light' | 'moderate' | 'strong';
type CurrentCondition = 'none' | 'favorable' | 'against';

type NauticalFuelCalculatorProps = {
    labels: {
        distanceLabel: string;
        distancePlaceholder: string;
        speedLabel: string;
        speedPlaceholder: string;
        engineTypeLabel: string;
        engineTypes: {
            outboard: string;
            inboard: string;
            sailAux: string;
        };
        enginePowerLabel: string;
        enginePowerPlaceholder: string;
        tankCapacityLabel: string;
        tankCapacityPlaceholder: string;
        fuelPriceLabel: string;
        fuelPricePlaceholder: string;
        windLabel: string;
        windOptions: {
            calm: string;
            light: string;
            moderate: string;
            strong: string;
        };
        currentLabel: string;
        currentOptions: {
            none: string;
            favorable: string;
            against: string;
        };
        resultTravelTime: string;
        resultFuelConsumption: string;
        resultTotalCost: string;
        resultAutonomy: string;
        hoursUnit: string;
        litersUnit: string;
        nmiUnit: string;
        chartTitle: string;
        chartFuelRate: string;
        chartFuelRateWeather: string;
        chartSpeed: string;
        currencySymbol: string;
        currentSpeedMarker: string;
    };
};

const ENGINE_CONFIGS: Record<EngineType, { fuelFactor: number; cruisingSpeed: number; maxSpeed: number; exponent: number }> = {
    outboard: { fuelFactor: 0.10, cruisingSpeed: 15, maxSpeed: 35, exponent: 2 },
    inboard: { fuelFactor: 0.065, cruisingSpeed: 10, maxSpeed: 25, exponent: 2 },
    sailAux: { fuelFactor: 0.055, cruisingSpeed: 6, maxSpeed: 12, exponent: 1.5 },
};

const WIND_MULTIPLIERS: Record<WindCondition, number> = {
    calm: 1.0,
    light: 1.1,
    moderate: 1.25,
    strong: 1.5,
};

const CURRENT_ADJUSTMENTS: Record<CurrentCondition, number> = {
    none: 0,
    favorable: 1.0,
    against: -1.5,
};

function calculateFuelRate(engineType: EngineType, hp: number, speed: number): number {
    const config = ENGINE_CONFIGS[engineType];
    const speedRatio = speed / config.cruisingSpeed;
    return hp * config.fuelFactor * Math.pow(Math.max(speedRatio, 0.1), config.exponent);
}

function formatNumber(value: number, decimals: number = 1): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export default function NauticalFuelCalculator({ labels }: NauticalFuelCalculatorProps) {
    const [distance, setDistance] = useState(50);
    const [speed, setSpeed] = useState(8);
    const [engineType, setEngineType] = useState<EngineType>('inboard');
    const [enginePower, setEnginePower] = useState(150);
    const [tankCapacity, setTankCapacity] = useState(300);
    const [fuelPrice, setFuelPrice] = useState(1.85);
    const [wind, setWind] = useState<WindCondition>('calm');
    const [current, setCurrent] = useState<CurrentCondition>('none');

    const effectiveSpeed = useMemo(() => {
        return Math.max(0.5, speed + CURRENT_ADJUSTMENTS[current]);
    }, [speed, current]);

    const windMultiplier = WIND_MULTIPLIERS[wind];

    const baseFuelRate = useMemo(() => {
        if (enginePower <= 0 || speed <= 0) return 0;
        return calculateFuelRate(engineType, enginePower, speed);
    }, [engineType, enginePower, speed]);

    const adjustedFuelRate = baseFuelRate * windMultiplier;

    const isValid = distance > 0 && speed > 0 && enginePower > 0 && effectiveSpeed > 0;

    const travelTime = useMemo(() => {
        if (!isValid) return 0;
        return distance / effectiveSpeed;
    }, [distance, effectiveSpeed, isValid]);

    const totalFuel = useMemo(() => {
        return adjustedFuelRate * travelTime;
    }, [adjustedFuelRate, travelTime]);

    const totalCost = totalFuel * fuelPrice;

    const autonomy = useMemo(() => {
        if (adjustedFuelRate <= 0) return 0;
        return (tankCapacity / adjustedFuelRate) * effectiveSpeed;
    }, [tankCapacity, adjustedFuelRate, effectiveSpeed]);

    // Chart data: fuel rate vs speed curve
    const chartData = useMemo(() => {
        const config = ENGINE_CONFIGS[engineType];
        const maxSpd = config.maxSpeed;
        const points: Record<string, string | number>[] = [];

        for (let spd = 1; spd <= maxSpd; spd++) {
            const base = calculateFuelRate(engineType, enginePower, spd);
            const point: Record<string, string | number> = {
                name: `${spd}`,
                [labels.chartFuelRate]: Math.round(base * 10) / 10,
            };
            if (wind !== 'calm') {
                point[labels.chartFuelRateWeather] = Math.round(base * windMultiplier * 10) / 10;
            }
            points.push(point);
        }

        return points;
    }, [engineType, enginePower, wind, windMultiplier, labels]);

    function handleNumberInput(setter: (v: number) => void) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const parsed = parseFloat(e.target.value);
            setter(isNaN(parsed) ? 0 : parsed);
        };
    }

    return (
        <div className="w-full">
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                {/* Row 1: Distance + Speed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.distanceLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.distancePlaceholder}
                            value={distance || ''}
                            onChange={handleNumberInput(setDistance)}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.speedLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.speedPlaceholder}
                            value={speed || ''}
                            onChange={handleNumberInput(setSpeed)}
                            min={0}
                            max={50}
                            step={0.5}
                        />
                    </div>
                </div>

                {/* Row 2: Engine Type + Power */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.engineTypeLabel}
                        </label>
                        <select
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            value={engineType}
                            onChange={(e) => setEngineType(e.target.value as EngineType)}
                        >
                            <option value="outboard" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.engineTypes.outboard}</option>
                            <option value="inboard" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.engineTypes.inboard}</option>
                            <option value="sailAux" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.engineTypes.sailAux}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.enginePowerLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.enginePowerPlaceholder}
                            value={enginePower || ''}
                            onChange={handleNumberInput(setEnginePower)}
                            min={1}
                            max={2000}
                        />
                    </div>
                </div>

                {/* Row 3: Tank + Fuel Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.tankCapacityLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.tankCapacityPlaceholder}
                            value={tankCapacity || ''}
                            onChange={handleNumberInput(setTankCapacity)}
                            min={0}
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.fuelPriceLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={labels.fuelPricePlaceholder}
                            value={fuelPrice || ''}
                            onChange={handleNumberInput(setFuelPrice)}
                            min={0}
                            step={0.01}
                        />
                    </div>
                </div>

                {/* Row 4: Wind + Current */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.windLabel}
                        </label>
                        <select
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            value={wind}
                            onChange={(e) => setWind(e.target.value as WindCondition)}
                        >
                            <option value="calm" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.windOptions.calm}</option>
                            <option value="light" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.windOptions.light}</option>
                            <option value="moderate" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.windOptions.moderate}</option>
                            <option value="strong" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.windOptions.strong}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.currentLabel}
                        </label>
                        <select
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            value={current}
                            onChange={(e) => setCurrent(e.target.value as CurrentCondition)}
                        >
                            <option value="none" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.currentOptions.none}</option>
                            <option value="favorable" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.currentOptions.favorable}</option>
                            <option value="against" className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]">{labels.currentOptions.against}</option>
                        </select>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--clr-neutral-1000)] mb-6" />

                {/* Results - 4 metric cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultTravelTime}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? `${formatNumber(travelTime)} ${labels.hoursUnit}` : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultFuelConsumption}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[var(--clr-green-500)]">
                            {isValid ? `${formatNumber(totalFuel)} ${labels.litersUnit}` : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultTotalCost}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? `${labels.currencySymbol}${formatNumber(totalCost, 2)}` : '—'}
                        </p>
                    </div>
                    <div className="bg-[var(--clr-neutral-1000)] rounded-xl p-4 text-center">
                        <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {labels.resultAutonomy}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">
                            {isValid ? `${formatNumber(autonomy)} ${labels.nmiUnit}` : '—'}
                        </p>
                    </div>
                </div>

                {/* Chart: Fuel vs Speed */}
                {isValid && chartData.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--clr-neutral-100)] uppercase tracking-wider mb-3">
                            {labels.chartTitle}
                        </h3>
                        <div className="w-full h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-neutral-800)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }}
                                        label={{ value: labels.chartSpeed, position: 'insideBottom', offset: -2, fill: 'var(--clr-neutral-100)', fontSize: 11 }}
                                    />
                                    <YAxis
                                        tick={{ fill: 'var(--clr-neutral-100)', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--clr-neutral-1000)',
                                            border: '1px solid var(--clr-neutral-800)',
                                            borderRadius: '8px',
                                            color: 'var(--clr-neutral-0)',
                                        }}
                                        labelStyle={{ color: 'var(--clr-neutral-0)' }}
                                        formatter={(value) => `${Number(value).toFixed(1)} L/h`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: 12, color: 'var(--clr-neutral-100)' }} />
                                    <Area
                                        type="monotone"
                                        dataKey={labels.chartFuelRate}
                                        fill="#09E789"
                                        stroke="#09E789"
                                        fillOpacity={0.3}
                                    />
                                    {wind !== 'calm' && (
                                        <Area
                                            type="monotone"
                                            dataKey={labels.chartFuelRateWeather}
                                            fill="#F59E0B"
                                            stroke="#F59E0B"
                                            fillOpacity={0.15}
                                            strokeDasharray="5 5"
                                        />
                                    )}
                                    {speed > 0 && speed <= ENGINE_CONFIGS[engineType].maxSpeed && (
                                        <ReferenceLine
                                            x={`${Math.round(speed)}`}
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            strokeDasharray="3 3"
                                            label={{
                                                value: labels.currentSpeedMarker,
                                                position: 'top',
                                                fill: '#3B82F6',
                                                fontSize: 11,
                                            }}
                                        />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}