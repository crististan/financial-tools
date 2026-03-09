import type { ChangeEvent } from 'react';

type Currency = {
    code: string;
    name: string;
}

type CurrencyInputProps = {
    label?: string;
    value: number;
    currencies: Currency[];
    selectedCurrency: string;
    placeholder?: string;
    isReadOnly?: boolean;
    onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeSelect?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function CurrencyInput({ label, value, currencies, selectedCurrency, placeholder = "Amount", isReadOnly = false, onChangeInput, onChangeSelect }: CurrencyInputProps) {
    return (
        <div className="flex flex-row gap-2 justify-between items-end bg-[var(--clr-neutral-900)] p-4 rounded-sm">
            <div className="flex flex-col gap-2 flex-1">
                <small className="text-[var(--clr-neutral-100)]">{label}</small>
                <input
                    type="number"
                    className="w-full p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border-1 border-[var(--clr-neutral-1000)] rounded-md"
                    placeholder={placeholder}
                    value={value}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={onChangeInput}
                />
            </div>
            <select
                className="w-[120px] mt-2 p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border-1 border-[var(--clr-neutral-1000)] rounded-md"
                value={selectedCurrency}
                onChange={onChangeSelect}
            >
                {currencies.map((currency) => (
                    <option key={currency.code} className="text-[var(--clr-neutral-1000)]" value={currency.code}>
                        {currency.code}
                    </option>
                ))}
            </select>
        </div>
    );
}
