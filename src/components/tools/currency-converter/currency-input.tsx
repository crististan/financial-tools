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
    isReadOnly?: boolean;
    onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeSelect?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function CurrencyInput({ label, value, currencies, selectedCurrency, isReadOnly = false, onChangeInput, onChangeSelect }: CurrencyInputProps) {
    return (
        <div className="flex flex-row gap-2 justify-between items-end bg-[var(--clr-neutral-900)] py-6 px-4 rounded-sm">
            <div className="flex flex-col gap-2">
                <label htmlFor={label?.toLowerCase()}><small>{label}</small></label>
                <select 
                    className="w-[120px] mt-2 p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border-1 border-[var(--clr-neutral-0)] rounded-md"
                    id={label?.toLowerCase()}
                    onChange={onChangeSelect}
                >
                    {currencies.map((currency) => ( 
                        <option className="text-[var(--clr-neutral-1000)]" value={currency.code} selected={selectedCurrency === currency.code}>
                            <div className="flex flex-col">
                            {currency.name.split('-')[0].trim()}
                            </div>
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <input 
                    type="number" 
                    className="w-full p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border-1 border-[var(--clr-neutral-0)] rounded-md" 
                    placeholder="Amount"
                    value={value}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={onChangeInput}
                />
            </div>
        </div>
    );
}