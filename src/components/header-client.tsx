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

type HeaderClientProps = {
    homeHref: string;
    homeLabel: string;
    toolsLabel: string;
    categories: Category[];
    defaultCategoryId: string;
    languageSelector: React.ReactNode;
};

export default function HeaderClient({
    homeHref,
    homeLabel,
    toolsLabel,
    categories,
    defaultCategoryId,
    languageSelector,
}: HeaderClientProps) {
    const [toolsOpen, setToolsOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(defaultCategoryId);

    const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0];

    const openTools = useCallback(() => {
        setMobileOpen(false);
        setToolsOpen(true);
    }, []);

    const closeTools = useCallback(() => {
        setToolsOpen(false);
        setActiveCategoryId(defaultCategoryId);
    }, [defaultCategoryId]);

    const toggleTools = useCallback(() => {
        if (toolsOpen) {
            closeTools();
        } else {
            openTools();
        }
    }, [toolsOpen, openTools, closeTools]);

    const toggleMobile = useCallback(() => {
        setMobileOpen((prev) => !prev);
        setToolsOpen(false);
    }, []);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = (toolsOpen || mobileOpen) ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [toolsOpen, mobileOpen]);

    // Close on Escape
    useEffect(() => {
        if (!toolsOpen && !mobileOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setToolsOpen(false);
                setMobileOpen(false);
                setActiveCategoryId(defaultCategoryId);
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [toolsOpen, mobileOpen, defaultCategoryId]);

    return (
        <>
            {/* ── Desktop nav ── */}
            <div className="hidden md:flex items-center gap-2">
                <Link
                    href={homeHref}
                    className="text-sm font-medium text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)] transition-colors px-3 py-2"
                >
                    {homeLabel}
                </Link>

                {/* Tools trigger */}
                <button
                    onClick={toggleTools}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-2 ${
                        toolsOpen
                            ? "text-[var(--clr-green-500)]"
                            : "text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)]"
                    }`}
                >
                    {toolsLabel}
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                    >
                        <path d="M4 6l4 4 4-4" />
                    </svg>
                </button>

                {languageSelector}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
                onClick={toggleMobile}
                className="md:hidden text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)] transition-colors p-2"
                aria-label="Menu"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {mobileOpen ? (
                        <>
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                    )}
                </svg>
            </button>

            {/* ── Mobile menu overlay ── */}
            {mobileOpen && (
                <div className="fixed inset-0 top-[60px] z-40 bg-[var(--clr-neutral-1000)] md:hidden overflow-y-auto">
                    <nav className="flex flex-col p-6 gap-2">
                        <Link
                            href={homeHref}
                            onClick={() => setMobileOpen(false)}
                            className="text-lg font-medium text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)] transition-colors py-3 border-b border-[var(--clr-neutral-800)]"
                        >
                            {homeLabel}
                        </Link>
                        <button
                            onClick={openTools}
                            className="text-left text-lg font-medium text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)] transition-colors py-3 border-b border-[var(--clr-neutral-800)]"
                        >
                            {toolsLabel}
                        </button>
                        <div className="pt-4">
                            {languageSelector}
                        </div>
                    </nav>
                </div>
            )}

            {/* ── Tools fullscreen overlay (shared desktop & mobile) ── */}
            {toolsOpen && (
                <div className="fixed inset-0 z-50 bg-[var(--clr-neutral-1000)]">
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-4 md:px-12 py-5 border-b border-[var(--clr-neutral-800)]">
                        <span className="text-lg font-semibold text-[var(--clr-neutral-0)]">{toolsLabel}</span>
                        <button
                            onClick={closeTools}
                            className="text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] transition-colors p-2"
                            aria-label="Close"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Content — stacked on mobile, side-by-side on desktop */}
                    <div className="flex flex-col md:flex-row h-[calc(100vh-65px)]">
                        {/* Categories — horizontal scroll on mobile, sidebar on desktop */}
                        <nav className="flex md:flex-col md:w-[280px] md:border-r border-b md:border-b-0 border-[var(--clr-neutral-800)] py-3 md:py-6 px-4 gap-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto flex-shrink-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategoryId(cat.id)}
                                    className={`whitespace-nowrap text-left px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeCategoryId === cat.id
                                            ? "bg-[var(--clr-neutral-900)] text-[var(--clr-green-500)]"
                                            : "text-[var(--clr-neutral-100)] hover:text-[var(--clr-neutral-0)] hover:bg-[var(--clr-neutral-900)]"
                                    }`}
                                >
                                    {cat.headline}
                                </button>
                            ))}
                        </nav>

                        {/* Tools */}
                        <div className="flex-1 py-4 md:py-6 px-4 md:px-10 overflow-y-auto">
                            <Link
                                href={activeCategory.slug}
                                onClick={closeTools}
                                className="inline-block mb-4 md:mb-6 text-xs uppercase tracking-wider text-[var(--clr-neutral-100)] hover:text-[var(--clr-green-500)] transition-colors"
                            >
                                {activeCategory.headline} →
                            </Link>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {activeCategory.tools.map((tool) => (
                                    <Link
                                        key={tool.slug}
                                        href={tool.slug}
                                        onClick={closeTools}
                                        className="group bg-[var(--clr-neutral-900)] rounded-2xl p-4 md:p-5 border border-[var(--clr-neutral-900)] transition-all duration-300 hover:border-[var(--clr-green-500)] flex items-start gap-3 md:flex-col md:gap-3"
                                    >
                                        <Image
                                            src={tool.iconPath}
                                            width={40}
                                            height={40}
                                            className="w-[36px] md:w-[40px] h-auto flex-shrink-0"
                                            alt={tool.title}
                                        />
                                        <div>
                                            <h3 className="text-sm md:text-base font-medium text-[var(--clr-neutral-0)] group-hover:text-[var(--clr-green-500)] transition-colors">
                                                {tool.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-[var(--clr-neutral-100)] line-clamp-2 mt-1">
                                                {tool.shortDescription}
                                            </p>
                                        </div>
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
