"use client";

import { useState } from "react";

type SponsorItem = {
    text: string;
    linkText: string;
    linkUrl: string;
};

type SponsorSectionProps = {
    sponsors: SponsorItem[];
    label: string;
};

export default function SponsorSection({ sponsors, label }: SponsorSectionProps) {
    const [sponsor] = useState(() =>
        sponsors[Math.floor(Math.random() * sponsors.length)]
    );

    if (!sponsor) return null;

    return (
        <div className="bg-[var(--clr-neutral-900)] border-l-4 border-[var(--clr-green-500)] rounded-lg px-6 py-5">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--clr-neutral-100)] mb-2 block">
                {label}
            </span>
            <p className="text-sm text-[var(--clr-neutral-100)] leading-relaxed">
                {sponsor.text}{" "}
                <a
                    href={sponsor.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-[var(--clr-green-500)] hover:underline font-medium"
                >
                    {sponsor.linkText}
                </a>
            </p>
        </div>
    );
}
