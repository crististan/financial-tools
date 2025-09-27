import Container from "./container";
import Image from "next/image";
import Button from "./ui/button";

type propsTypes = {
    headline: string,
    primaryCta?: { text: string, href: string },
    secondaryCta?: { text: string, href: string },
}

export default function Hero({ headline, primaryCta, secondaryCta }: propsTypes) {
    return (
        <section className="py-[80px] md:py-[160px]">
            <Container>
                <div className="w-full max-w-[800px] mx-auto">
                    <h1 className="text-4xl md:text-7xl font-medium text-center mb-8 md:mb-10">{headline}</h1>
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
            <Image
                src="/hero-image.png"
                width={1200}
                height={800}
                className="w-full h-auto mt-[64px] md:mt-[100px]"
                alt="Hero image"
            />
        </section>
    )
}