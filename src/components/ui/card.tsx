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
        <div className="w-full bg-[var(--clr-neutral-900)] text-[var(--clr-neutral-0)] rounded-4xl py-12 px-10 flex flex-col gap-5">
            <Image
                src={icon}
                width={64}
                height={64}
                className="w-[64px] h-auto"
                alt={title}
            />
            <h2 className="text-[24px] md:text-[32px] font-medium">{title}</h2>
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