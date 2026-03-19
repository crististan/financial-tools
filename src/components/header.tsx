import Image from "next/image";
import Link from "next/link";
import Container from "./container";
import ToolsMenu from "./tools-menu";
import LanguageSelector from "./language-selector";
import { locales } from "@/lib/i18n";
import { getSlugMap, getCategoriesWithTools } from "@/lib/tool-data";
import type { CommonDictionary } from "@/dictionaries/en/common";

type HeaderProps = {
    lang: string;
    common: CommonDictionary;
};

export default async function Header({ lang, common }: HeaderProps) {
    // Build slug maps for all locale pairs (for language switching with translated slugs)
    const slugMaps: Record<string, Record<string, string>> = {};
    for (const fromLang of locales) {
        for (const toLang of locales) {
            if (fromLang === toLang) continue;
            slugMaps[`${fromLang}->${toLang}`] = await getSlugMap(fromLang, toLang);
        }
    }

    const prefix = lang === "en" ? "" : `/${lang}`;
    const categoriesWithTools = await getCategoriesWithTools(lang);

    return (
        <header>
            <Container>
                <div className="flex justify-between items-center">
                    <Link href={prefix || "/"} className="flex-shrink-0">
                        <Image
                            src="/logo.svg"
                            alt="ToolFrame"
                            width={160}
                            height={36}
                            priority
                        />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            href={prefix || "/"}
                            className="text-sm font-medium text-[var(--clr-neutral-0)] hover:text-[var(--clr-green-500)] transition-colors px-3 py-2"
                        >
                            {common.nav.home}
                        </Link>
                        <ToolsMenu
                            label={common.nav.tools}
                            categories={categoriesWithTools}
                            defaultCategoryId="financial"
                        />
                        <LanguageSelector lang={lang} labels={common.languageSelector} slugMaps={slugMaps} />
                    </div>
                </div>
            </Container>
        </header>
    )
}
