import FaqItem from './faq-item';

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
            <h2 className="text-2xl md:text-4xl font-medium mb-8">{title}</h2>
            <div className="max-w-[800px]">
                {items.map((item, index) => (
                    <FaqItem key={index} question={item.question} answer={item.answer} />
                ))}
            </div>
        </div>
    );
}
