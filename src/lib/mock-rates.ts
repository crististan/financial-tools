export type ExchangeRates = {
    base: string;
    timestamp: number;
    rates: Record<string, number>;
};

export type PopularPair = {
    from: string;
    to: string;
};

export const mockExchangeRates: ExchangeRates = {
    base: "USD",
    timestamp: Date.now(),
    rates: {
        USD: 1.0,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        AUD: 1.53,
        CAD: 1.36,
        CHF: 0.88,
        CNY: 7.24,
        SEK: 10.42,
        NZD: 1.67,
    },
};

export const popularPairs: PopularPair[] = [
    { from: "USD", to: "EUR" },
    { from: "USD", to: "GBP" },
    { from: "USD", to: "JPY" },
    { from: "EUR", to: "GBP" },
    { from: "EUR", to: "JPY" },
    { from: "GBP", to: "JPY" },
    { from: "USD", to: "CAD" },
    { from: "USD", to: "CHF" },
    { from: "EUR", to: "CHF" },
    { from: "AUD", to: "NZD" },
    { from: "USD", to: "CNY" },
    { from: "USD", to: "SEK" },
];

export function convertCurrency(
    amount: number,
    from: string,
    to: string,
    rates: Record<string, number>
): number {
    if (from === to) return amount;
    const fromRate = rates[from];
    const toRate = rates[to];
    if (!fromRate || !toRate) return 0;
    return Math.round((amount / fromRate) * toRate * 100) / 100;
}

export function getRate(
    from: string,
    to: string,
    rates: Record<string, number>
): number {
    const fromRate = rates[from];
    const toRate = rates[to];
    if (!fromRate || !toRate) return 0;
    return Math.round((toRate / fromRate) * 10000) / 10000;
}
