import Image from "next/image";
import Hero from "@/components/hero";
import Container from "@/components/container";
import CardsContainer from "@/components/cards-container";
import Card from "@/components/ui/card";

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

      <section>
        <Container>
          <CardsContainer cols="3">
            <Card 
              icon="/icons/currency-converter-icon.svg" 
              slug="currency-converter" 
              title="Currency Converter" 
              shortDescription="Convert currencies quickly and reliably with up-to-date exchange rates." 
              cta={{ text: "Learn More", href: "#" }} 
            />
            <Card 
              icon="/icons/loan-repayment-calculator-icon.svg" 
              slug="loan-repayment-calculator" 
              title="Loan Repayment Calculator" 
              shortDescription="Estimate your monthly loan payments and interest over time with ease." 
              cta={{ text: "Learn More", href: "#" }} 
            />
            <Card 
              icon="/icons/monthly-budget-tracker-icon.svg" 
              slug="monthly-budget-tracker" 
              title="Monthly Budget Tracker" 
              shortDescription="Create, manage, and track your monthly budget effortlessly." 
              cta={{ text: "Learn More", href: "#" }} 
            />
          </CardsContainer>
        </Container>
      </section>
    </>
  );
}
