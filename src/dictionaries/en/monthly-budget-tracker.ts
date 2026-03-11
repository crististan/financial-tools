export type MonthlyBudgetTrackerDictionary = {
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
    hero: {
        headline: string;
        description: string;
    };
    tracker: {
        incomeTitle: string;
        expensesTitle: string;
        categoryLabel: string;
        categoryPlaceholder: string;
        plannedLabel: string;
        plannedPlaceholder: string;
        actualLabel: string;
        actualPlaceholder: string;
        addButtonLabel: string;
        removeButtonAriaLabel: string;
        summaryTitle: string;
        totalIncomePlanLabel: string;
        totalIncomeActualLabel: string;
        totalExpensesPlanLabel: string;
        totalExpensesActualLabel: string;
        balancePlanLabel: string;
        balanceActualLabel: string;
        differenceLabel: string;
        resetButtonLabel: string;
        resetConfirmMessage: string;
        noDataMessage: string;
        progressLabel: string;
    };
    defaultCategories: {
        income: Array<{ name: string; planned: number }>;
        expenses: Array<{ name: string; planned: number }>;
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

const monthlyBudgetTrackerDictionary: MonthlyBudgetTrackerDictionary = {
    meta: {
        title: "Monthly Budget Tracker | Free Income & Expense Planner",
        description: "Free monthly budget tracker. Plan and track your income and expenses, compare planned vs actual spending, and stay in control of your personal finances. No registration required.",
        keywords: [
            "budget tracker",
            "monthly budget",
            "expense tracker",
            "income tracker",
            "budget planner",
            "personal finance",
            "spending tracker",
            "money management",
        ],
    },
    hero: {
        headline: "Monthly Budget Tracker",
        description: "Plan your monthly income and expenses, track actual spending, and see exactly where your money goes. All data stays in your browser.",
    },
    tracker: {
        incomeTitle: "Income",
        expensesTitle: "Expenses",
        categoryLabel: "Category",
        categoryPlaceholder: "Category name",
        plannedLabel: "Planned",
        plannedPlaceholder: "0.00",
        actualLabel: "Actual",
        actualPlaceholder: "0.00",
        addButtonLabel: "Add category",
        removeButtonAriaLabel: "Remove category",
        summaryTitle: "Monthly Summary",
        totalIncomePlanLabel: "Total Income (Planned)",
        totalIncomeActualLabel: "Total Income (Actual)",
        totalExpensesPlanLabel: "Total Expenses (Planned)",
        totalExpensesActualLabel: "Total Expenses (Actual)",
        balancePlanLabel: "Balance (Planned)",
        balanceActualLabel: "Balance (Actual)",
        differenceLabel: "Difference",
        resetButtonLabel: "Reset all data",
        resetConfirmMessage: "Are you sure you want to reset all budget data? This action cannot be undone.",
        noDataMessage: "Add at least one income and one expense category to see your summary.",
        progressLabel: "{percent}% of planned",
    },
    defaultCategories: {
        income: [
            { name: "Salary", planned: 5000 },
            { name: "Freelance / Side Income", planned: 0 },
        ],
        expenses: [
            { name: "Rent / Mortgage", planned: 1500 },
            { name: "Utilities", planned: 200 },
            { name: "Groceries", planned: 400 },
            { name: "Transport", planned: 150 },
            { name: "Health", planned: 100 },
            { name: "Entertainment", planned: 100 },
            { name: "Subscriptions", planned: 50 },
            { name: "Savings", planned: 500 },
        ],
    },
    howItWorks: {
        sectionTitle: "How to Track Your Monthly Budget",
        steps: [
            {
                number: 1,
                icon: "listPlus",
                title: "Set Up Categories",
                description: "Start with the predefined income and expense categories, or customize them to match your financial life. Add or remove categories anytime.",
            },
            {
                number: 2,
                icon: "pencilLine",
                title: "Enter Planned & Actual Amounts",
                description: "At the start of the month, set planned budgets for each category. As you spend and earn, update the actual amounts to track your progress.",
            },
            {
                number: 3,
                icon: "chartBar",
                title: "Review Your Summary",
                description: "The summary updates instantly, showing total income, expenses, balance, and how your actual spending compares to your plan. Green means on track, red means over budget.",
            },
        ],
    },
    features: {
        sectionTitle: "Why Use Our Budget Tracker",
        sectionDescription: "Simple yet powerful tools to help you take control of your monthly finances.",
        items: [
            {
                icon: "save",
                title: "Auto-Save to Browser",
                description: "Your budget data is automatically saved to your browser's local storage. Come back anytime and pick up right where you left off.",
            },
            {
                icon: "layoutList",
                title: "Custom Categories",
                description: "Start with smart default categories or create your own. Add, rename, or remove categories to perfectly match your spending habits.",
            },
            {
                icon: "barChart3",
                title: "Plan vs Actual Tracking",
                description: "Set planned budgets at the start of the month and track actual spending as you go. Instantly see where you are over or under budget.",
            },
            {
                icon: "shield",
                title: "Private & Secure",
                description: "All your financial data stays in your browser. We never collect, store, or transmit your personal budget information to any server.",
            },
        ],
    },
    educational: {
        sectionTitle: "Mastering Your Monthly Budget",
        articles: [
            {
                title: "The 50/30/20 Budget Rule",
                content: "One of the most popular budgeting frameworks allocates 50% of after-tax income to needs (rent, utilities, groceries), 30% to wants (entertainment, dining out, hobbies), and 20% to savings and debt repayment. This simple rule provides a balanced starting point for anyone new to budgeting. Adjust the percentages to fit your situation, but the key principle remains: prioritize needs, enjoy life, and always pay yourself first through savings.",
            },
            {
                title: "Why Tracking Spending Matters",
                content: "Research shows that people who actively track their spending save significantly more than those who do not. The act of recording expenses creates awareness of spending patterns and reduces impulsive purchases. Studies find that simply monitoring your finances can reduce unnecessary spending by 15-20%. A monthly budget tracker makes this process effortless by showing exactly where your money goes and highlighting areas where you can cut back.",
            },
            {
                title: "Building an Emergency Fund",
                content: "Financial experts recommend saving three to six months of living expenses in an easily accessible emergency fund. Start by including a savings category in your monthly budget, even if you can only set aside a small amount initially. Consistency matters more than the amount. Once you have a buffer for unexpected expenses like car repairs, medical bills, or job loss, you gain financial security and peace of mind that reduces stress and improves decision-making.",
            },
        ],
    },
    faq: {
        sectionTitle: "Frequently Asked Questions",
        items: [
            {
                question: "Where is my budget data stored?",
                answer: "Your budget data is stored exclusively in your browser's local storage. We never send your financial information to any server. This means your data is completely private, but it also means clearing your browser data will erase your budget. Consider exporting your data periodically as a backup.",
            },
            {
                question: "Can I customize the budget categories?",
                answer: "Yes, you can fully customize your budget categories. Add new categories by clicking the 'Add category' button under either the Income or Expenses section. You can also rename any existing category by editing its name field, or remove categories you do not need.",
            },
            {
                question: "What do the colors in the summary mean?",
                answer: "Green values indicate positive results: your actual income met or exceeded your plan, or your actual expenses stayed within budget. Red values indicate areas needing attention: income fell short of the plan, or expenses exceeded the budget. This visual system makes it easy to spot problems at a glance.",
            },
            {
                question: "How do I start a new month?",
                answer: "Use the 'Reset all data' button to clear all actual amounts and start fresh. Your planned amounts and categories will remain as a template. Alternatively, you can manually update the actual amounts to zero for each category while keeping your planned budgets intact.",
            },
            {
                question: "What is the difference between planned and actual amounts?",
                answer: "Planned amounts represent your budget targets set at the beginning of the month. Actual amounts reflect what you truly earned or spent. Comparing the two reveals whether you are on track, under budget, or overspending in each category.",
            },
            {
                question: "Can I use this tracker for a different currency?",
                answer: "Yes, the tracker works with any currency. The amounts you enter are simply numbers, and the summary calculations work the same regardless of currency. Currently, the dollar sign ($) is used for display, but the values represent whatever currency you choose to budget in.",
            },
            {
                question: "How should I handle irregular income?",
                answer: "For irregular income such as freelance work or commissions, estimate a conservative planned amount based on your average earnings over the past few months. Update the actual amount as payments arrive. This approach gives you a realistic baseline while accounting for variability.",
            },
            {
                question: "What is the 'Difference' in the summary?",
                answer: "The Difference shows how your actual balance compares to your planned balance. A positive difference means you performed better than planned (earned more or spent less). A negative difference means you fell short of your budget goals. It provides a single number to gauge your overall monthly financial performance.",
            },
            {
                question: "Should I include savings as an expense?",
                answer: "Yes, treating savings as an expense is a proven budgeting strategy called 'paying yourself first.' By including savings as a planned expense, you prioritize building your financial reserves before discretionary spending. This ensures consistent saving each month, even when other expenses fluctuate.",
            },
            {
                question: "Can I use this tracker on my phone?",
                answer: "Yes, our budget tracker is fully responsive and works perfectly on smartphones, tablets, and desktop computers. Simply open the page in your mobile browser to start tracking your budget instantly with no app download required.",
            },
        ],
    },
    cta: {
        title: "Explore Our Other Financial Tools",
        description: "Manage every aspect of your finances with our free, easy-to-use calculators and trackers.",
    },
};

export default monthlyBudgetTrackerDictionary;
