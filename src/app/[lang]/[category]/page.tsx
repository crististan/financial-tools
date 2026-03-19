import { notFound } from "next/navigation";
import DefaultHero from "@/components/default-hero";
import Section from "@/components/section";
import Container from "@/components/container";
import CardsContainer from "@/components/cards-container";
import Card from "@/components/ui/card";
import FaqSection from "@/components/faq-section";
import { getCategoryBySlug, getCategoryTranslation, getStaticCategoryParams, getToolsByCategory, getAllCategories } from "@/lib/tool-data";
import { getDictionary } from "@/lib/dictionaries";
import type { CommonDictionary } from "@/dictionaries/en/common";

export async function generateStaticParams() {
    return getStaticCategoryParams();
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; category: string }> }) {
    const { lang, category: categorySlug } = await params;

    const categoryData = await getCategoryBySlug(categorySlug, lang);
    if (!categoryData) {
        notFound();
    }

    const translation = getCategoryTranslation(categoryData, lang);
    const common = await getDictionary<CommonDictionary>(lang);

    // Get tools in this category for the current language
    const toolsRaw = await getToolsByCategory(categoryData.id, lang);
    const tools = toolsRaw.map((t) => ({ ...t, cta: { ...t.cta, text: common.tools.cta } }));

    // Get other categories for CTA
    const allCategories = await getAllCategories();
    const prefix = lang === "en" ? "" : `/${lang}`;
    const otherCategories = allCategories
        .filter((c) => c.id !== categoryData.id && c.translations[lang])
        .map((c) => {
            const catTr = c.translations[lang];
            return {
                headline: catTr.headline,
                slug: `${prefix}/${catTr.slug}`,
            };
        });

    return (
        <>
            <DefaultHero
                headline={translation.headline}
                description={translation.description}
            />

            <Section>
                <Container>
                    <CardsContainer cols={tools.length >= 3 ? "3" : "2"}>
                        {tools.map((tool) => (
                            <Card
                                key={tool.slug}
                                icon={tool.iconPath}
                                slug={tool.slug}
                                title={tool.title}
                                shortDescription={tool.shortDescription}
                                cta={tool.cta}
                            />
                        ))}
                    </CardsContainer>
                </Container>
            </Section>

            <Section>
                <Container>
                    <FaqSection
                        title={translation.faq.sectionTitle}
                        items={translation.faq.items}
                    />
                </Container>
            </Section>

            {otherCategories.length > 0 && (
                <Section>
                    <Container>
                        <div className="text-center">
                            <h2 className="text-2xl md:text-4xl font-medium mb-8">{lang === "ro" ? "Explorează alte categorii" : lang === "de" ? "Weitere Kategorien entdecken" : "Explore Other Categories"}</h2>
                            <div className="flex flex-wrap justify-center gap-4">
                                {otherCategories.map((cat) => (
                                    <a
                                        key={cat.slug}
                                        href={cat.slug}
                                        className="bg-[var(--clr-neutral-900)] text-[var(--clr-neutral-0)] px-6 py-3 rounded-xl border border-[var(--clr-neutral-900)] transition-all duration-300 hover:border-[var(--clr-green-500)] font-medium"
                                    >
                                        {cat.headline}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Container>
                </Section>
            )}
        </>
    );
}
