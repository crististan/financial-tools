import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // EN old tool URLs → new category URLs
      { source: "/currency-converter", destination: "/converters/currency-converter", permanent: true },
      { source: "/unit-converter", destination: "/converters/unit-converter", permanent: true },
      { source: "/loan-repayment-calculator", destination: "/financial/loan-repayment-calculator", permanent: true },
      { source: "/compound-interest-calculator", destination: "/financial/compound-interest-calculator", permanent: true },
      { source: "/nautical-fuel-calculator", destination: "/nautical/nautical-fuel-calculator", permanent: true },
      { source: "/monthly-budget-tracker", destination: "/planning/monthly-budget-tracker", permanent: true },

      // RO old tool URLs → new category URLs
      { source: "/ro/convertor-valutar", destination: "/ro/convertoare/convertor-valutar", permanent: true },
      { source: "/ro/convertor-unitati", destination: "/ro/convertoare/convertor-unitati", permanent: true },
      { source: "/ro/calculator-rate-credit", destination: "/ro/financiar/calculator-rate-credit", permanent: true },
      { source: "/ro/calculator-dobanda-compusa", destination: "/ro/financiar/calculator-dobanda-compusa", permanent: true },
      { source: "/ro/calculator-salariu", destination: "/ro/financiar/calculator-salariu", permanent: true },
      { source: "/ro/calculator-combustibil-nautic", destination: "/ro/nautic/calculator-combustibil-nautic", permanent: true },
      { source: "/ro/tracker-buget-lunar", destination: "/ro/planificare/tracker-buget-lunar", permanent: true },
      { source: "/ro/estimator-energie-solara", destination: "/ro/planificare/estimator-energie-solara", permanent: true },

      // DE old tool URLs → new category URLs
      { source: "/de/waehrungsrechner", destination: "/de/umrechner/waehrungsrechner", permanent: true },
      { source: "/de/einheitenrechner", destination: "/de/umrechner/einheitenrechner", permanent: true },
      { source: "/de/kreditrechner", destination: "/de/finanzen/kreditrechner", permanent: true },
      { source: "/de/zinseszinsrechner", destination: "/de/finanzen/zinseszinsrechner", permanent: true },
      { source: "/de/nautischer-kraftstoffrechner", destination: "/de/nautik/nautischer-kraftstoffrechner", permanent: true },
      { source: "/de/budgetplaner", destination: "/de/planung/budgetplaner", permanent: true },
    ];
  },
};

export default nextConfig;
