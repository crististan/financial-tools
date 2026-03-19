"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

type LanguageSelectorProps = {
    lang: string;
    labels: {
        label: string;
        en: string;
        ro: string;
        de: string;
    };
    slugMaps?: Record<string, Record<string, string>>;
};

export default function LanguageSelector({ lang, labels, slugMaps }: LanguageSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = (newLang: Locale) => {
        if (newLang === lang) return;

        let newPath: string;

        if (lang === "en") {
            // Currently EN (no prefix) -> add new locale prefix
            const translatedPath = translateSlugInPath(pathname, lang, newLang, slugMaps);
            newPath = `/${newLang}${translatedPath}`;
        } else {
            // Currently has a prefix (e.g. /ro) -> remove it and translate slug
            const pathWithoutLocale = pathname.replace(`/${lang}`, "") || "/";
            const translatedPath = translateSlugInPath(pathWithoutLocale, lang, newLang, slugMaps);
            if (newLang === "en") {
                newPath = translatedPath;
            } else {
                newPath = `/${newLang}${translatedPath}`;
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

function translateSlugInPath(
    path: string,
    fromLang: string,
    toLang: string,
    slugMaps?: Record<string, Record<string, string>>
): string {
    if (!slugMaps) return path;
    const mapKey = `${fromLang}->${toLang}`;
    const map = slugMaps[mapKey];
    if (!map) return path;

    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) return path;

    // Try composite path first (category/tool — 2 segments)
    if (segments.length >= 2) {
        const compositeKey = `${segments[0]}/${segments[1]}`;
        const translated = map[compositeKey];
        if (translated) {
            const [newCat, newTool] = translated.split("/");
            segments[0] = newCat;
            segments[1] = newTool;
            return "/" + segments.join("/");
        }
    }

    // Try single segment (category page or fallback)
    const translated = map[segments[0]];
    if (translated) {
        segments[0] = translated;
        return "/" + segments.join("/");
    }

    return path;
}
