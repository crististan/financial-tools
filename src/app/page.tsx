import Image from "next/image";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero 
        headline="Free financial tools for everyone" 
        primaryCta={{ text: "Discover", href: "/tools" }}
        secondaryCta={{ text: "Monthly Budget", href: "/monthly-budget" }}
      />
    </>
  );
}
