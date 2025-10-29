import Container from "./container";
import Section from "./section";
import Image from "next/image";
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
        <Section className="pt-[80px] md:pt-[160px]">
            <Container>
                <div className="w-full max-w-[800px] mx-auto">
                    <h1 className="text-4xl md:text-7xl font-medium text-center mb-8 md:mb-10">{headline}</h1>
                    <p className="w-full max-w-[480px] my-8 mx-auto text-center">{description}</p>
                    <div className="flex justify-center gap-4">
                        {primaryCta && (
                            <Button link={{ href: primaryCta.href }} style="primary" text={primaryCta.text} />
                        )}
                        {secondaryCta && ( 
                            <Button link={{ href: secondaryCta.href }} style="secondary" text={secondaryCta.text} />
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    )
}