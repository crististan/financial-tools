export type LoanRepaymentCalculatorDictionary = {
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
    hero: {
        headline: string;
        description: string;
    };
    calculator: {
        loanAmountLabel: string;
        loanAmountPlaceholder: string;
        interestRateLabel: string;
        interestRatePlaceholder: string;
        loanTermLabel: string;
        loanTermPlaceholder: string;
        termUnitLabel: string;
        termUnitYears: string;
        termUnitMonths: string;
        monthlyPaymentLabel: string;
        totalPaymentLabel: string;
        totalInterestLabel: string;
    };
    amortizationTable: {
        sectionTitle: string;
        sectionDescription: string;
        toggleLabel: string;
        headers: {
            month: string;
            payment: string;
            principal: string;
            interest: string;
            balance: string;
        };
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
};

const loanRepaymentCalculatorDictionary: LoanRepaymentCalculatorDictionary = {
    meta: {
        title: "Loan Repayment Calculator | Monthly Payment & Amortization Schedule",
        description: "Free loan repayment calculator. Calculate monthly payments, total interest, and view a full amortization schedule for any loan. Supports fixed-rate mortgages, auto loans, and personal loans.",
        keywords: [
            "loan calculator",
            "loan repayment calculator",
            "monthly payment calculator",
            "mortgage calculator",
            "amortization schedule",
            "interest calculator",
            "auto loan calculator",
            "personal loan calculator",
        ],
    },
    hero: {
        headline: "Loan Repayment Calculator",
        description: "Calculate your monthly loan payments, total interest, and view a detailed amortization schedule. Works for mortgages, auto loans, personal loans, and more.",
    },
    calculator: {
        loanAmountLabel: "Loan Amount",
        loanAmountPlaceholder: "e.g. 250000",
        interestRateLabel: "Annual Interest Rate (%)",
        interestRatePlaceholder: "e.g. 6.5",
        loanTermLabel: "Loan Term",
        loanTermPlaceholder: "e.g. 30",
        termUnitLabel: "Term Unit",
        termUnitYears: "Years",
        termUnitMonths: "Months",
        monthlyPaymentLabel: "Monthly Payment",
        totalPaymentLabel: "Total Payment",
        totalInterestLabel: "Total Interest",
    },
    amortizationTable: {
        sectionTitle: "Amortization Schedule",
        sectionDescription: "See how each payment is split between principal and interest over the life of your loan.",
        toggleLabel: "Show amortization schedule",
        headers: {
            month: "Month",
            payment: "Payment",
            principal: "Principal",
            interest: "Interest",
            balance: "Remaining Balance",
        },
    },
    howItWorks: {
        sectionTitle: "How to Calculate Your Loan Repayment",
        steps: [
            {
                number: 1,
                icon: "dollarSign",
                title: "Enter Loan Amount",
                description: "Type the total amount you plan to borrow. This is the principal balance before any interest is applied.",
            },
            {
                number: 2,
                icon: "percent",
                title: "Set Interest Rate & Term",
                description: "Enter your annual interest rate and the loan duration in years or months. The calculator handles the conversion automatically.",
            },
            {
                number: 3,
                icon: "chartBar",
                title: "Review Your Results",
                description: "Instantly see your monthly payment, total amount paid, and total interest. Expand the amortization table for a month-by-month breakdown.",
            },
        ],
    },
    features: {
        sectionTitle: "Why Use Our Loan Calculator",
        sectionDescription: "Powerful features to help you understand and plan your loan repayment strategy.",
        items: [
            {
                icon: "zap",
                title: "Instant Calculation",
                description: "Results update in real time as you adjust any input. No buttons to click, no page reloads. Just fast, accurate loan calculations.",
            },
            {
                icon: "table",
                title: "Full Amortization Schedule",
                description: "View a detailed month-by-month breakdown showing how each payment is split between principal and interest over the life of your loan.",
            },
            {
                icon: "arrowLeftRight",
                title: "Flexible Term Units",
                description: "Enter your loan term in years or months. The calculator converts automatically, giving you full flexibility to model any loan scenario.",
            },
            {
                icon: "shield",
                title: "Accurate & Transparent",
                description: "Uses the standard amortization formula used by banks and lenders worldwide. No hidden fees, no surprises in our calculations.",
            },
        ],
    },
    educational: {
        sectionTitle: "Understanding Loan Repayment",
        articles: [
            {
                title: "How Amortization Works",
                content: "Amortization is the process of paying off a loan through regular monthly payments. Each payment covers two parts: interest charged on the remaining balance and a portion that reduces the principal. In the early years of a loan, most of each payment goes toward interest. As the balance decreases, more of each payment goes toward principal. This is why making extra payments early in a loan can significantly reduce total interest paid.",
            },
            {
                title: "Fixed-Rate vs Variable-Rate Loans",
                content: "A fixed-rate loan locks in your interest rate for the entire term, making monthly payments predictable and easy to budget. A variable-rate (or adjustable-rate) loan starts with a lower rate that can change periodically based on market conditions. Fixed rates provide stability, while variable rates may save money if interest rates decrease. Our calculator models fixed-rate loans, which are the most common type for mortgages and auto loans.",
            },
            {
                title: "The True Cost of Borrowing",
                content: "The total cost of a loan extends far beyond the borrowed amount. On a 30-year mortgage of $300,000 at 6.5% interest, you would pay approximately $382,000 in interest alone, nearly doubling the original loan. Shorter loan terms dramatically reduce total interest: the same loan over 15 years would cost about $170,000 in interest. Understanding this relationship between term length and total cost is essential for making informed borrowing decisions.",
            },
        ],
    },
    faq: {
        sectionTitle: "Frequently Asked Questions",
        items: [
            {
                question: "How is the monthly payment calculated?",
                answer: "The monthly payment is calculated using the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n – 1], where P is the loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the total number of monthly payments. This formula ensures equal payments throughout the loan term.",
            },
            {
                question: "What happens if the interest rate is 0%?",
                answer: "With a 0% interest rate, the monthly payment is simply the loan amount divided by the number of months. There is no interest charge, so you only pay back the principal. This scenario is common with promotional financing offers from retailers or auto dealers.",
            },
            {
                question: "What is the difference between interest rate and APR?",
                answer: "The interest rate is the cost of borrowing the principal amount. The APR (Annual Percentage Rate) includes the interest rate plus other charges like origination fees, closing costs, and mortgage insurance. APR gives a more complete picture of the total borrowing cost and is typically higher than the base interest rate.",
            },
            {
                question: "How does loan term length affect total cost?",
                answer: "Longer loan terms result in lower monthly payments but significantly higher total interest paid. A shorter term means higher monthly payments but less total interest. For example, a $200,000 loan at 6% costs about $231,000 in interest over 30 years, but only about $103,000 in interest over 15 years.",
            },
            {
                question: "Can I pay off my loan early?",
                answer: "Most loans allow early repayment, though some may have prepayment penalties. Making extra payments toward the principal reduces your total interest and shortens the loan term. Even small additional monthly payments can save thousands of dollars over the life of a mortgage.",
            },
            {
                question: "What is an amortization schedule?",
                answer: "An amortization schedule is a table showing each monthly payment broken down into principal and interest portions, along with the remaining balance. It illustrates how the loan balance decreases over time and how the proportion of each payment going to principal increases as the loan matures.",
            },
            {
                question: "Is this calculator accurate for my mortgage?",
                answer: "This calculator provides accurate estimates for fixed-rate loans using the standard amortization formula. However, actual mortgage payments may differ slightly due to property taxes, homeowners insurance, PMI (private mortgage insurance), and HOA fees, which are often included in the total monthly payment but are not part of the loan calculation itself.",
            },
            {
                question: "What types of loans does this calculator work for?",
                answer: "This calculator works for any fixed-rate amortizing loan, including home mortgages, auto loans, personal loans, student loans, and business loans. It calculates payments based on the standard equal-payment amortization method used by most lenders.",
            },
            {
                question: "Why does most of my early payment go toward interest?",
                answer: "Interest is calculated on the remaining balance each month. When the balance is high at the start of the loan, the interest charge is large, leaving less of each payment for principal reduction. As you pay down the balance, the interest portion shrinks and more of each payment goes toward principal. This is a natural characteristic of amortizing loans.",
            },
            {
                question: "Can I use this calculator on my phone?",
                answer: "Yes, our loan repayment calculator is fully responsive and works perfectly on smartphones, tablets, and desktop computers. Simply open the page in your mobile browser and start calculating instantly with no app download required.",
            },
        ],
    },
    cta: {
        title: "Explore Our Other Financial Tools",
        description: "Manage every aspect of your finances with our free, easy-to-use calculators and trackers.",
    },
};

export default loanRepaymentCalculatorDictionary;
