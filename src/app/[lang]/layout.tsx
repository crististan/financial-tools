import Header from "@/components/header";
import { locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import type { CommonDictionary } from "@/dictionaries/en/common";

export function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const common = await getDictionary<CommonDictionary>(lang, 'common');

    return (
        <>
            <Header lang={lang} common={common} />
            <main>{children}</main>
        </>
    );
}
