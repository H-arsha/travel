import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mountain, UserPlus, Mail, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { background: 'rgba(255,220,150,0.04)', border: '1px solid rgba(245,158,11,0.12)' };
    const focusStyle = { border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(255,220,150,0.07)' };
    const blurStyle = { ...inputStyle };
    const inputClass = "w-full py-3.5 pl-11 pr-4 rounded-xl text-white text-[14px] placeholder:text-amber-100/15 focus:outline-none transition-all duration-200";
    const labelClass = "text-[10px] font-bold tracking-[0.2em] uppercase text-amber-200/30 mb-1.5 block";

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* Static mountain background */}
            <div className="absolute inset-0">
                <img
                    src="/assets/mountains/ezgif-frame-001.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e04]/95 via-[#1a0e04]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a08]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[rgba(10,6,3,0.35)]" />
            </div>

            {/* Centered card */}
            <motion.div
                className="relative z-10 w-full max-w-[400px] mx-4"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Brand header */}
                <motion.div className="text-center mb-7" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-black/30 backdrop-blur-sm border border-amber-300/20 flex items-center justify-center">
                            <Mountain size={17} className="text-amber-300" />
                        </div>
                        <span className="text-amber-200/60 text-[10px] font-bold tracking-[0.3em] uppercase">Conquest India</span>
                    </div>
                    <h1 className="text-[2.6rem] font-[900] text-white tracking-[-0.03em] leading-none drop-shadow-lg">
                        Join The Conquest
                    </h1>
                    <p className="text-amber-200/50 text-sm mt-2 tracking-wide font-medium">
                        Become an India Explorer.
                    </p>
                </motion.div>

                {/* Glass card */}
                <motion.div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, rgba(26,14,4,0.82), rgba(18,10,4,0.88))',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(245,158,11,0.12)',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,158,11,0.08)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="p-8">
                        <AnimatePresence>
                            {error && (
                                <motion.div className="bg-red-900/30 border border-red-400/20 text-red-200 px-4 py-3 rounded-xl mb-5 text-[13px] text-center"
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Explorer Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/20" />
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className={inputClass} style={inputStyle}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/20" />
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" className={inputClass} style={inputStyle}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Password</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-200/20" />
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password" className={inputClass} style={inputStyle}
                                        onFocus={e => Object.assign(e.target.style, focusStyle)} onBlur={e => Object.assign(e.target.style, blurStyle)} />
                                </div>
                            </div>

                            <motion.button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2.5 py-4 mt-2 rounded-xl font-bold text-[13px] tracking-[0.1em] uppercase text-white disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', boxShadow: '0 4px 24px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                                whileHover={{ scale: 1.02, boxShadow: '0 6px 32px rgba(245,158,11,0.45)' }}
                                whileTap={{ scale: 0.98 }}>
                                {loading
                                    ? <span className="animate-pulse normal-case tracking-normal">Creating Legend...</span>
                                    : <><UserPlus size={16} />Begin Your Journey</>}
                            </motion.button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-amber-400/[0.08] text-center">
                            <Link to="/login" className="text-amber-200/30 hover:text-amber-300 transition-colors text-sm">
                                Already an explorer?{' '}
                                <span className="font-semibold text-amber-400 hover:text-amber-300">Login →</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <motion.p className="text-center text-amber-100/15 text-[11px] italic mt-6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    "Travel makes one modest — you see what a tiny place you occupy in the world."
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Register;
