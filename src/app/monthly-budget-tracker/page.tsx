import DefaultHero from "@/components/default-hero";
import Section from "@/components/section";
import Container from "@/components/container";
import HowItWorks from "@/components/how-it-works";
import FeatureCards from "@/components/feature-cards";
import EducationalContent from "@/components/educational-content";
import FaqSection from "@/components/faq-section";
import ToolsCta from "@/components/tools-cta";
import BudgetTracker from "@/components/budget-tracker";
import dictionary from "@/dictionaries/en/monthly-budget-tracker";
import { CONFIG } from "@/lib/config";

export default function MonthlyBudgetTrackerPage() {
    return (
        <>
            <DefaultHero
                headline={dictionary.hero.headline}
                description={dictionary.hero.description}
            />

            <Section>
                <Container>
                    <BudgetTracker
                        labels={dictionary.tracker}
                        defaultCategories={dictionary.defaultCategories}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <HowItWorks
                        sectionTitle={dictionary.howItWorks.sectionTitle}
                        steps={dictionary.howItWorks.steps}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <FeatureCards
                        sectionTitle={dictionary.features.sectionTitle}
                        sectionDescription={dictionary.features.sectionDescription}
                        items={dictionary.features.items}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <EducationalContent
                        sectionTitle={dictionary.educational.sectionTitle}
                        articles={dictionary.educational.articles}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <FaqSection
                        title={dictionary.faq.sectionTitle}
                        items={dictionary.faq.items}
                    />
                </Container>
            </Section>

            <Section>
                <Container>
                    <ToolsCta
                        title={dictionary.cta.title}
                        description={dictionary.cta.description}
                        tools={CONFIG.tools}
                        currentToolSlug="monthly-budget-tracker"
                    />
                </Container>
            </Section>
        </>
    );
}
