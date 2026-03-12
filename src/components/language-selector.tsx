"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

type LanguageSelectorProps = {
    lang: string;
    labels: {
        label: string;
        en: string;
        ro: string;
    };
};

export default function LanguageSelector({ lang, labels }: LanguageSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLang: Locale) => {
        if (newLang === lang) return;

        let newPath: string;

        if (lang === "en") {
            // Currently EN (no prefix) -> add /ro prefix
            newPath = `/${newLang}${pathname}`;
        } else {
            // Currently has a prefix (e.g. /ro) -> remove it
            const pathWithoutLocale = pathname.replace(`/${lang}`, "") || "/";
            if (newLang === "en") {
                newPath = pathWithoutLocale;
            } else {
                newPath = `/${newLang}${pathWithoutLocale}`;
            }
        }

        router.push(newPath);
    };

    return (
        <select
            value={lang}
            onChange={(e) => switchLanguage(e.target.value as Locale)}
            className="bg-[var(--clr-neutral-900)] text-[var(--clr-neutral-0)] border border-[var(--clr-neutral-800)] rounded-md px-3 py-2 text-sm cursor-pointer focus:outline-none focus:border-[var(--clr-green-500)] transition-colors"
            aria-label={labels.label}
        >
            {locales.map((locale) => (
                <option key={locale} value={locale}>
                    {labels[locale]}
                </option>
            ))}
        </select>
    );
}
