import type { ReactNode } from "react";

type Props = {
    cols: "1" | "2" | "3" | "4",
    children: ReactNode
}

export default function CardsContainer({ cols, children }: Props) {
    let classes = "";

    switch (cols) {
        case "1":
            classes = "grid-cols-1";
            break;
        case "2":
            classes = "grid-cols-1 md:grid-cols-2";
            break;
        case "3":
            classes = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
            break;
        default:
            classes = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
            break;
    }

    return (
        <div className={`grid gap-4 ${classes}`}>
            {children}
        </div>
    );
}