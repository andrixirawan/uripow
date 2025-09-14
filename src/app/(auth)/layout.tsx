export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="w-full max-w-sm animate-in fade-in-0 duration-500">
        {children}
      </div>
    </section>
  );
}
