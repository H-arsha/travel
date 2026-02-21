import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, Zap, MapPin, Trophy, Flame, ArrowRight, Sparkles, ChevronDown, Shield, Users, Target } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ───── Scroll-linked Hero with Frame Animation ───── */
const TOTAL_FRAMES = 40;

const ScrollHero = () => {
    const containerRef = useRef(null);
    const [currentFrame, setCurrentFrame] = useState(1);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (v) => {
            const frame = Math.min(TOTAL_FRAMES, Math.max(1, Math.ceil(v * TOTAL_FRAMES)));
            setCurrentFrame(frame);
        });
        return unsubscribe;
    }, [scrollYProgress]);

    const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1, 0]);

    const frameNumber = String(currentFrame).padStart(3, '0');

    return (
        <div ref={containerRef} className="relative h-[200vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Mountain Background */}
                <motion.div
                    className="absolute inset-0 bg-cover bg-center will-change-transform"
                    style={{
                        backgroundImage: `url(/assets/mountains/ezgif-frame-${frameNumber}.jpg)`,
                        opacity,
                        scale,
                    }}
                />
                {/* Cinematic overlays — layered for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-0)]/60 via-transparent to-[var(--color-surface-0)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-0)]/30 via-transparent to-[var(--color-surface-0)]/30" />

                {/* Hero Content */}
                <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
                    style={{ y: textY, opacity: textOpacity }}
                >
                    {/* Eyebrow badge */}
                    <motion.div
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-glow)] backdrop-blur-md mb-10"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <Sparkles size={13} className="text-amber-400" />
                        <span className="label-accent text-[10px]">India's #1 Travel Conquest Platform</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        className="text-[clamp(2.5rem,6vw,5.5rem)] font-[900] leading-[0.92] mb-8 max-w-5xl tracking-tight"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.7 }}
                    >
                        <span className="text-white drop-shadow-[0_2px_40px_rgba(0,0,0,0.5)]">India Has 28 States.</span>
                        <br />
                        <span className="gradient-text">
                            How Many Have You Conquered?
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-xl mb-12 leading-relaxed font-normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        Every trip earns XP. Every state is territory. Track your conquests,
                        climb the leaderboard, and become a <span className="text-amber-400 font-semibold">legendary Indian explorer</span>.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <a href="/register">
                            <button className="btn-primary text-sm px-8 py-4 rounded-xl">
                                <Target size={16} />
                                Begin Your Conquest
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </a>
                        <a href="/login">
                            <button className="btn-secondary text-sm px-8 py-4 rounded-xl">
                                Resume Expedition →
                            </button>
                        </a>
                    </motion.div>

                    {/* Social proof strip */}
                    <motion.div
                        className="mt-16 flex items-center gap-6 md:gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        {[
                            { icon: Users, text: "1,200+ Explorers" },
                            { icon: MapPin, text: "28 States" },
                            { icon: Zap, text: "XP Every Trip" },
                        ].map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Icon size={13} className="text-amber-400/50" />
                                <span className="text-[var(--color-text-muted)] text-xs font-medium">{text}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                    <span className="text-[var(--color-text-disabled)] text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                    <ChevronDown size={18} className="text-[var(--color-text-disabled)]" />
                </motion.div>
            </div>
        </div>
    );
};

/* ───── Feature Card ───── */
const FeatureCard = ({ icon: Icon, title, description, index }) => (
    <motion.div
        className="glass-card-glow p-8 rounded-2xl relative overflow-hidden group"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: index * 0.12, duration: 0.5 }}
    >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-muted)] flex items-center justify-center mb-6 border border-[var(--color-border-accent)]">
            <Icon size={22} className="text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{description}</p>
    </motion.div>
);

/* ───── Testimonial Card ───── */
const TestimonialCard = ({ quote, name, role, index }) => (
    <motion.div
        className="glass-card p-7 rounded-2xl flex flex-col justify-between"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
    >
        {/* Quote mark */}
        <div>
            <div className="text-amber-400/40 text-4xl font-serif leading-none mb-4">"</div>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">{quote}</p>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
                <p className="text-white text-sm font-semibold leading-tight">{name}</p>
                <p className="text-[var(--color-text-muted)] text-xs">{role}</p>
            </div>
        </div>
    </motion.div>
);

/* ───── Step Card ───── */
const StepCard = ({ number, title, description, index, isLast }) => (
    <motion.div
        className="flex gap-5"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, duration: 0.5 }}
    >
        <div className="shrink-0 flex flex-col items-center">
            <div className="w-11 h-11 rounded-xl bg-[var(--color-accent-muted)] border border-[var(--color-border-accent)] flex items-center justify-center">
                <span className="text-amber-400 font-bold text-base">{number}</span>
            </div>
            {!isLast && <div className="w-px flex-1 bg-[var(--color-border-subtle)] mt-3" />}
        </div>
        <div className="pb-10">
            <h4 className="text-white font-bold text-base mb-1.5 tracking-tight">{title}</h4>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{description}</p>
        </div>
    </motion.div>
);

