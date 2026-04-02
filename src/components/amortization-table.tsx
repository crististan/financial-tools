import type { AmortizationRow } from './loan-calculator';

type AmortizationTableProps = {
    schedule: AmortizationRow[];
    headers: {
        month: string;
        payment: string;
        principal: string;
        interest: string;
        balance: string;
    };
    title: string;
    description: string;
    currencySymbol: string;
};

function formatNumber(value: number): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatWithCurrency(value: number, symbol: string): string {
    const formatted = formatNumber(value);
    if (symbol === 'lei') return `${formatted} lei`;
    return `${symbol}${formatted}`;
}

export default function AmortizationTable({ schedule, headers, title, description, currencySymbol }: AmortizationTableProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-4">{title}</h2>
            <p className="text-[var(--clr-neutral-100)] mb-8 max-w-[600px]">{description}</p>

            <div className="overflow-x-auto rounded-2xl border border-[var(--clr-neutral-900)] max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[var(--clr-neutral-900)]">
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-green-500)]">{headers.month}</th>
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-green-500)]">{headers.payment}</th>
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-green-500)]">{headers.principal}</th>
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-green-500)]">{headers.interest}</th>
                            <th className="px-4 py-3 text-sm font-medium text-[var(--clr-green-500)]">{headers.balance}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, index) => (
                            <tr
                                key={row.month}
                                className={`border-b border-[var(--clr-neutral-900)] last:border-b-0 transition-colors duration-200 hover:bg-[var(--clr-neutral-900)] ${index % 2 === 1 ? 'bg-[var(--clr-neutral-900)]/30' : ''}`}
                            >
                                <td className="px-4 py-2.5 text-sm font-medium">{row.month}</td>
                                <td className="px-4 py-2.5 text-sm font-mono">{formatWithCurrency(row.payment, currencySymbol)}</td>
                                <td className="px-4 py-2.5 text-sm font-mono">{formatWithCurrency(row.principal, currencySymbol)}</td>
                                <td className="px-4 py-2.5 text-sm font-mono">{formatWithCurrency(row.interest, currencySymbol)}</td>
                                <td className="px-4 py-2.5 text-sm font-mono">{formatWithCurrency(row.balance, currencySymbol)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
