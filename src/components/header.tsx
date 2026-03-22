import Image from "next/image";
import Link from "next/link";
import Container from "./container";
import HeaderClient from "./header-client";
import LanguageSelector from "./language-selector";
import ThemeToggle from "./theme-toggle";
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
                <div className="flex justify-between items-center h-[60px]">
                    <Link href={prefix || "/"} className="flex-shrink-0">
                        <Image
                            src="/logo.svg"
                            alt="ToolFrame"
                            width={160}
                            height={36}
                            priority
                            className="hidden dark:block"
                        />
                        <Image
                            src="/logo-light.svg"
                            alt="ToolFrame"
                            width={160}
                            height={36}
                            priority
                            className="block dark:hidden"
                        />
                    </Link>
                    <HeaderClient
                        homeHref={prefix || "/"}
                        homeLabel={common.nav.home}
                        toolsLabel={common.nav.tools}
                        categories={categoriesWithTools}
                        defaultCategoryId="financial"
                        languageSelector={
                            <LanguageSelector lang={lang} labels={common.languageSelector} slugMaps={slugMaps} />
                        }
                        themeToggle={<ThemeToggle />}
                    />
                </div>
            </Container>
        </header>
    );
}
