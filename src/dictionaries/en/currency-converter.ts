export type CurrencyConverterDictionary = {
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
    hero: {
        headline: string;
        description: string;
    };
    converter: {
        fromLabel: string;
        toLabel: string;
        amountPlaceholder: string;
        switchButtonAriaLabel: string;
        rateDisplay: string;
    };
    exchangeRatesTable: {
        sectionTitle: string;
        sectionDescription: string;
        headers: {
            pair: string;
            rate: string;
            inverseRate: string;
        };
    };
    faq: {
        sectionTitle: string;
        items: Array<{
            question: string;
            answer: string;
        }>;
    };
    currencies: Record<string, string>;
};

const currencyConverterDictionary: CurrencyConverterDictionary = {
    meta: {
        title: "Free Currency Converter | Real-Time Exchange Rates",
        description: "Convert between 10 major world currencies with our free online currency converter. Get instant exchange rates for USD, EUR, GBP, JPY, and more.",
        keywords: [
            "currency converter",
            "exchange rates",
            "USD to EUR",
            "convert currency",
            "foreign exchange",
            "currency calculator",
            "money converter",
        ],
    },
    hero: {
        headline: "Currency Converter",
        description: "Convert currencies quickly and reliably with up-to-date exchange rates. Supporting 10 major world currencies.",
    },
    converter: {
        fromLabel: "From",
        toLabel: "To",
        amountPlaceholder: "Enter amount",
        switchButtonAriaLabel: "Switch currencies",
        rateDisplay: "1 {from} = {rate} {to}",
    },
    exchangeRatesTable: {
        sectionTitle: "Popular Exchange Rates",
        sectionDescription: "Compare exchange rates between the most commonly traded currency pairs worldwide.",
        headers: {
            pair: "Currency Pair",
            rate: "Exchange Rate",
            inverseRate: "Inverse Rate",
        },
    },
    faq: {
        sectionTitle: "Frequently Asked Questions",
        items: [
            {
                question: "How does a currency converter work?",
                answer: "A currency converter uses current exchange rates to calculate how much one currency is worth in another. You enter an amount, select the source and target currencies, and the converter multiplies the amount by the exchange rate to show the equivalent value.",
            },
            {
                question: "What are exchange rates and how are they determined?",
                answer: "Exchange rates represent the value of one currency relative to another. They are determined by supply and demand in foreign exchange markets, influenced by factors such as interest rates, inflation, trade balances, and economic stability.",
            },
            {
                question: "What is the difference between a bid and ask rate?",
                answer: "The bid rate is the price at which a dealer will buy a currency, while the ask rate is the price at which they will sell it. The difference between the two is called the spread, which represents the dealer's profit margin.",
            },
            {
                question: "Why do exchange rates fluctuate?",
                answer: "Exchange rates fluctuate due to changes in economic indicators, geopolitical events, central bank policies, market speculation, and differences in interest rates between countries. These factors affect the supply and demand for each currency.",
            },
            {
                question: "What are the most traded currencies in the world?",
                answer: "The most traded currencies are the US Dollar (USD), Euro (EUR), Japanese Yen (JPY), British Pound (GBP), and Australian Dollar (AUD). The USD is involved in approximately 88% of all foreign exchange transactions.",
            },
            {
                question: "Is it better to exchange currency at a bank or online?",
                answer: "Online currency exchange services typically offer more competitive rates than banks because they have lower overhead costs. However, banks provide added security and are suitable for large transactions. Always compare rates and fees before exchanging.",
            },
            {
                question: "What is a currency pair?",
                answer: "A currency pair shows the exchange rate between two currencies. The first currency listed is the base currency and the second is the quote currency. For example, USD/EUR = 0.92 means 1 US Dollar equals 0.92 Euros.",
            },
        ],
    },
    currencies: {
        USD: "US Dollar",
        EUR: "Euro",
        GBP: "British Pound",
        JPY: "Japanese Yen",
        AUD: "Australian Dollar",
        CAD: "Canadian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        SEK: "Swedish Krona",
        NZD: "New Zealand Dollar",
    },
};

export default currencyConverterDictionary;
