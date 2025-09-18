import Image from "next/image";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Hero 
        headline="Free financial tools for everyone" 
        primaryCta={{ text: "Discover", href: "/tools" }}
        secondaryCta={{ text: "Monthly Budget", href: "/monthly-budget" }}
      />
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </>
  );
}
