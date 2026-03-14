import Image from "next/image";
import HomeHero from "@/components/home-hero";
import Separator from "@/components/separator";
import Container from "@/components/container";
import Section from "@/components/section";
import CardsContainer from "@/components/cards-container";
import Card from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionaries";
import { getLocalizedToolsFromJson } from "@/lib/tool-data";
import { getSponsorsForPage } from "@/lib/site-config";
import SponsorSection from "@/components/sponsor-section";
import type { CommonDictionary } from "@/dictionaries/en/common";


export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const common = await getDictionary<CommonDictionary>(lang);
    const toolsRaw = await getLocalizedToolsFromJson(lang);
    const tools = toolsRaw.map((t) => ({ ...t, cta: { ...t.cta, text: common.tools.cta } }));
    const sponsors = await getSponsorsForPage("homepage", lang);

    return (
        <>
            <HomeHero
                headline={common.homepage.headline}
                primaryCta={{ text: common.homepage.primaryCta, href: lang === "en" ? "/" : `/${lang}` }}
                secondaryCta={{ text: common.homepage.secondaryCta, href: tools.find(t => t.id === "monthly-budget-tracker")?.cta.href ?? "/monthly-budget-tracker" }}
            />

            <Separator />

            <Section>
                <Container>
                    <h2 className="text-[20px] md:text-[32px] mb-[20px] md:mb-[40px] leading-none">{common.homepage.description}</h2>
                    <Image
                        src="/arrow-down.svg"
                        width={64}
                        height={64}
                        className="w-[32px] md:w-[64px] h-auto"
                        alt={common.homepage.arrowAlt}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <CardsContainer cols="3">
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

            {sponsors.length > 0 && (
                <Section>
                    <Container>
                        <SponsorSection sponsors={sponsors} label={common.sponsor.label} />
                    </Container>
                </Section>
            )}
        </>
    );
}
