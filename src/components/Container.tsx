export default function Container( { children }: { children: React.ReactNode }) {
    return (
        <div className="w-full max-w-md md:max-w-3xl lg:max-w-7xl p-4 mx-auto">
            { children }
        </div>
    )
}