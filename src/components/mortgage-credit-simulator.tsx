'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import AmortizationTable from './amortization-table';
import type { MortgageRatesRO } from '@/lib/mortgage-rates-ro';

type RateType = 'fixed' | 'variable';

type OfferInput = {
    loanAmount: number;
    downPaymentPercent: number;
    termYears: number;
    rateType: RateType;
    fixedRate: number;
    margin: number;
};

type AmortizationRow = {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Labels = Record<string, any>;

type Props = {
    labels: Labels;
    rates: MortgageRatesRO;
};

function calculateMonthlyPayment(principal: number, annualRate: number, totalMonths: number): number {
    if (principal <= 0 || totalMonths <= 0) return 0;
    if (annualRate === 0) return principal / totalMonths;
    const monthlyRate = annualRate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
}

function generateSchedule(principal: number, annualRate: number, totalMonths: number, monthlyPayment: number): AmortizationRow[] {
    const schedule: AmortizationRow[] = [];
    let balance = principal;
    const monthlyRate = annualRate / 100 / 12;
    for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance = Math.max(0, balance - principalPayment);
        schedule.push({ month, payment: monthlyPayment, principal: principalPayment, interest: interestPayment, balance });
    }
    return schedule;
}

// Newton-Raphson IRR — returns annual effective rate (DAE) as percentage.
// Falls back to the nominal rate when fees are zero or solver diverges.
function calculateDAE(
    loanAmount: number,
    monthlyPayment: number,
    totalMonths: number,
    upfrontFees: number,
    monthlyExtraFees: number,
    fallbackAnnualRate: number,
): number {
    if (loanAmount <= 0 || totalMonths <= 0 || monthlyPayment <= 0) return fallbackAnnualRate;
    if (upfrontFees === 0 && monthlyExtraFees === 0) return fallbackAnnualRate;

    const totalMonthlyOutflow = monthlyPayment + monthlyExtraFees;
    const netDisbursed = loanAmount - upfrontFees;
    if (netDisbursed <= 0) return fallbackAnnualRate;

    let rate = (fallbackAnnualRate / 100) / 12;
    if (rate <= 0) rate = 0.005;
    for (let iter = 0; iter < 80; iter++) {
        let npv = -netDisbursed;
        let dnpv = 0;
        for (let t = 1; t <= totalMonths; t++) {
            const factor = Math.pow(1 + rate, t);
            npv += totalMonthlyOutflow / factor;
            dnpv -= (t * totalMonthlyOutflow) / (factor * (1 + rate));
        }
        if (Math.abs(npv) < 1e-6) break;
        if (Math.abs(dnpv) < 1e-12) return fallbackAnnualRate;
        const newRate = rate - npv / dnpv;
        if (!isFinite(newRate) || newRate <= 0) {
            rate = rate / 2;
        } else {
            rate = newRate;
        }
    }
    const dae = rate * 12 * 100;
    if (!isFinite(dae) || dae < 0) return fallbackAnnualRate;
    return dae;
}

type OfferResults = {
    effectiveRate: number;
    propertyValue: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    dae: number;
    totalMonths: number;
};

function computeOfferResults(offer: OfferInput, rates: MortgageRatesRO): OfferResults {
    const effectiveRate = offer.rateType === 'fixed' ? offer.fixedRate : rates.ircc.value + offer.margin;
    const propertyValue =
        offer.downPaymentPercent > 0 && offer.downPaymentPercent < 100
            ? offer.loanAmount / (1 - offer.downPaymentPercent / 100)
            : offer.loanAmount;
    const totalMonths = offer.termYears * 12;
    const monthlyPayment = calculateMonthlyPayment(offer.loanAmount, effectiveRate, totalMonths);
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - offer.loanAmount;

    const fees = rates.fees;
    const upfrontFromPercent = (fees.applicationFeePercent / 100) * offer.loanAmount;
    const upfrontFee = fees.applicationFeeMax > 0 ? Math.min(upfrontFromPercent, fees.applicationFeeMax) : upfrontFromPercent;
    const monthlyAdminFee = (fees.monthlyAdminFeePercent / 100) * offer.loanAmount;
    const propertyInsuranceMonthly = (fees.propertyInsuranceAnnualPercent / 100) * propertyValue / 12;
    const lifeInsuranceMonthly = (fees.lifeInsuranceAnnualPercent / 100) * offer.loanAmount / 12;
    const totalMonthlyFees = monthlyAdminFee + propertyInsuranceMonthly + lifeInsuranceMonthly;

    const dae = calculateDAE(offer.loanAmount, monthlyPayment, totalMonths, upfrontFee, totalMonthlyFees, effectiveRate);

    return { effectiveRate, propertyValue, monthlyPayment, totalPayment, totalInterest, dae, totalMonths };
}

