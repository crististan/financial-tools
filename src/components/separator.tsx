import Image from "next/image";

export default function Separator() {
    return (
        <Image
            src="/hero-wave.svg"
            alt="Hero image"
            width={1920}
            height={500}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1080px) 100vw, 1920px"
            priority
        />
    );
}
