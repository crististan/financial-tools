import type { ReactNode } from "react";

type Props = {
    className?: string,
    children: ReactNode
}

export default function Section({ className = 'py-12 md:py-20', children }: Props) {
    return (
        <section className={className}>
            { children }
        </section>
    );
}