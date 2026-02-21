import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-[var(--color-surface-0)]">
            {/* Subtle ambient glow — deep, not distracting */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/[0.015] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-500/[0.01] rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10 md:pt-16 pb-20 md:pb-0">
                {children}
            </div>
            <Navbar />
        </div>
    );
};

export default Layout;
