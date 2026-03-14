import Container from "./container";
import { Nav } from "./nav/nav";
import LanguageSelector from "./language-selector";
import { locales } from "@/lib/i18n";
import { getSlugMap } from "@/lib/tool-data";
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

    return (
        <header>
            <Container>
                <div className="flex justify-between items-center">
                    <div>
                        LOGO
                    </div>
                    <div className="flex items-center gap-4">
                        <Nav lang={lang} common={common} />
                        <LanguageSelector lang={lang} labels={common.languageSelector} slugMaps={slugMaps} />
                    </div>
                </div>
            </Container>
        </header>
    )
}
