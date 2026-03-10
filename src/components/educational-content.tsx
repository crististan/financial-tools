type Article = {
    title: string;
    content: string;
};

type EducationalContentProps = {
    sectionTitle: string;
    articles: Article[];
};

export default function EducationalContent({ sectionTitle, articles }: EducationalContentProps) {
    return (
        <div>
            <h2 className="text-2xl md:text-4xl font-medium mb-10">{sectionTitle}</h2>
            <div className="max-w-[800px] space-y-8">
                {articles.map((article, index) => (
                    <article
                        key={index}
                        className="border-l-2 border-[var(--clr-green-500)] pl-6"
                    >
                        <h3 className="text-lg font-medium mb-3">{article.title}</h3>
                        <p className="text-[var(--clr-neutral-100)] text-sm md:text-base leading-relaxed">{article.content}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
