import { getConversionFactor, formatConversion } from '@/lib/mock-units';

type ConversionTableProps = {
    pairs: Array<{ from: string; to: string }>;
    unitNames: Record<string, string>;
    headers: {
        pair: string;
        factor: string;
        inverseFactor: string;
    };
    title: string;
    description: string;
};

export default function ConversionTable({ pairs, unitNames, headers, title, description }: ConversionTableProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-4">{title}</h2>
            <p className="text-[var(--clr-neutral-100)] mb-8 max-w-[600px]">{description}</p>

            <div className="overflow-x-auto rounded-2xl border border-[var(--clr-neutral-900)]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[var(--clr-neutral-900)]">
                            <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{headers.pair}</th>
                            <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{headers.factor}</th>
                            <th className="px-5 py-4 text-sm font-medium text-[var(--clr-green-500)]">{headers.inverseFactor}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pairs.map((pair, index) => {
                            const factor = getConversionFactor(pair.from, pair.to);
                            const inverseFactor = getConversionFactor(pair.to, pair.from);
                            return (
                                <tr
                                    key={`${pair.from}-${pair.to}`}
                                    className={`border-b border-[var(--clr-neutral-900)] last:border-b-0 transition-colors duration-200 hover:bg-[var(--clr-neutral-900)] ${index % 2 === 1 ? 'bg-[var(--clr-neutral-900)]/30' : ''}`}
                                >
                                    <td className="px-5 py-3.5 text-sm">
                                        <span className="text-[var(--clr-green-500)] font-medium">{unitNames[pair.from] || pair.from}</span>
                                        <span className="text-[var(--clr-neutral-100)]"> / </span>
                                        <span className="font-medium">{unitNames[pair.to] || pair.to}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-mono">{formatConversion(factor)}</td>
                                    <td className="px-5 py-3.5 text-sm font-mono">{formatConversion(inverseFactor)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
