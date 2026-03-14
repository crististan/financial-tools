type RatesTableProps = {
    pairs: Array<{ from: string; to: string }>;
    factors: Record<string, number>;
    headers: {
        pair: string;
        rate: string;
        inverseRate: string;
    };
    title: string;
    description: string;
    names?: Record<string, string>;
    decimals?: number;
};

function formatValue(value: number, decimals?: number): string {
    if (decimals !== undefined) return value.toFixed(decimals);
    if (value >= 1000) return value.toFixed(2);
    if (value >= 1) return value.toFixed(4);
    if (value >= 0.001) return value.toFixed(6);
    return value.toExponential(4);
}

function getRate(from: string, to: string, factors: Record<string, number>): number {
    const fromFactor = factors[from];
    const toFactor = factors[to];
    if (!fromFactor || !toFactor) return 0;
    return toFactor / fromFactor;
}

export default function RatesTable({ pairs, factors, headers, title, description, names, decimals }: RatesTableProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-4 text-center">{title}</h2>
            <p className="text-[var(--clr-neutral-100)] mb-8 max-w-[600px] mx-auto">{description}</p>

            <div className="overflow-x-auto rounded-2xl border border-[var(--clr-neutral-900)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--clr-neutral-900)]">
                            <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{headers.pair}</th>
                            <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{headers.rate}</th>
                            <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{headers.inverseRate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pairs.map((pair, index) => {
                            const rate = getRate(pair.from, pair.to, factors);
                            const inverse = getRate(pair.to, pair.from, factors);
                            const fromLabel = names?.[pair.from] ?? pair.from;
                            const toLabel = names?.[pair.to] ?? pair.to;
                            return (
                                <tr
                                    key={`${pair.from}-${pair.to}`}
                                    className={`border-b border-[var(--clr-neutral-900)] last:border-b-0 transition-colors duration-200 hover:bg-[var(--clr-neutral-900)] ${index % 2 === 1 ? 'bg-[var(--clr-neutral-900)]/30' : ''}`}
                                >
                                    <td className="px-5 py-3.5 text-sm">
                                        <span className="text-[var(--clr-green-500)] font-medium">{fromLabel}</span>
                                        <span className="text-[var(--clr-neutral-100)]"> / </span>
                                        <span className="font-medium">{toLabel}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-mono">{formatValue(rate, decimals)}</td>
                                    <td className="px-5 py-3.5 text-sm font-mono">{formatValue(inverse, decimals)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
