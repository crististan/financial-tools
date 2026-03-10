export type UnitConverterDictionary = {
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
    howItWorks: {
        sectionTitle: string;
        steps: Array<{
            number: number;
            icon: string;
            title: string;
            description: string;
        }>;
    };
    conversionTable: {
        sectionTitle: string;
        sectionDescription: string;
        headers: {
            pair: string;
            factor: string;
            inverseFactor: string;
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
    units: Record<string, string>;
};

const unitConverterDictionary: UnitConverterDictionary = {
    meta: {
        title: "Meter Converter | Convert Meters to Miles, Feet, Yards & More",
        description: "Free online meter converter. Convert meters to kilometers, miles, nautical miles, feet, inches, yards, and more. Instant results with no registration required.",
        keywords: [
            "meter converter",
            "meters to feet",
            "meters to miles",
            "meters to nautical miles",
            "length converter",
            "unit converter",
            "distance converter",
            "meters to yards",
            "meters to inches",
        ],
    },
    hero: {
        headline: "Meter Converter",
        description: "Convert meters to any length unit instantly. Supporting kilometers, miles, nautical miles, feet, inches, yards, and more.",
    },
    converter: {
        fromLabel: "From",
        toLabel: "To",
        amountPlaceholder: "Enter value",
        switchButtonAriaLabel: "Switch units",
        rateDisplay: "1 {from} = {rate} {to}",
    },
    howItWorks: {
        sectionTitle: "How to Convert Length Units Online",
        steps: [
            {
                number: 1,
                icon: "keyboard",
                title: "Enter Your Value",
                description: "Type the length value you want to convert. Our converter supports any numeric value with high precision.",
            },
            {
                number: 2,
                icon: "arrowLeftRight",
                title: "Select Units",
                description: "Choose the source and target units from the dropdown menus. We support 12 length units from millimeters to nautical miles.",
            },
            {
                number: 3,
                icon: "zap",
                title: "Get Instant Results",
                description: "Your conversion is calculated automatically using precise conversion factors. Results update in real time as you type.",
            },
        ],
    },
    conversionTable: {
        sectionTitle: "Common Length Conversions",
        sectionDescription: "Quick reference for the most commonly used length unit conversions from meters.",
        headers: {
            pair: "Conversion",
            factor: "Factor",
            inverseFactor: "Inverse Factor",
        },
    },
    features: {
        sectionTitle: "Why Use Our Meter Converter",
        sectionDescription: "Precise and reliable length conversions for engineering, science, travel, and everyday use.",
        items: [
            {
                icon: "zap",
                title: "Instant Conversion",
                description: "Results appear in real time as you type. No buttons to click, no page reloads. Just fast, accurate conversions.",
            },
            {
                icon: "globe",
                title: "12 Length Units",
                description: "Convert between metric, imperial, and nautical units including meters, kilometers, miles, nautical miles, feet, and more.",
            },
            {
                icon: "shield",
                title: "High Precision",
                description: "Our conversion factors are based on internationally agreed standards, ensuring results you can trust for professional use.",
            },
            {
                icon: "calculator",
                title: "Works Both Ways",
                description: "Easily switch between units with one click. Convert meters to feet or feet to meters with the same tool.",
            },
        ],
    },
    educational: {
        sectionTitle: "Understanding Length Measurement",
        articles: [
            {
                title: "The Metric System and the Meter",
                content: "The meter is the base unit of length in the International System of Units (SI). Originally defined in 1793 as one ten-millionth of the distance from the equator to the North Pole, it is now defined by the speed of light: one meter is the distance light travels in a vacuum in 1/299,792,458 of a second. The metric system's decimal structure makes it easy to convert between millimeters, centimeters, meters, and kilometers.",
            },
            {
                title: "Imperial vs Metric: A Global Divide",
                content: "While most of the world uses the metric system, the United States, Liberia, and Myanmar still primarily use imperial units for everyday measurements. The imperial system includes inches, feet, yards, and miles. One mile equals exactly 1,609.344 meters. Understanding conversions between these systems is essential for international trade, travel, and scientific collaboration.",
            },
            {
                title: "Nautical Miles: Measuring Distance at Sea",
                content: "A nautical mile is based on the circumference of the Earth and equals exactly 1,852 meters. It is used in aviation and maritime navigation because it corresponds to one minute of latitude. Knots, the unit of speed at sea, measure nautical miles per hour. This relationship makes nautical charts and navigation calculations straightforward and intuitive.",
            },
        ],
    },
    faq: {
        sectionTitle: "Frequently Asked Questions",
        items: [
            {
                question: "How many feet are in a meter?",
                answer: "One meter equals exactly 3.28084 feet. This conversion is based on the international agreement that one inch equals exactly 25.4 millimeters, which makes one foot (12 inches) equal to 0.3048 meters.",
            },
            {
                question: "What is the difference between a mile and a nautical mile?",
                answer: "A statute mile equals 1,609.344 meters (5,280 feet), while a nautical mile equals exactly 1,852 meters. A nautical mile is about 15% longer than a statute mile. Nautical miles are used in maritime and aviation navigation because they relate directly to degrees of latitude.",
            },
            {
                question: "How do I convert meters to kilometers?",
                answer: "To convert meters to kilometers, divide the number of meters by 1,000. For example, 5,000 meters equals 5 kilometers. The prefix 'kilo' means thousand, so one kilometer is literally one thousand meters.",
            },
            {
                question: "Why does the US still use imperial units?",
                answer: "The US adopted imperial-based customary units before the metric system was widely established. While the US government has supported voluntary metrication since 1975, the cost and disruption of switching everyday measurements have slowed adoption. Many US industries, especially science and medicine, already use metric units.",
            },
            {
                question: "What is the smallest unit of length?",
                answer: "In everyday use, millimeters (0.001 meters) are among the smallest practical units. In science, micrometers (0.000001 meters) measure cells, nanometers (0.000000001 meters) measure molecules, and the Planck length (about 1.6 x 10^-35 meters) is considered the smallest meaningful length in physics.",
            },
            {
                question: "How accurate are online unit converters?",
                answer: "Online unit converters like ours use internationally standardized conversion factors and are extremely accurate for practical purposes. Our converter uses the exact, officially defined relationships between units (e.g., 1 inch = exactly 25.4 mm), ensuring results reliable enough for engineering and scientific work.",
            },
            {
                question: "What is a yard and how does it relate to a meter?",
                answer: "A yard is an imperial unit of length equal to 3 feet or 36 inches. One yard equals exactly 0.9144 meters. The yard was historically defined by a physical standard bar in England but is now defined in terms of the meter for precision.",
            },
            {
                question: "How many meters are in a mile?",
                answer: "One mile equals exactly 1,609.344 meters. This is the statute mile used for land distances. To convert miles to meters, multiply the number of miles by 1,609.344. For example, a 5K race is approximately 3.107 miles.",
            },
            {
                question: "What units do scientists use to measure length?",
                answer: "Scientists use the metric system, with the meter as the base unit. Depending on the scale, they use kilometers for large distances, meters and centimeters for everyday objects, millimeters for small items, micrometers for cells, and nanometers for molecules and wavelengths of light.",
            },
            {
                question: "Can I use this converter on my phone?",
                answer: "Yes, our unit converter is fully responsive and works perfectly on smartphones, tablets, and desktop computers. Simply open the page in your mobile browser and start converting instantly with no app download required.",
            },
        ],
    },
    cta: {
        title: "Explore Our Other Financial Tools",
        description: "Manage every aspect of your finances with our free, easy-to-use calculators and trackers.",
    },
    units: {
        mm: "Millimeter",
        cm: "Centimeter",
        m: "Meter",
        km: "Kilometer",
        in: "Inch",
        ft: "Foot",
        yd: "Yard",
        mi: "Mile",
        nmi: "Nautical Mile",
        fathom: "Fathom",
        furlong: "Furlong",
        league: "League",
    },
};

export default unitConverterDictionary;
