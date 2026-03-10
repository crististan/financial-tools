import Image from "next/image";
import Button from "@/components/ui/button";

type ToolCtaItem = {
    slug: string;
    title: string;
    iconPath: string;
    shortDescription: string;
    cta: {
        href: string;
        text: string;
    };
};

type ToolsCtaProps = {
    title: string;
    description?: string;
    tools: ToolCtaItem[];
    currentToolSlug: string;
};

export default function ToolsCta({ title, description, tools, currentToolSlug }: ToolsCtaProps) {
    const otherTools = tools.filter((tool) => tool.slug !== currentToolSlug);

    if (otherTools.length === 0) return null;

    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-medium mb-4">{title}</h2>
                {description && (
                    <p className="text-[var(--clr-neutral-100)] max-w-[600px] mx-auto">{description}</p>
                )}
            </div>
            <div className={`grid grid-cols-1 ${otherTools.length >= 2 ? 'md:grid-cols-2' : ''} gap-6 max-w-[900px] mx-auto`}>
                {otherTools.map((tool) => (
                    <div
                        key={tool.slug}
                        className="bg-[var(--clr-neutral-900)] rounded-4xl py-10 px-8 flex flex-col gap-4 border border-[var(--clr-neutral-900)] transition-all duration-300 hover:border-[var(--clr-green-500)]"
                    >
                        <Image
                            src={tool.iconPath}
                            width={48}
                            height={48}
                            className="w-[48px] h-auto"
                            alt={tool.title}
                        />
                        <h3 className="text-lg md:text-2xl font-medium">{tool.title}</h3>
                        <p className="text-[var(--clr-neutral-100)] text-sm">{tool.shortDescription}</p>
                        <Button
                            link={{ href: tool.cta.href, isExternal: false }}
                            style="primary"
                            text={tool.cta.text}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
