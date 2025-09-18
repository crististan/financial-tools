import Link from "next/link";

type propsTypes = {
    link?: {
        href: string,
        isExternal?: boolean
    },
    button?: {
        type: "button" | "submit" | "reset" | undefined,
        onClick?: () => void
    },
    style: string,
    text: string
}

export default function Button({ link, button, style, text }: propsTypes) {
    let styles = "";

    switch (style) {
        case "secondary":
            styles = "px-6 py-3 bg-[var(--clr-neutral-1000)] text-[var(--clr-neutral-0)] border-1 border-[var(--clr-neutral-0)] rounded-full hover:bg-[var(--clr-neutral-0)] hover:text-[var(--clr-neutral-1000)] transition";
            break;
        case "tertiary":
            break;
        default:
            styles = "px-6 py-3 bg-[var(--clr-green-500)] border-1 border-[var(--clr-green-500)] text-[var(--clr-neutral-1000)] rounded-full hover:bg-[var(--clr-neutral-0)] hover:border-[var(--clr-neutral-0)] transition";
            break;
    }
    return (
        <>
            {link && (
                <Link href={link.href} className={styles} target={link.isExternal ? "_blank" : "_self"} rel={link.isExternal ? "noopener noreferrer" : undefined}>
                    {text}
                </Link>
            )}
            {button &&(
                <button type={button.type} onClick={button.onClick} className={styles}>
                    {text}
                </button>
            )}
        </>
    )
}