function formatNumber(value: number, decimals = 2): string {
    if (!isFinite(value)) return '—';
    return value.toLocaleString('ro-RO', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatLei(value: number): string {
    if (!isFinite(value) || value <= 0) return '—';
    return `${formatNumber(value)} lei`;
}

function formatPercent(value: number, decimals = 2): string {
    if (!isFinite(value)) return '—';
    return `${formatNumber(value, decimals)}%`;
}

function parseNumber(value: string): number {
    const parsed = parseFloat(value.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
}

type OfferCardProps = {
    title: string;
    subtitle: string;
    offer: OfferInput;
    results: OfferResults;
    rates: MortgageRatesRO;
    labels: Labels;
    onChange: (next: OfferInput) => void;
    accentBorder: string;
};

function OfferCard({ title, subtitle, offer, results, rates, labels, onChange, accentBorder }: OfferCardProps) {
    const ol = labels.offer;

    function update<K extends keyof OfferInput>(key: K, value: OfferInput[K]) {
        onChange({ ...offer, [key]: value });
    }

    return (
        <div className={`bg-[var(--clr-neutral-1000)] rounded-2xl p-5 md:p-6 border-l-4 ${accentBorder}`}>
            <div className="mb-5">
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--clr-neutral-0)]">{title}</h3>
                <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {ol.loanAmountLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-base font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={ol.loanAmountPlaceholder}
                        value={offer.loanAmount || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => update('loanAmount', parseNumber(e.target.value))}
                        min={0}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {ol.downPaymentLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-base font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={ol.downPaymentPlaceholder}
                        value={offer.downPaymentPercent || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => update('downPaymentPercent', parseNumber(e.target.value))}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {ol.termLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-base font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={ol.termPlaceholder}
                        value={offer.termYears || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => update('termYears', parseNumber(e.target.value))}
                        min={rates.limits.minTermYears}
                        max={rates.limits.maxTermYears}
                        step={1}
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {ol.rateTypeLabel}
                    </label>
                    <select
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        value={offer.rateType}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => update('rateType', e.target.value as RateType)}
                    >
                        <option className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]" value="fixed">{ol.rateTypeFixed}</option>
                        <option className="bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)]" value="variable">{ol.rateTypeVariable}</option>
                    </select>
                </div>
            </div>

            {offer.rateType === 'fixed' ? (
                <div className="mb-5">
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {ol.fixedRateLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full p-3 bg-[var(--clr-neutral-800)] text-base font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={ol.fixedRatePlaceholder}
                        value={offer.fixedRate || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => update('fixedRate', parseNumber(e.target.value))}
                        min={0}
                        max={50}
                        step={0.01}
                    />
                </div>
            ) : (
                <div className="mb-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[var(--clr-neutral-900)] rounded-md p-3">
                            <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{labels.common.irccLabel}</p>
                            <p className="font-semibold text-[var(--clr-neutral-0)]">{formatPercent(rates.ircc.value)}</p>
                            <p className="text-[10px] text-[var(--clr-neutral-100)] mt-1">{labels.common.irccSource} · {rates.ircc.lastUpdated}</p>
                        </div>
                        <div className="bg-[var(--clr-neutral-900)] rounded-md p-3">
                            <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{ol.computedRateLabel}</p>
                            <p className="font-semibold text-[var(--clr-green-500)]">{formatPercent(results.effectiveRate)}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                            {ol.marginLabel}
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-[var(--clr-neutral-800)] text-base font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                            placeholder={ol.marginPlaceholder}
                            value={offer.margin || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => update('margin', parseNumber(e.target.value))}
                            min={0}
                            max={20}
                            step={0.01}
                        />
                        <p className="text-xs text-[var(--clr-neutral-100)] mt-1">{ol.marginHelp}</p>
                    </div>
                </div>
            )}

            {offer.downPaymentPercent > 0 && offer.downPaymentPercent < 100 && offer.loanAmount > 0 && (
                <div className="mb-5 text-xs text-[var(--clr-neutral-100)] bg-[var(--clr-neutral-900)] rounded-md p-3">
                    {ol.propertyValueLabel}: <span className="font-semibold text-[var(--clr-neutral-0)]">{formatLei(results.propertyValue)}</span>
                </div>
            )}

            <div className="h-px bg-[var(--clr-neutral-900)] mb-5" />

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--clr-neutral-900)] rounded-xl p-3 text-center col-span-2">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{ol.results.monthlyPaymentLabel}</p>
                    <p className="text-2xl md:text-3xl font-bold text-[var(--clr-green-500)]">{formatLei(results.monthlyPayment)}</p>
                </div>
                <div className="bg-[var(--clr-neutral-900)] rounded-xl p-3 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{ol.results.totalInterestLabel}</p>
                    <p className="text-base md:text-lg font-bold text-[var(--clr-neutral-0)]">{formatLei(results.totalInterest)}</p>
                </div>
                <div className="bg-[var(--clr-neutral-900)] rounded-xl p-3 text-center">
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{ol.results.totalPaymentLabel}</p>
                    <p className="text-base md:text-lg font-bold text-[var(--clr-neutral-0)]">{formatLei(results.totalPayment)}</p>
                </div>
                <div className="bg-[var(--clr-neutral-900)] rounded-xl p-3 text-center col-span-2" title={ol.results.daeTooltip}>
                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{ol.results.daeLabel}</p>
                    <p className="text-lg md:text-xl font-bold text-[var(--clr-neutral-0)]">{formatPercent(results.dae)}</p>
                </div>
            </div>
        </div>
    );
}

export default function MortgageCreditSimulator({ labels, rates }: Props) {
    const [monthlyIncome, setMonthlyIncome] = useState(rates.defaults.monthlyIncome);
    const [offerA, setOfferA] = useState<OfferInput>({
        loanAmount: rates.defaults.loanAmount,
        downPaymentPercent: rates.defaults.downPaymentPercent,
        termYears: rates.defaults.termYears,
        rateType: 'fixed',
        fixedRate: rates.defaultRates.fixedRateDefault,
        margin: rates.defaultRates.variableMarginDefault,
    });
    const [offerB, setOfferB] = useState<OfferInput>({
        loanAmount: rates.defaults.loanAmount,
        downPaymentPercent: rates.defaults.downPaymentPercent,
        termYears: rates.defaults.termYears,
        rateType: 'variable',
        fixedRate: rates.defaultRates.fixedRateDefault,
        margin: rates.defaultRates.variableMarginDefault,
    });
    const [showAmortA, setShowAmortA] = useState(false);
    const [showAmortB, setShowAmortB] = useState(false);

    const resultsA = useMemo(() => computeOfferResults(offerA, rates), [offerA, rates]);
    const resultsB = useMemo(() => computeOfferResults(offerB, rates), [offerB, rates]);

    const scheduleA = useMemo(
        () => (showAmortA && resultsA.monthlyPayment > 0 ? generateSchedule(offerA.loanAmount, resultsA.effectiveRate, resultsA.totalMonths, resultsA.monthlyPayment) : []),
        [showAmortA, offerA.loanAmount, resultsA.effectiveRate, resultsA.totalMonths, resultsA.monthlyPayment],
    );
    const scheduleB = useMemo(
        () => (showAmortB && resultsB.monthlyPayment > 0 ? generateSchedule(offerB.loanAmount, resultsB.effectiveRate, resultsB.totalMonths, resultsB.monthlyPayment) : []),
        [showAmortB, offerB.loanAmount, resultsB.effectiveRate, resultsB.totalMonths, resultsB.monthlyPayment],
    );

    const bothValid = resultsA.monthlyPayment > 0 && resultsB.monthlyPayment > 0;
    const monthlyDiff = resultsB.monthlyPayment - resultsA.monthlyPayment;
    const interestDiff = resultsB.totalInterest - resultsA.totalInterest;
    const betterOfferName = interestDiff < 0 ? labels.offerB.title : interestDiff > 0 ? labels.offerA.title : '';
    const savings = Math.abs(interestDiff);

    const maxDtiPercent = rates.limits.maxDebtToIncomePercent;
    const dtiA = monthlyIncome > 0 ? (resultsA.monthlyPayment / monthlyIncome) * 100 : 0;
    const dtiB = monthlyIncome > 0 ? (resultsB.monthlyPayment / monthlyIncome) * 100 : 0;
    const aExceedsDti = dtiA > maxDtiPercent;
    const bExceedsDti = dtiB > maxDtiPercent;
    const minIncomeA = resultsA.monthlyPayment / (maxDtiPercent / 100);
    const minIncomeB = resultsB.monthlyPayment / (maxDtiPercent / 100);

    return (
        <div className="w-full">
            <div className="bg-[var(--clr-neutral-900)] rounded-4xl p-6 md:p-8">
                <div className="mb-6">
                    <label className="block text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2">
                        {labels.common.monthlyIncomeLabel}
                    </label>
                    <input
                        type="number"
                        className="w-full md:max-w-md p-3 bg-[var(--clr-neutral-800)] text-lg font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                        placeholder={labels.common.monthlyIncomePlaceholder}
                        value={monthlyIncome || ''}
                        onChange={(e) => setMonthlyIncome(parseNumber(e.target.value))}
                        min={0}
                    />
                    <p className="text-xs text-[var(--clr-neutral-100)] mt-1">{labels.common.monthlyIncomeHelp}</p>
                </div>

                <h2 className="text-lg md:text-xl font-semibold mb-4 text-[var(--clr-neutral-0)]">{labels.common.compareTitle}</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <OfferCard
                        title={labels.offerA.title}
                        subtitle={labels.offerA.subtitle}
                        offer={offerA}
                        results={resultsA}
                        rates={rates}
                        labels={labels}
                        onChange={setOfferA}
                        accentBorder="border-[var(--clr-green-500)]"
                    />
                    <OfferCard
                        title={labels.offerB.title}
                        subtitle={labels.offerB.subtitle}
                        offer={offerB}
                        results={resultsB}
                        rates={rates}
                        labels={labels}
                        onChange={setOfferB}
                        accentBorder="border-[#3B82F6]"
                    />
                </div>

                {bothValid && (
                    <div className="mt-6 bg-[var(--clr-neutral-1000)] rounded-2xl p-5">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--clr-neutral-0)]">{labels.comparison.title}</h3>
                        {Math.abs(monthlyDiff) < 0.01 && Math.abs(interestDiff) < 0.01 ? (
                            <p className="text-[var(--clr-neutral-100)]">{labels.comparison.noDifferenceLabel}</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{labels.comparison.monthlyDiffLabel}</p>
                                    <p className="text-xl font-bold text-[var(--clr-neutral-0)]">
                                        {monthlyDiff >= 0 ? '+' : ''}{formatLei(Math.abs(monthlyDiff))} {monthlyDiff < 0 ? '(B mai mică)' : monthlyDiff > 0 ? '(A mai mică)' : ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{labels.comparison.totalInterestDiffLabel}</p>
                                    <p className="text-xl font-bold text-[var(--clr-neutral-0)]">
                                        {formatLei(Math.abs(interestDiff))}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] mb-1">{labels.comparison.betterOfferLabel}</p>
                                    <p className="text-xl font-bold text-[var(--clr-green-500)]">{betterOfferName}</p>
                                    <p className="text-xs text-[var(--clr-neutral-100)] mt-1">{labels.comparison.savingsLabel}: {formatLei(savings)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {monthlyIncome > 0 && bothValid && (
                    <div className="mt-6 bg-[var(--clr-neutral-1000)] rounded-2xl p-5">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--clr-neutral-0)]">{labels.debtCheck.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DebtCheckRow
                                offerName={labels.offerA.title}
                                ratio={dtiA}
                                exceeds={aExceedsDti}
                                maxPercent={maxDtiPercent}
                                minIncome={minIncomeA}
                                labels={labels}
                            />
                            <DebtCheckRow
                                offerName={labels.offerB.title}
                                ratio={dtiB}
                                exceeds={bExceedsDti}
                                maxPercent={maxDtiPercent}
                                minIncome={minIncomeB}
                                labels={labels}
                            />
                        </div>
                        {(aExceedsDti || bExceedsDti) && (
                            <p className="text-sm mt-4 text-[#F59E0B]">{labels.debtCheck.warningText}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AmortToggleSection
                    show={showAmortA}
                    onToggle={() => setShowAmortA(!showAmortA)}
                    toggleLabel={labels.amortization.toggleLabelA}
                    sectionTitle={labels.amortization.sectionTitleA}
                    sectionDescription={labels.amortization.sectionDescription}
                    headers={labels.amortization.headers}
                    schedule={scheduleA}
                />
                <AmortToggleSection
                    show={showAmortB}
                    onToggle={() => setShowAmortB(!showAmortB)}
                    toggleLabel={labels.amortization.toggleLabelB}
                    sectionTitle={labels.amortization.sectionTitleB}
                    sectionDescription={labels.amortization.sectionDescription}
                    headers={labels.amortization.headers}
                    schedule={scheduleB}
                />
            </div>
        </div>
    );
}

type DebtCheckRowProps = {
    offerName: string;
    ratio: number;
    exceeds: boolean;
    maxPercent: number;
    minIncome: number;
    labels: Labels;
};

function DebtCheckRow({ offerName, ratio, exceeds, maxPercent, minIncome, labels }: DebtCheckRowProps) {
    const barColor = exceeds ? '#F59E0B' : 'var(--clr-green-500)';
    const widthPercent = Math.min(ratio, 100);

    return (
        <div className="bg-[var(--clr-neutral-900)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-[var(--clr-neutral-0)]">{offerName}</p>
                <p className="text-sm font-bold" style={{ color: barColor }}>
                    {exceeds ? labels.debtCheck.warningLabel : labels.debtCheck.okLabel}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[var(--clr-neutral-1000)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${widthPercent}%`, background: barColor }} />
                </div>
                <span className="text-sm font-mono text-[var(--clr-neutral-0)] w-16 text-right">{formatPercent(ratio, 1)}</span>
            </div>
            <p className="text-xs text-[var(--clr-neutral-100)] mt-2">
                {labels.debtCheck.ratioLabel}: <span className="font-semibold">{formatPercent(ratio, 1)}</span> · max BNR: {maxPercent}%
            </p>
            {exceeds && (
                <p className="text-xs text-[var(--clr-neutral-100)] mt-1">
                    {labels.debtCheck.monthlyIncomeRequiredLabel}: <span className="font-semibold text-[var(--clr-neutral-0)]">{formatLei(minIncome)}</span>
                </p>
            )}
        </div>
    );
}

type AmortToggleSectionProps = {
    show: boolean;
    onToggle: () => void;
    toggleLabel: string;
    sectionTitle: string;
    sectionDescription: string;
    headers: { month: string; payment: string; principal: string; interest: string; balance: string };
    schedule: AmortizationRow[];
};

function AmortToggleSection({ show, onToggle, toggleLabel, sectionTitle, sectionDescription, headers, schedule }: AmortToggleSectionProps) {
    return (
        <div>
            <button
                type="button"
                className="flex items-center gap-2 text-[var(--clr-green-500)] hover:text-[var(--clr-neutral-0)] transition-colors cursor-pointer mb-4"
                onClick={onToggle}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`transition-transform duration-300 ${show ? 'rotate-90' : ''}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-sm font-medium">{toggleLabel}</span>
            </button>
            {show && schedule.length > 0 && (
                <AmortizationTable
                    schedule={schedule}
                    headers={headers}
                    title={sectionTitle}
                    description={sectionDescription}
                    currencySymbol="lei"
                />
            )}
        </div>
    );
}
