export type CommonDictionary = {
    nav: {
        home: string;
        tools: string;
        more: string;
        contact: string;
    };
    homepage: {
        headline: string;
        primaryCta: string;
        secondaryCta: string;
        description: string;
        arrowAlt: string;
    };
    tools: {
        currencyConverter: string;
        currencyConverterDescription: string;
        loanRepaymentCalculator: string;
        loanRepaymentCalculatorDescription: string;
        meterConverter: string;
        meterConverterDescription: string;
        monthlyBudgetTracker: string;
        monthlyBudgetTrackerDescription: string;
        cta: string;
    };
    languageSelector: {
        label: string;
        en: string;
        ro: string;
        de: string;
    };
    sponsor: {
        label: string;
    };
};

const commonDictionary: CommonDictionary = {
    nav: {
        home: "Home",
        tools: "Tools",
        more: "More",
        contact: "Contact",
    },
    homepage: {
        headline: "Free financial tools for everyone",
        primaryCta: "Discover",
        secondaryCta: "Monthly Budget",
        description: "Our platform offers a wide range of free financial tools designed to help individuals manage their money effectively. From budgeting and saving to investment planning, our resources provide clear, practical insights to support informed financial decisions.",
        arrowAlt: "Discover tools",
    },
    tools: {
        currencyConverter: "Currency Converter",
        currencyConverterDescription: "Convert currencies quickly and reliably with up-to-date exchange rates.",
        loanRepaymentCalculator: "Loan Repayment Calculator",
        loanRepaymentCalculatorDescription: "Estimate your monthly loan payments and interest over time with ease.",
        meterConverter: "Meter Converter",
        meterConverterDescription: "Convert meters to miles, feet, yards, nautical miles, and more instantly.",
        monthlyBudgetTracker: "Monthly Budget Tracker",
        monthlyBudgetTrackerDescription: "Create, manage, and track your monthly budget effortlessly.",
        cta: "Learn more",
    },
    languageSelector: {
        label: "Language",
        en: "English",
        ro: "Romana",
        de: "Deutsch",
    },
    sponsor: {
        label: "Sponsored",
    },
};

export default commonDictionary;
