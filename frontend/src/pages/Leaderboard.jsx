import { useState, useEffect } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import { Trophy, Medal, User, Crown, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RANK_COLORS = [
    { bg: 'from-amber-500/20 to-yellow-600/10', border: 'border-amber-400/30', text: 'text-amber-400', icon: Crown, label: '1st' },
    { bg: 'from-slate-300/15 to-slate-400/5', border: 'border-slate-300/30', text: 'text-slate-300', icon: Medal, label: '2nd' },
    { bg: 'from-orange-700/15 to-amber-800/5', border: 'border-orange-600/30', text: 'text-orange-400', icon: Medal, label: '3rd' },
];

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaderboard, me] = await Promise.all([
                    api.get('/users/leaderboard'),
                    api.get('/users/me')
                ]);
                setUsers(leaderboard.data);
                setCurrentUserId(me.data.id);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col gap-3 justify-center items-center h-screen bg-[var(--color-surface-0)]">
            <Loader2 className="animate-spin text-amber-400" size={40} />
            <p className="label-caps text-[10px]">Loading Rankings...</p>
        </div>
    );

    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <Layout>
            <div className="p-5 md:p-8 max-w-3xl mx-auto pb-28 md:pb-8">
                {/* Header */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-[800] text-white tracking-tight">
                        <span className="gradient-text">Leaderboard</span>
                    </h1>
                    <p className="label-caps text-[10px] mt-2">Top Conquerors of India</p>
                </motion.div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {top3.map((user, i) => {
                        const rank = RANK_COLORS[i];
                        const RankIcon = rank.icon;
                        return (
                            <motion.div key={user.id}
                                className={`relative p-4 rounded-2xl bg-gradient-to-b ${rank.bg} border ${rank.border} text-center overflow-hidden`}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}>
                                <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center text-lg font-bold bg-white/[0.08] border ${rank.border}`}>
                                    {user.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <RankIcon size={16} className={`${rank.text} mx-auto mb-1.5`} />
                                <p className="text-white font-bold text-sm truncate">{user.name}</p>
                                <div className={`${rank.text} text-xs font-bold font-mono mt-2`}>{user.xp?.toLocaleString()} XP</div>
                                <div className="text-[var(--color-text-muted)] text-[10px] mt-1">Lv. {user.level}</div>
                                {user.id === currentUserId && (
                                    <div className="mt-2.5 text-[9px] text-amber-400 font-bold uppercase tracking-widest bg-[var(--color-accent-glow)] rounded-md py-1">
                                        You
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Rest of leaderboard */}
                <div className="glass-card rounded-2xl overflow-hidden">
                    {rest.map((user, i) => (
                        <motion.div key={user.id}
                            className={`flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border-subtle)] last:border-b-0 transition-all duration-200 ${user.id === currentUserId ? 'bg-[var(--color-accent-glow)]' : 'hover:bg-white/[0.02]'
                                }`}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.03 }}>
                            <div className="flex items-center gap-3">
                                <span className="w-6 text-center text-[var(--color-text-muted)] text-sm font-bold font-mono">{i + 4}</span>
                                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-[var(--color-border-subtle)] flex items-center justify-center text-xs font-bold text-white">
                                    {user.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{user.name}</p>
                                    <p className="text-[var(--color-text-muted)] text-[10px]">Level {user.level}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-amber-400 text-sm font-bold font-mono">{user.xp?.toLocaleString()}</p>
                                <p className="text-[var(--color-text-disabled)] text-[10px]">XP</p>
                            </div>
                        </motion.div>
                    ))}
                    {rest.length === 0 && (
                        <div className="py-12 text-center">
                            <Trophy size={32} className="text-[var(--color-text-disabled)] mx-auto mb-3" />
                            <p className="text-[var(--color-text-muted)] text-sm">More explorers needed!</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Leaderboard;
