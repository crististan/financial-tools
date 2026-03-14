import { BarChart3, LayoutList, Save, ArrowLeftRight, Table, RefreshCw, Globe, BadgeDollarSign, UserX, Shield, Clock, Calculator, Wallet, TrendingUp, Zap } from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    refreshCw: RefreshCw,
    globe: Globe,
    badgeDollarSign: BadgeDollarSign,
    userX: UserX,
    shield: Shield,
    clock: Clock,
    calculator: Calculator,
    wallet: Wallet,
    trendingUp: TrendingUp,
    zap: Zap,
    table: Table,
    arrowLeftRight: ArrowLeftRight,
    save: Save,
    layoutList: LayoutList,
    barChart3: BarChart3
};

type FeatureItem = {
    icon: string;
    title: string;
    description: string;
};

type FeatureCardsProps = {
    sectionTitle: string;
    sectionDescription?: string;
    items: FeatureItem[];
};

export default function FeatureCards({ sectionTitle, sectionDescription, items }: FeatureCardsProps) {
    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-medium mb-4">{sectionTitle}</h2>
                {sectionDescription && (
                    <p className="text-[var(--clr-neutral-100)] max-w-[600px] mx-auto">{sectionDescription}</p>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, index) => {
                    const Icon = iconMap[item.icon];
                    return (
                        <div
                            key={index}
                            className="bg-[var(--clr-neutral-900)] rounded-2xl p-6 flex flex-col gap-4"
                        >
                            {Icon && (
                                <Icon className="size-8 text-[var(--clr-green-500)]" />
                            )}
                            <h3 className="text-base font-medium">{item.title}</h3>
                            <p className="text-[var(--clr-neutral-100)] text-sm leading-relaxed">{item.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
