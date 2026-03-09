'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';

type FaqItemProps = {
    question: string;
    answer: string;
};

export default function FaqItem({ question, answer }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[var(--clr-neutral-900)]">
            <button
                type="button"
                className="w-full flex justify-between items-center py-5 text-left cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h3 className="text-base md:text-lg font-medium pr-4">{question}</h3>
                <ChevronDownIcon
                    className={`size-5 shrink-0 text-[var(--clr-neutral-100)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <p className="pb-5 text-[var(--clr-neutral-100)] text-sm md:text-base leading-relaxed">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
}
