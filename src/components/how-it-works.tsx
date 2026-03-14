import { Keyboard, ArrowLeftRight, Zap, DollarSign, BarChart3, PiggyBank, ListChecks, Target, TrendingUp } from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    keyboard: Keyboard,
    arrowLeftRight: ArrowLeftRight,
    zap: Zap,
    dollarSign: DollarSign,
    barChart3: BarChart3,
    piggyBank: PiggyBank,
    listChecks: ListChecks,
    target: Target,
    trendingUp: TrendingUp,
};

type Step = {
    number: number;
    icon?: string;
    title: string;
    description: string;
};

type HowItWorksProps = {
    sectionTitle: string;
    steps: Step[];
};

export default function HowItWorks({ sectionTitle, steps }: HowItWorksProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-12 text-center">{sectionTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step) => {
                    return (
                        <div key={step.number} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full border-2 border-[var(--clr-green-500)] flex items-center justify-center mb-6 relative">
                                <span className="text-[var(--clr-green-500)] text-xl font-medium">{String(step.number).padStart(2, '0')}</span>
                            </div>
                            <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                            <p className="text-[var(--clr-neutral-100)] text-sm leading-relaxed max-w-[280px]">{step.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
