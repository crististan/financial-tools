import Container from "./container";
import { Nav } from "./nav/nav";
import LanguageSelector from "./language-selector";
import type { CommonDictionary } from "@/dictionaries/en/common";
type HeaderProps = {
    lang: string;
    common: CommonDictionary;
};

export default function Header({ lang, common }: HeaderProps) {
    return (
        <header>
            <Container>
                <div className="flex justify-between items-center">
                    <div>
                        LOGO
                    </div>
                    <div className="flex items-center gap-4">
                        <Nav lang={lang} common={common} />
                        <LanguageSelector lang={lang} labels={common.languageSelector} />
                    </div>
                </div>
            </Container>
        </header>
    )
}
