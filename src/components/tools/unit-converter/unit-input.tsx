import type { ChangeEvent } from 'react';

type Unit = {
    code: string;
    name: string;
}

type UnitInputProps = {
    label?: string;
    value: string;
    units: Unit[];
    selectedUnit: string;
    placeholder?: string;
    isReadOnly?: boolean;
    onChangeInput?: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangeSelect?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function UnitInput({ label, value, units, selectedUnit, placeholder = "Enter value", isReadOnly = false, onChangeInput, onChangeSelect }: UnitInputProps) {
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
                value={selectedUnit}
                onChange={onChangeSelect}
            >
                {units.map((unit) => (
                    <option key={unit.code} className="text-[var(--clr-neutral-1000)]" value={unit.code}>
                        {unit.code} - {unit.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
