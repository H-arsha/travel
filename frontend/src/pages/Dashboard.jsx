import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import MapComponent from '../components/Map';
import { AchievementBadge } from '../components/AchievementBadges';
import { Loader2, Flame, MapPin, Zap, Mountain, Award, ArrowRight, Calendar, Trophy, Settings, Bell, Search, Target, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/* ── Circular Progress Ring ── */
const XPRing = ({ progress, xp, level }) => {
    const size = 140;
    const stroke = 8;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                {/* Track */}
                <circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
                {/* Progress */}
                <motion.circle cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="url(#xpGradient)" strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
                <defs>
                    <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">XP</span>
                <span className="text-white text-2xl font-[900] tracking-tight">{xp?.toLocaleString()}</span>
            </div>
        </div>
    );
};

/* ── Small Stat Chip ── */
const StatChip = ({ icon: Icon, label, value, color = 'amber' }) => (
    <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl bg-${color}-400/10 border border-${color}-400/20 flex items-center justify-center shrink-0`}>
            <Icon size={16} className={`text-${color}-400`} />
        </div>
        <div>
            <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider font-semibold">{label}</p>
            <p className="text-white text-base font-bold tracking-tight">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, tripsRes] = await Promise.all([
                    api.get('/users/me'),
                    api.get('/trips/me')
                ]);
                setUser(userRes.data);
                setTrips(tripsRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-3 justify-center items-center h-screen bg-[var(--color-surface-0)]">
            <Loader2 className="animate-spin text-amber-400" size={40} />
            <p className="label-caps text-[10px]">Loading Command Center...</p>
        </div>
    );

    const xpInLevel = user?.xp % 1000;
    const xpProgress = (xpInLevel / 1000) * 100;
    const statesConquered = user?.unlocked_states?.length || 0;

    return (
        <Layout>
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto pb-28 md:pb-8">

                {/* ── TOP BAR ── */}
                <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
                                <Mountain size={12} className="text-amber-400" />
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Premium</span>
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-[900] text-white tracking-tight">Conquest India</h1>
                        <p className="text-[var(--color-text-muted)] text-xs mt-0.5">Premium Dominance Energy</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-border-hover)] transition-all duration-200">
                            <Settings size={16} />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-white/[0.04] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:border-[var(--color-border-hover)] transition-all duration-200 relative">
                            <Bell size={16} />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500" />
                        </button>
                    </div>
                </motion.div>

                {/* ── MAIN GRID: Two Column ── */}
                <div className="grid lg:grid-cols-[1fr_1fr] gap-4 md:gap-5">

                    {/* ▸ LEFT COLUMN ▸ */}
                    <div className="space-y-4 md:space-y-5">

                        {/* XP Ring + Profile + Stats */}
                        <motion.div className="grid grid-cols-[auto_1fr] gap-4 md:gap-5"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

                            {/* XP Ring Card */}
                            <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center">
                                <XPRing progress={xpProgress} xp={user?.xp} level={user?.level} />
                                <div className="mt-4 text-center">
                                    <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider font-semibold">Performance Rating</p>
                                    <p className="text-white text-sm font-bold mt-0.5">Elite Explorer</p>
                                    <p className="text-[var(--color-text-disabled)] text-[10px] mt-0.5">Level {user?.level}</p>
                                </div>
                            </div>

                            {/* Dominance Map Card */}
                            <div className="glass-card rounded-2xl overflow-hidden relative min-h-[260px]">
                                <div className="absolute top-3 left-4 z-[1000] flex items-center gap-2 pointer-events-none">
                                    <MapPin size={14} className="text-amber-400" />
                                    <span className="text-white text-sm font-bold">Dominance</span>
                                </div>
                                <MapComponent />
                            </div>
                        </motion.div>

                        {/* State Domination Card */}
                        <motion.div className="glass-card p-5 rounded-2xl"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Target size={14} className="text-amber-400" />
                                    <span className="text-white text-sm font-bold">State Domination</span>
                                </div>
                                <span className="text-amber-400 text-sm font-bold font-mono">{statesConquered}/28</span>
                            </div>
                            {/* Progress bars */}
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[var(--color-text-secondary)] text-xs">Conquered</span>
                                        <span className="text-amber-400 text-xs font-bold">{statesConquered}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(statesConquered / 28) * 100}%` }}
                                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[var(--color-text-secondary)] text-xs">Remaining</span>
                                        <span className="text-[var(--color-text-muted)] text-xs font-bold">{28 - statesConquered}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <div className="h-full bg-white/10 rounded-full" style={{ width: `${((28 - statesConquered) / 28) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                            {/* Conquered state tags */}
                            {user?.unlocked_states?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                                    {user.unlocked_states.map((s) => (
                                        <span key={s.state_name} className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-semibold">
                                            {s.state_name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* LOG NEW CONQUEST Button */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Link to="/log-trip">
                                <motion.button
                                    className="btn-primary w-full py-4 rounded-xl text-sm tracking-[0.15em]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Target size={18} />
                                    LOG NEW CONQUEST
                                    <ArrowRight size={16} />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* ▸ RIGHT COLUMN ▸ */}
                    <div className="space-y-4 md:space-y-5">

                        {/* Performance Control Header */}
                        <motion.div className="glass-card p-5 rounded-2xl"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <h2 className="text-white text-lg font-[800] tracking-tight mb-1">
                                Welcome, <span className="gradient-text">{user?.name}</span>
                            </h2>
                            <p className="text-[var(--color-text-muted)] text-xs mb-5">Performance Control · Active Operations</p>
                            <div className="grid grid-cols-2 gap-4">
                                <StatChip icon={Flame} label="Current Streak" value={`${user?.current_streak} days`} color="orange" />
                                <StatChip icon={Zap} label="Total XP" value={user?.xp?.toLocaleString()} color="amber" />
                            </div>
                        </motion.div>

                        {/* Leaderboard Preview */}
                        <motion.div className="glass-card p-5 rounded-2xl"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Trophy size={14} className="text-amber-400" />
                                    <span className="text-white text-sm font-bold">Leaderboard Preview</span>
                                </div>
                                <Link to="/leaderboard" className="flex items-center gap-1 text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors">
                                    View All <ChevronRight size={13} />
                                </Link>
                            </div>
                            {/* XP bar visualization */}
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-3">
                                    <span className="text-amber-400 text-xs font-bold w-5">1st</span>
                                    <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '100%' }} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-300 text-xs font-bold w-5">2nd</span>
                                    <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full" style={{ width: '72%' }} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-orange-400 text-xs font-bold w-5">3rd</span>
                                    <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-600 to-amber-700 rounded-full" style={{ width: '55%' }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Competitions / Unlocked Locations */}
                        <motion.div className="glass-card rounded-2xl overflow-hidden relative"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            {/* Map background */}
                            <div className="h-52 md:h-60 relative">
                                <MapComponent />
                                {/* Overlay content */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-2)] via-transparent to-transparent" />
                                <div className="absolute top-4 left-5">
                                    <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider font-semibold">Competitions</p>
                                    <p className="text-white text-3xl font-[900] tracking-tight mt-1">{statesConquered}<span className="text-[var(--color-text-muted)] text-lg">/28</span></p>
                                    <p className="text-[var(--color-text-secondary)] text-xs mt-0.5">Unlocked Locations</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Achievements Row */}
                        {user?.achievements?.length > 0 && (
                            <motion.div className="glass-card p-5 rounded-2xl"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-amber-400" />
                                        <span className="text-white text-sm font-bold">Achievements</span>
                                    </div>
                                    <span className="text-[var(--color-text-disabled)] text-xs">{user.achievements.length} earned</span>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {user.achievements.map((a, i) => (
                                        <motion.div key={a.id}
                                            className="flex items-center gap-2 bg-[var(--color-accent-glow)] border border-[var(--color-border-accent)] rounded-xl px-3 py-2"
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + i * 0.06 }}>
                                            <AchievementBadge name={a.achievement_name} earned={true} size={32} />
                                            <span className="text-white text-[11px] font-semibold">{a.achievement_name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Recent Trips */}
                        <motion.div className="glass-card p-5 rounded-2xl"
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-amber-400" />
                                    <span className="text-white text-sm font-bold">Smooth Travels</span>
                                </div>
                                <span className="text-[var(--color-text-disabled)] text-xs">{trips.length} total</span>
                            </div>
                            {trips.length === 0 ? (
                                <div className="text-center py-8">
                                    <Mountain size={32} className="text-[var(--color-text-disabled)] mx-auto mb-3" />
                                    <p className="text-[var(--color-text-muted)] text-sm">No conquests yet</p>
                                    <Link to="/log-trip" className="inline-flex items-center gap-2 mt-3 text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors">
                                        Log Your First Trip <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {trips.slice(0, 8).map((trip, i) => (
                                        <motion.div key={trip.id}
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-accent)] transition-all duration-200"
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.04 }}>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                                                    <MapPin size={14} className="text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-xs">{trip.destination}</p>
                                                    <p className="text-[var(--color-text-muted)] text-[10px]">{trip.state}</p>
                                                </div>
                                            </div>
                                            <p className="text-amber-400 text-xs font-bold font-mono">₹{trip.budget?.toLocaleString()}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
