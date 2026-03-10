// All conversion factors are relative to 1 meter
export const unitFactors: Record<string, number> = {
    mm: 1000,
    cm: 100,
    m: 1,
    km: 0.001,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371,
    nmi: 0.000539957,
    fathom: 0.546807,
    furlong: 0.00497097,
    league: 0.000207124,
};

export type PopularConversion = {
    from: string;
    to: string;
};

export const popularConversions: PopularConversion[] = [
    { from: "m", to: "ft" },
    { from: "m", to: "yd" },
    { from: "m", to: "mi" },
    { from: "m", to: "km" },
    { from: "m", to: "nmi" },
    { from: "m", to: "in" },
    { from: "km", to: "mi" },
    { from: "km", to: "nmi" },
    { from: "ft", to: "in" },
    { from: "yd", to: "ft" },
    { from: "mi", to: "nmi" },
    { from: "m", to: "fathom" },
];

export function convertUnit(
    amount: number,
    from: string,
    to: string,
): number {
    if (from === to) return amount;
    const fromFactor = unitFactors[from];
    const toFactor = unitFactors[to];
    if (!fromFactor || !toFactor) return 0;
    // Convert to meters first, then to target unit
    const inMeters = amount / fromFactor;
    return inMeters * toFactor;
}

export function getConversionFactor(
    from: string,
    to: string,
): number {
    const fromFactor = unitFactors[from];
    const toFactor = unitFactors[to];
    if (!fromFactor || !toFactor) return 0;
    return toFactor / fromFactor;
}

export function formatConversion(value: number): string {
    if (value >= 1000) return value.toFixed(2);
    if (value >= 1) return value.toFixed(4);
    if (value >= 0.001) return value.toFixed(6);
    return value.toExponential(4);
}
