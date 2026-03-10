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
        lastUpdated: string;
    };
    howItWorks: {
        sectionTitle: string;
        steps: Array<{
            number: number;
            icon: string;
            title: string;
            description: string;
        }>;
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
    features: {
        sectionTitle: string;
        sectionDescription: string;
        items: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    educational: {
        sectionTitle: string;
        articles: Array<{
            title: string;
            content: string;
        }>;
    };
    faq: {
        sectionTitle: string;
        items: Array<{
            question: string;
            answer: string;
        }>;
    };
    cta: {
        title: string;
        description: string;
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
        lastUpdated: "Last updated: {date}",
    },
    howItWorks: {
        sectionTitle: "How to Convert Currency Online",
        steps: [
            {
                number: 1,
                icon: "keyboard",
                title: "Enter Your Amount",
                description: "Type the amount you want to convert in the input field. Our converter accepts any value from 0.01 to 999,999,999.",
            },
            {
                number: 2,
                icon: "arrowLeftRight",
                title: "Select Currencies",
                description: "Choose your source currency and target currency from the dropdown menus. We support 10 major world currencies.",
            },
            {
                number: 3,
                icon: "zap",
                title: "Get Instant Results",
                description: "Your conversion is calculated automatically in real time. No buttons to click, no waiting. Results update as you type.",
            },
        ],
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
    features: {
        sectionTitle: "Why Use Our Currency Converter",
        sectionDescription: "Trusted features designed for accurate and hassle-free currency conversions.",
        items: [
            {
                icon: "refreshCw",
                title: "Real-Time Exchange Rates",
                description: "Our rates are updated regularly to reflect the latest market conditions, ensuring your conversions are always accurate.",
            },
            {
                icon: "globe",
                title: "10+ Major Currencies",
                description: "Convert between USD, EUR, GBP, JPY, and 6 other major world currencies used in international trade and travel.",
            },
            {
                icon: "badgeDollarSign",
                title: "100% Free Forever",
                description: "No hidden fees, no premium tiers, no subscriptions. Our currency converter is completely free to use, always.",
            },
            {
                icon: "userX",
                title: "No Registration Required",
                description: "Start converting currencies instantly. No account creation, no email verification, no personal data collection.",
            },
        ],
    },
    educational: {
        sectionTitle: "Understanding Currency Exchange",
        articles: [
            {
                title: "What Drives Exchange Rate Movements?",
                content: "Exchange rates are influenced by a complex interplay of economic factors. Interest rate differentials between countries, inflation rates, trade balances, and political stability all play significant roles. When a country raises its interest rates, its currency typically strengthens as foreign investors seek higher returns. Conversely, high inflation erodes purchasing power and tends to weaken a currency over time.",
            },
            {
                title: "The World's Most Traded Currencies",
                content: "The US Dollar dominates global foreign exchange markets, involved in approximately 88% of all transactions. The Euro follows as the second most traded currency, accounting for about 31% of trades. The Japanese Yen, British Pound, and Australian Dollar round out the top five. Together, these five currencies represent the vast majority of the $7.5 trillion traded daily in forex markets.",
            },
            {
                title: "Tips for Getting the Best Exchange Rates",
                content: "To maximize the value of your currency exchange, compare rates across multiple providers before converting. Avoid exchanging money at airports or hotels, where rates are typically unfavorable. Consider using online converters to check rates before visiting a physical exchange bureau. For large amounts, even small differences in exchange rates can translate to significant savings.",
            },
        ],
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
            {
                question: "How often are exchange rates updated?",
                answer: "Our exchange rates are updated regularly throughout the day to reflect current market conditions. For the most time-sensitive transactions, we recommend checking rates immediately before converting, as forex markets operate 24 hours a day, five days a week.",
            },
            {
                question: "Can I convert currencies on my mobile phone?",
                answer: "Yes, our currency converter is fully responsive and works on any device including smartphones, tablets, and desktop computers. Simply open the page in your mobile browser and start converting immediately with no app download required.",
            },
            {
                question: "What is the mid-market exchange rate?",
                answer: "The mid-market rate, also called the interbank rate, is the midpoint between the buy and sell prices of two currencies on the global market. It is considered the fairest exchange rate and is the rate our converter displays. Banks and exchange services typically add a markup to this rate as their profit margin.",
            },
        ],
    },
    cta: {
        title: "Explore Our Other Financial Tools",
        description: "Manage every aspect of your finances with our free, easy-to-use calculators and trackers.",
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
