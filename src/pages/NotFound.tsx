export default function NotFound() {
    return (
        <main className="w-full min-h-screen bg-slate-50 text-slate-950 antialiased">
            <section className="flex min-h-screen w-full flex-col items-start justify-start px-6 py-12">
                <h1 className="mb-4 text-4xl font-semibold tracking-tight">404 - Not Found</h1>
                <p className="max-w-xl text-lg leading-8 text-slate-700">
                    The page you are looking for does not exist.
                </p>
            </section>
        </main>
    );
}