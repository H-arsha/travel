import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, Trophy, PlusCircle, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { to: '/dashboard', icon: Map, label: 'Explore' },
    { to: '/leaderboard', icon: Trophy, label: 'Rank' },
    { to: '/profile', icon: User, label: 'Me' },
];

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 w-full md:top-0 md:bottom-auto z-50">
            <div className="backdrop-blur-2xl bg-[var(--color-surface-0)]/80 border-t md:border-b md:border-t-0 border-[var(--color-border-subtle)] px-4 py-2.5 md:py-3">
                <div className="max-w-4xl mx-auto flex justify-around items-center">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} className="relative flex flex-col items-center group">
                            <motion.div
                                className={`p-2.5 rounded-xl transition-all duration-200 ${isActive(to)
                                    ? 'text-amber-400 bg-[var(--color-accent-muted)]'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.03]'
                                    }`}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon size={20} strokeWidth={isActive(to) ? 2.5 : 1.8} />
                            </motion.div>
                            <span className={`text-[9px] mt-0.5 font-semibold tracking-[0.15em] uppercase ${isActive(to) ? 'text-amber-400' : 'text-[var(--color-text-disabled)]'
                                }`}>
                                {label}
                            </span>
                            {isActive(to) && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-2.5 w-7 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* Central Action */}
                    <Link to="/log-trip" className="relative -mt-3">
                        <motion.div
                            className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl"
                            style={{ boxShadow: '0 4px 20px rgba(245, 158, 11, 0.25)' }}
                            whileHover={{ scale: 1.12, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <PlusCircle size={24} className="text-white" strokeWidth={2.5} />
                        </motion.div>
                    </Link>

                    {/* Logout */}
                    <button onClick={handleLogout} className="flex flex-col items-center group">
                        <motion.div
                            className="p-2.5 rounded-xl text-[var(--color-text-disabled)] hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <LogOut size={20} strokeWidth={1.8} />
                        </motion.div>
                        <span className="text-[9px] mt-0.5 font-semibold tracking-[0.15em] uppercase text-[var(--color-text-disabled)] group-hover:text-red-400 transition-colors">
                            Exit
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
