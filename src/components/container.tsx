export default function Container( { children }: { children: React.ReactNode }) {
    return (
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-[1440px] px-4 md:px-8 mx-auto">
            { children }
        </div>
    )
}