import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Layout from '../components/Layout';
import { Plane, Bus, Train, Bike, Footprints, Car, AlertCircle, CheckCircle, Sparkles, Zap, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSPORT_OPTIONS = [
    { value: 'bus', label: 'Bus', icon: Bus, xp: '+80 XP' },
    { value: 'train', label: 'Train', icon: Train, xp: '+60 XP' },
    { value: 'bike', label: 'Bike', icon: Bike, xp: '+50 XP' },
    { value: 'car', label: 'Car', icon: Car, xp: '+0 XP' },
    { value: 'flight', label: 'Flight', icon: Plane, xp: '+0 XP' },
    { value: 'foot', label: 'Foot', icon: Footprints, xp: '+150 XP' },
];

const TERRAIN_OPTIONS = [
    { value: 'city', label: '🏙️ City' },
    { value: 'mountain', label: '🏔️ Mountain' },
    { value: 'beach', label: '🏖️ Beach' },
    { value: 'forest', label: '🌲 Forest' },
    { value: 'desert', label: '🏜️ Desert' },
];

const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const LogTrip = () => {
    const [formData, setFormData] = useState({
        destination: '', state: '', transport_mode: 'bus',
        budget: '', solo: false, terrain_type: 'city',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const estimateXP = () => {
        let xp = 50;
        if (formData.solo) xp += 100;
        const transport = formData.transport_mode;
        if (transport === 'bus') xp += 80;
        else if (transport === 'train') xp += 60;
        else if (transport === 'bike') xp += 50;
        else if (transport === 'foot') xp += 150;
        const budget = parseFloat(formData.budget) || 0;
        if (budget > 0 && budget < 3000) xp += 70;
        return { base: xp, potential: xp + 200 };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/trips/', { ...formData, budget: parseFloat(formData.budget) });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError('Failed to log trip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const xpEstimate = estimateXP();

    return (
        <Layout>
            <div className="p-5 md:p-8 max-w-xl mx-auto pb-28 md:pb-8">
                {/* Header */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-[800] text-white tracking-tight">
                        Log New <span className="gradient-text">Conquest</span>
                    </h1>
                    <p className="label-caps text-[10px] mt-2">Record your expedition</p>
                </motion.div>

                {/* Success Overlay */}
                <AnimatePresence>
                    {success && (
                        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-surface-0)]/80 backdrop-blur-sm"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <motion.div className="text-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }}>
                                    <CheckCircle size={72} className="text-emerald-400 mx-auto mb-4" />
                                </motion.div>
                                <h2 className="text-2xl font-[800] text-white mb-2 tracking-tight">Territory Claimed!</h2>
                                <p className="text-amber-400 text-base font-bold">+{xpEstimate.base} XP earned</p>
                                <p className="text-[var(--color-text-muted)] text-xs mt-2">Redirecting to command center...</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <motion.form onSubmit={handleSubmit} className="glass-card p-6 md:p-7 rounded-2xl space-y-5"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>

                    {error && (
                        <motion.div className="bg-red-500/10 border border-red-400/30 text-red-200 p-3.5 rounded-xl flex items-center gap-2 text-sm"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <AlertCircle size={15} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Destination */}
                    <div>
                        <label className="label-caps text-[10px] mb-2 block"><MapPin size={10} className="inline mr-1" />Destination</label>
                        <input type="text" name="destination" value={formData.destination} onChange={handleChange}
                            required placeholder="Where did you conquer?" className="input-field" />
                    </div>

                    {/* State */}
                    <div>
                        <label className="label-caps text-[10px] mb-2 block">State / Territory</label>
                        <select name="state" value={formData.state} onChange={handleChange} required
                            className="input-field appearance-none">
                            <option value="" className="bg-[var(--color-surface-2)]">Select State</option>
                            {STATES.map(s => (<option key={s} value={s} className="bg-[var(--color-surface-2)]">{s}</option>))}
                        </select>
                    </div>

                    {/* Transport */}
                    <div>
                        <label className="label-caps text-[10px] mb-3 block">Transport Mode</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TRANSPORT_OPTIONS.map(({ value, label, icon: Icon, xp }) => (
                                <motion.button key={value} type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, transport_mode: value }))}
                                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${formData.transport_mode === value
                                        ? 'border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] text-amber-400'
                                        : 'border-[var(--color-border-subtle)] bg-white/[0.02] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                                        }`}
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Icon size={18} className="mx-auto mb-1" />
                                    <div className="text-xs font-semibold">{label}</div>
                                    <div className="text-[10px] text-[var(--color-text-muted)]">{xp}</div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Terrain */}
                    <div>
                        <label className="label-caps text-[10px] mb-3 block">Terrain Type</label>
                        <div className="flex flex-wrap gap-2">
                            {TERRAIN_OPTIONS.map(({ value, label }) => (
                                <motion.button key={value} type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, terrain_type: value }))}
                                    className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${formData.terrain_type === value
                                        ? 'border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] text-white'
                                        : 'border-[var(--color-border-subtle)] bg-white/[0.02] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                                        }`}
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    {label}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="label-caps text-[10px] mb-2 block">Budget (INR)</label>
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange}
                            required min="0" placeholder="How much did you spend?" className="input-field" />
                    </div>

                    {/* Solo Toggle */}
                    <motion.div
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${formData.solo
                            ? 'border-[var(--color-border-accent)] bg-[var(--color-accent-glow)]'
                            : 'border-[var(--color-border-subtle)] bg-white/[0.02]'
                            }`}
                        onClick={() => setFormData(prev => ({ ...prev, solo: !prev.solo }))}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" name="solo" checked={formData.solo} onChange={handleChange}
                                className="w-4 h-4 accent-amber-500 rounded" />
                            <div>
                                <p className="text-white font-semibold text-sm">Solo Expedition</p>
                                <p className="text-[var(--color-text-muted)] text-xs">Brave enough to go alone?</p>
                            </div>
                        </div>
                        <span className="text-amber-400 text-sm font-bold">+100 XP</span>
                    </motion.div>

                    {/* XP Estimator */}
                    <div className="bg-[var(--color-accent-glow)] border border-[var(--color-border-accent)] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-amber-400" />
                                <span className="label-caps text-[10px]">Estimated XP</span>
                            </div>
                            <div className="text-right">
                                <span className="text-amber-400 text-xl font-bold font-mono">+{xpEstimate.base}</span>
                                <p className="text-[var(--color-text-disabled)] text-[10px]">Up to +{xpEstimate.potential} with new state</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading}
                        className="btn-primary w-full py-4 rounded-xl text-sm disabled:opacity-50">
                        {loading ? (
                            <span className="animate-pulse">Claiming Territory...</span>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Confirm Conquest
                                <CheckCircle size={16} />
                            </>
                        )}
                    </button>
                </motion.form>
            </div>
        </Layout>
    );
};

export default LogTrip;
