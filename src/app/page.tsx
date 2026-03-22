import Image from "next/image";
import HomeHero from "@/components/home-hero";
import Header from "@/components/header";
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

export default async function RootHome() {
    const lang = "en";
    const common = await getDictionary<CommonDictionary>(lang);
    const toolsRaw = await getLocalizedToolsFromJson(lang);
    const tools = toolsRaw.map((t) => ({ ...t, cta: { ...t.cta, text: common.tools.cta } }));
    const sponsors = await getSponsorsForPage("homepage", lang);

    return (
        <>
            <Header lang={lang} common={common} />
            <main>
            <HomeHero
                headline={common.homepage.headline}
                primaryCta={{ text: common.homepage.primaryCta, href: "/" }}
                secondaryCta={{ text: common.homepage.secondaryCta, href: "/planning/monthly-budget-tracker" }}
            />

            <Separator />

            <Section>
                <Container>
                    <h2 className="text-[20px] md:text-[32px] mb-[20px] md:mb-[40px] leading-none">{common.homepage.description}</h2>
                    <Image
                        src="/arrow-down.svg"
                        width={64}
                        height={64}
                        className="w-[32px] md:w-[64px] h-auto themed-icon"
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
            </main>
        </>
    );
}
