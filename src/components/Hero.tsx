import Container from "./Container";
import Image from "next/image";

type propsTypes = {
    headline: string,
    primaryCta?: { text: string, href: string },
    secondaryCta?: { text: string, href: string },
}

export default function Hero({ headline, primaryCta, secondaryCta }: propsTypes) {
    return (
        <div className="py-[200px]">
            <Container>
                <div className="w-full max-w-[800px] mx-auto">
                    <h1 className="text-4xl md:text-7xl font-medium text-center mb-8 md:mb-10">{headline}</h1>
                    <div className="flex justify-center gap-4">
                        {primaryCta && (
                            <a href={primaryCta.href} className="px-6 py-3 bg-[var(--clr-green-500)] border-1 border-[var(--clr-green-500)] text-[var(--clr-neutral-1000)] rounded-full hover:bg-[var(--clr-neutral-0)] hover:border-[var(--clr-neutral-0)] transition">
                                {primaryCta.text}
                            </a>
                        )}
                        {secondaryCta && ( <a href={secondaryCta.href} className="px-6 py-3 bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)] border-1 border-[var(--clr-neutral-0)] rounded-full hover:bg-[var(--clr-neutral-0)] hover:text-[var(--clr-neutral-1000)] transition">
                                {secondaryCta.text}
                            </a>
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
        </div>
    )
}