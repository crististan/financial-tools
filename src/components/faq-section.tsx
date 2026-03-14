import FaqItem from '@/components/faq-item';

type FaqSectionProps = {
    title: string;
    items: Array<{
        question: string;
        answer: string;
    }>;
};

export default function FaqSection({ title, items }: FaqSectionProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-8 text-center">{title}</h2>
            <div className="max-w-[800px] mx-auto">
                {items.map((item, index) => (
                    <FaqItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
}
