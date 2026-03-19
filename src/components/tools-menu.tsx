"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

type Tool = {
    slug: string;
    title: string;
    shortDescription: string;
    iconPath: string;
};

type Category = {
    id: string;
    headline: string;
    slug: string;
    tools: Tool[];
};

type ToolsMenuProps = {
    label: string;
    categories: Category[];
    defaultCategoryId: string;
};

export default function ToolsMenu({ label, categories, defaultCategoryId }: ToolsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(defaultCategoryId);

    const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0];

    const toggle = useCallback(() => {
        setIsOpen((prev) => {
            if (prev) setActiveCategoryId(defaultCategoryId);
            return !prev;
        });
    }, [defaultCategoryId]);

    const close = useCallback(() => {
        setIsOpen(false);
        setActiveCategoryId(defaultCategoryId);
    }, [defaultCategoryId]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, close]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={toggle}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 ${
                    isOpen
                        ? "text-[var(--clr-green-500)]"
                        : "text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)]"
                }`}
            >
                {label}
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                    <path d="M4 6l4 4 4-4" />
                </svg>
            </button>

            {/* Fullscreen overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-[var(--clr-neutral-1000)]">
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[var(--clr-neutral-800)]">
                        <span className="text-lg font-semibold text-[var(--clr-neutral-0)]">{label}</span>
                        <button
                            onClick={close}
                            className="text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors p-2"
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex h-[calc(100vh-65px)]">
                        {/* Categories sidebar */}
                        <nav className="w-[240px] md:w-[280px] border-r border-[var(--clr-neutral-800)] py-6 px-4 flex flex-col gap-1 overflow-y-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategoryId(cat.id)}
                                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeCategoryId === cat.id
                                            ? "bg-[var(--clr-neutral-900)] text-[var(--clr-green-500)]"
                                            : "text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-900)]"
                                    }`}
                                >
                                    {cat.headline}
                                </button>
                            ))}
                        </nav>

                        {/* Tools grid */}
                        <div className="flex-1 py-6 px-6 md:px-10 overflow-y-auto">
                            {/* Category heading with link */}
                            <Link
                                href={activeCategory.slug}
                                onClick={close}
                                className="inline-block mb-6 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] hover:text-[var(--clr-green-500)] transition-colors"
                            >
                                {activeCategory.headline} →
                            </Link>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeCategory.tools.map((tool) => (
                                    <Link
                                        key={tool.slug}
                                        href={tool.slug}
                                        onClick={close}
                                        className="group bg-[var(--clr-neutral-900)] rounded-2xl p-5 border border-[var(--clr-neutral-900)] transition-all duration-300 hover:border-[var(--clr-green-500)] flex flex-col gap-3"
                                    >
                                        <Image
                                            src={tool.iconPath}
                                            width={40}
                                            height={40}
                                            className="w-[40px] h-auto"
                                            alt={tool.title}
                                        />
                                        <h3 className="text-base font-medium text-[var(--clr-neutral-0)] group-hover:text-[var(--clr-green-500)] transition-colors">
                                            {tool.title}
                                        </h3>
                                        <p className="text-sm text-[var(--clr-neutral-100)] line-clamp-2">
                                            {tool.shortDescription}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
