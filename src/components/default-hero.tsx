import Container from "./container";
import Section from "./section";
import Button from "./ui/button";

type propsTypes = {
    headline: string;
    description?: string;
    primaryCta?: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
}

export default function DefaultHero({ headline, description, primaryCta, secondaryCta }: propsTypes) {
    return (
        <Section className="pt-12 md:pt-20">
            <Container>
                <div className="w-full max-w-[800px] mx-auto">
                    <h1 className="text-4xl md:text-6xl font-medium text-center mb-6 md:mb-8">{headline}</h1>
                    {description && (
                        <p className="w-full max-w-[560px] mx-auto text-center text-[var(--clr-neutral-100)]">{description}</p>
                    )}
                    {(primaryCta || secondaryCta) && (
                        <div className="flex justify-center gap-4 mt-8">
                            {primaryCta && (
                                <Button link={{ href: primaryCta.href }} style="primary" text={primaryCta.text} />
                            )}
                            {secondaryCta && (
                                <Button link={{ href: secondaryCta.href }} style="secondary" text={secondaryCta.text} />
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    )
}
