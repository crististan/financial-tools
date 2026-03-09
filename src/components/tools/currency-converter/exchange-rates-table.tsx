import { getRate } from '@/lib/mock-rates';

type ExchangeRatesTableProps = {
    rates: Record<string, number>;
    pairs: Array<{ from: string; to: string }>;
    headers: {
        pair: string;
        rate: string;
        inverseRate: string;
    };
    title: string;
    description: string;
};

export default function ExchangeRatesTable({ rates, pairs, headers, title, description }: ExchangeRatesTableProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-4">{title}</h2>
            <p className="text-[var(--clr-neutral-100)] mb-8 max-w-[600px]">{description}</p>

            <div className="overflow-x-auto rounded-2xl border border-[var(--clr-neutral-900)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--clr-neutral-900)]">
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-neutral-100)]">{headers.pair}</th>
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-neutral-100)]">{headers.rate}</th>
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-neutral-100)]">{headers.inverseRate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pairs.map((pair) => {
                            const rate = getRate(pair.from, pair.to, rates);
                            const inverse = getRate(pair.to, pair.from, rates);
                            return (
                                <tr key={`${pair.from}-${pair.to}`} className="border-b border-[var(--clr-neutral-900)] last:border-b-0">
                                    <td className="px-4 py-3 text-sm">
                                        <span className="text-[var(--clr-green-500)] font-medium">{pair.from}</span>
                                        <span className="text-[var(--clr-neutral-100)]"> / </span>
                                        <span className="font-medium">{pair.to}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{rate.toFixed(4)}</td>
                                    <td className="px-4 py-3 text-sm">{inverse.toFixed(4)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
