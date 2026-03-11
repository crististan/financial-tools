import type { ChangeEvent } from 'react';

type ConverterInputProps = {
    label?: string;
    value: string;
    options: Array<{ code: string; name: string }>;
    selectedOption: string;
    placeholder?: string;
    isReadOnly?: boolean;
    onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeSelect?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function ConverterInput({ label, value, options, selectedOption, placeholder = "Enter value", isReadOnly = false, onChangeInput, onChangeSelect }: ConverterInputProps) {
    return (
        <div className="flex flex-row gap-3 justify-between items-end bg-[var(--clr-neutral-1000)] p-4 rounded-xl">
            <div className="flex flex-col gap-2 flex-1">
                <small className="text-xs uppercase tracking-wider text-[var(--clr-neutral-100)]">{label}</small>
                <input
                    type="number"
                    className="w-full p-2 bg-[var(--clr-neutral-800)] text-xl md:text-2xl font-medium text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                    placeholder={placeholder}
                    value={value}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    onChange={onChangeInput}
                />
            </div>
            <select
                className="w-[160px] p-2 bg-[var(--clr-neutral-800)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-1000)] rounded-md"
                value={selectedOption}
                onChange={onChangeSelect}
            >
                {options.map((option) => (
                    <option key={option.code} className="text-[var(--clr-neutral-1000)]" value={option.code}>
                        {option.code} - {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
