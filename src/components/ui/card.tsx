import Image from "next/image";
import Button from "./button";

type Props = {
    icon: string,
    slug: string,
    title: string,
    shortDescription: string,
    cta: { text: string, href: string }
};

export default function Card({ icon, slug, title, shortDescription, cta }: Props) {
    return (
        <div className="w-full bg-[var(--clr-neutral-900)] text-[var(--clr-neutral-0)] rounded-4xl py-12 px-10 flex flex-col gap-5 border-1 border-[var(--clr-neutral-900)] transition-discrete duration-300 ease-in-out hover:border-[var(--clr-green-500)]">
            <Image
                src={icon}
                width={64}
                height={64}
                className="w-[64px] h-auto"
                alt={title}
            />
            <h2 className="text-base md:text-[24px] lg:text-[32px] font-medium leading-[1.2]">{title}</h2>
            <p className="text-base">{shortDescription}</p>
            <Button 
                link={{
                    href: cta.href,
                    isExternal: false
                }}
                style="primary"
                text={cta.text}
            />
        </div>
    );
}