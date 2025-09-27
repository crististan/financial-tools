import Image from "next/image";
import Hero from "@/components/hero";
import Container from "@/components/container";

export default function Home() {
  return (
    <>
      <Hero 
        headline="Free financial tools for everyone" 
        primaryCta={{ text: "Discover", href: "/tools" }}
        secondaryCta={{ text: "Monthly Budget", href: "/monthly-budget" }}
      />

      <section>
        <Container>
          <h2 className="text-[20px] md:text-[32px] mb-[20px] md:mb-[40px] leading-none">Our platform offers a wide range of free financial tools designed to help individuals manage their money effectively. From budgeting and saving to investment planning, our resources provide clear, practical insights to support informed financial decisions.</h2>
          <Image
              src="/arrow-down.svg"
              width={64}
              height={64}
              className="w-[32px] md:w-[64px] h-auto"
              alt="Discover tools"
          />
        </Container>
      </section>
    </>
  );
}
