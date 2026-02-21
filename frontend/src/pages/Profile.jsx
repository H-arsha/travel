import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import { AchievementBadge, ACHIEVEMENT_DATA } from '../components/AchievementBadges';
import { User, Zap, Mountain, Flame, MapPin, Award, LogOut, Mail, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';



const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                setUser(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return (
        <div className="flex flex-col gap-3 justify-center items-center h-screen bg-[var(--color-surface-0)]">
            <Loader2 className="animate-spin text-amber-400" size={40} />
            <p className="label-caps text-[10px]">Loading Profile...</p>
        </div>
    );

    const earnedNames = new Set(user?.achievements?.map(a => a.achievement_name) || []);
    const xpInLevel = user?.xp % 1000;
    const xpProgress = (xpInLevel / 1000) * 100;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <Layout>
            <div className="p-5 md:p-8 max-w-2xl mx-auto pb-28 md:pb-8">
                {/* Profile Header */}
                <motion.div className="glass-card p-7 rounded-2xl mb-6 text-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
                        style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.2)' }}>
                        <span className="text-white text-2xl font-[900]">{initials}</span>
                    </div>
                    <h1 className="text-2xl font-[800] text-white tracking-tight mb-1">{user?.name}</h1>
                    <div className="flex items-center justify-center gap-2">
                        <Mail size={12} className="text-[var(--color-text-muted)]" />
                        <span className="text-[var(--color-text-secondary)] text-sm">{user?.email}</span>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { icon: Mountain, label: 'Level', value: user?.level },
                        { icon: Zap, label: 'XP', value: user?.xp?.toLocaleString() },
                        { icon: Flame, label: 'Streak', value: `${user?.current_streak}d` },
                        { icon: MapPin, label: 'States', value: `${user?.unlocked_states?.length || 0}/28` },
                    ].map(({ icon: Icon, label, value }, i) => (
                        <motion.div key={label} className="glass-card p-4 rounded-xl text-center"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-muted)] flex items-center justify-center mx-auto mb-2.5 border border-[var(--color-border-accent)]">
                                <Icon size={14} className="text-amber-400" />
                            </div>
                            <p className="text-xl font-bold text-white">{value}</p>
                            <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider font-semibold mt-0.5">{label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* XP Progress */}
                <motion.div className="glass-card p-5 rounded-2xl mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="label-caps text-[10px]">Level {user?.level} Progress</span>
                        <span className="text-amber-400 text-xs font-bold font-mono">{xpInLevel} / 1000</span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                            style={{ boxShadow: '0 0 12px rgba(245, 158, 11, 0.3)' }}
                            initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }} />
                    </div>
                </motion.div>

                {/* Conquered States */}
                {user?.unlocked_states?.length > 0 && (
                    <motion.div className="glass-card p-5 rounded-2xl mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin size={14} className="text-amber-400" />
                            <span className="label-caps text-[10px]">Conquered Territories</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user.unlocked_states.map((state, i) => (
                                <span key={state.state_name}
                                    className="px-3 py-1.5 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-border-accent)] text-white text-xs font-medium">
                                    {state.state_name}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* All Achievements */}
                <motion.div className="glass-card p-5 rounded-2xl mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <div className="flex items-center gap-2 mb-4">
                        <Award size={14} className="text-amber-400" />
                        <span className="label-caps text-[10px]">All Achievements</span>
                        <span className="text-[var(--color-text-disabled)] text-[10px] ml-auto">{earnedNames.size}/{ACHIEVEMENT_DATA.length}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {ACHIEVEMENT_DATA.map((a) => {
                            const earned = earnedNames.has(a.name);
                            return (
                                <div key={a.name}
                                    className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3 ${earned
                                        ? 'bg-[var(--color-accent-glow)] border-[var(--color-border-accent)]'
                                        : 'bg-white/[0.01] border-[var(--color-border-subtle)]'
                                        }`}>
                                    <AchievementBadge name={a.name} earned={earned} size={44} />
                                    <div>
                                        <p className={`text-xs font-semibold ${earned ? 'text-white' : 'text-[var(--color-text-muted)]'}`}>{a.name}</p>
                                        <p className="text-[var(--color-text-muted)] text-[10px] mt-0.5">{a.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Logout */}
                <motion.button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-500/20 bg-red-500/[0.04] text-red-400 text-sm font-semibold hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-200"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <LogOut size={16} />
                    Sign Out
                </motion.button>
            </div>
        </Layout>
    );
};

export default Profile;