/* ───── LANDING PAGE ───── */
const Landing = () => {
    return (
        <div className="bg-[var(--color-surface-0)] min-h-screen">

            {/* ── Sticky Nav ── */}
            <nav className="fixed top-0 w-full z-50">
                <div className="backdrop-blur-2xl bg-[var(--color-surface-0)]/80 border-b border-[var(--color-border-subtle)]">
                    <div className="section-container flex items-center justify-between h-16">
                        <div className="flex items-center gap-2.5">
                            <Mountain size={22} className="text-amber-400" />
                            <span className="text-white font-bold text-[15px] tracking-wide">CONQUEST <span className="text-amber-400">INDIA</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <a href="/login">
                                <button className="px-5 py-2 text-[var(--color-text-secondary)] hover:text-white text-sm font-medium transition-colors duration-200">
                                    Login
                                </button>
                            </a>
                            <a href="/register">
                                <button className="btn-primary text-xs px-5 py-2.5 rounded-lg">
                                    Start Free
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── SECTION 1: Scroll-Linked Hero ── */}
            <ScrollHero />

            {/* ── SECTION 2: Features ── */}
            <section className="py-28 section-divider">
                <div className="section-container">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="label-accent text-[10px]">Why Conquerors Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-[800] text-white mt-4 tracking-tight">
                            Not a Travel App. <span className="gradient-text">A Conquest Platform.</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-5">
                        <FeatureCard icon={Zap} title="Earn XP Every Trip" description="Solo expeditions, budget travel, and challenging transport all earn bonus XP. Every journey makes you stronger." index={0} />
                        <FeatureCard icon={MapPin} title="Conquer All 28 States" description="Watch your territory expand across India's map. Each new state you visit lights up in gold on your conquest map." index={1} />
                        <FeatureCard icon={Trophy} title="Climb the Leaderboard" description="Compete against other explorers. Earn achievement badges. Build your travel legacy and dominate the rankings." index={2} />
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: Social Proof ── */}
            <section className="py-28 section-divider">
                <div className="section-container">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="label-accent text-[10px]">Explorer Stories</span>
                        <h2 className="text-3xl md:text-4xl font-[800] text-white mt-4 tracking-tight">Trusted by India's Bravest Travelers</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-5">
                        <TestimonialCard quote="I've traveled to 14 states and never tracked a single trip. Conquest India turned my past trips into XP and now I'm addicted to filling my map." name="Arjun Mehta" role="Solo Explorer · Level 8" index={0} />
                        <TestimonialCard quote="The leaderboard creates this healthy obsession. When I saw my friend had more states than me, I immediately booked a train to Rajasthan." name="Priya Sharma" role="Weekend Warrior · 9 States" index={1} />
                        <TestimonialCard quote="As someone who travels on a tight budget, the fact that budget travel earns MORE XP here is brilliant. Finally, backpackers are rewarded." name="Karthik Reddy" role="Budget Master · Level 5" index={2} />
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: How It Works ── */}
            <section className="py-28 section-divider">
                <div className="section-container">
                    <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-start">
                        <motion.div
                            className="md:sticky md:top-32"
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="label-accent text-[10px]">How It Works</span>
                            <h2 className="text-3xl md:text-4xl font-[800] text-white mt-4 mb-5 tracking-tight">
                                From Tourist to <span className="gradient-text">Conqueror</span> in 4 Steps
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-sm">
                                Stop just visiting places. Start dominating territory. Every journey you take becomes part of your legend.
                            </p>
                        </motion.div>

                        <div>
                            <StepCard number="1" title="Create Your Explorer Profile" description="Sign up in 30 seconds. Your conquest journey starts with a clean slate — Level 1, zero territory." index={0} />
                            <StepCard number="2" title="Log Every Expedition" description="Record your destination, transport, budget, and terrain. Solo trips earn bonus XP. Budget travel is rewarded." index={1} />
                            <StepCard number="3" title="Watch Your Map Light Up" description="Each new state turns gold on your conquest map. Track your progress toward dominating all 28 states." index={2} />
                            <StepCard number="4" title="Climb, Compete, Conquer" description="Earn achievement badges, maintain your streak, and rise through the leaderboard. Your travel legacy is permanent." index={3} isLast />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: Final CTA ── */}
            <section className="relative py-36 overflow-hidden section-divider">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

                <div className="relative section-container text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] border border-[var(--color-border-accent)] flex items-center justify-center mx-auto mb-8 pulse-glow">
                            <Mountain size={28} className="text-amber-400" />
                        </div>

                        <h2 className="text-4xl md:text-5xl font-[900] text-white mb-6 leading-[1.05] tracking-tight">
                            Your Travel Resume
                            <br />
                            <span className="gradient-text">Is Empty. Fill It.</span>
                        </h2>

                        <p className="text-[var(--color-text-secondary)] text-base mb-12 max-w-md mx-auto leading-relaxed">
                            Every day you don't track is a conquest lost. Join 1,200+ explorers turning their journeys into legendary stories.
                        </p>

                        <a href="/register">
                            <button className="btn-primary text-sm px-10 py-4 rounded-xl mx-auto">
                                <Sparkles size={16} />
                                Start Your Conquest — Free
                                <ArrowRight size={16} />
                            </button>
                        </a>

                        <p className="text-[var(--color-text-disabled)] text-[11px] mt-8 uppercase tracking-[0.15em]">No credit card · Free forever · 30-second signup</p>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="section-divider py-8">
                <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Mountain size={16} className="text-amber-400/50" />
                        <span className="text-[var(--color-text-muted)] text-xs font-semibold tracking-wide">CONQUEST INDIA</span>
                    </div>
                    <p className="text-[var(--color-text-disabled)] text-[11px]">
                        © 2026 Conquest India. Turn travel into territory.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
