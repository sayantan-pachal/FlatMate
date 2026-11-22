export default function AppBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F7F8FA] transition-colors duration-300 dark:bg-[#070A0F]"
        >
            {/* Light Theme: Soft Off-White with Subtle Top Wash */}
            <div
                className="absolute inset-0 opacity-100 transition-opacity duration-300 dark:opacity-0"
                style={{
                    background:
                        'radial-gradient(120% 60% at 50% 0%, rgba(20, 184, 166, 0.08) 0%, rgba(247, 248, 250, 0) 70%)',
                }}
            />
            <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 dark:opacity-100"
                style={{
                    background:
                        'radial-gradient(120% 55% at 50% 0%, rgba(20, 184, 166, 0.14) 0%, rgba(15, 23, 42, 0.25) 45%, rgba(7, 10, 15, 0) 80%)',
                }}
            />
        </div>
    );
}