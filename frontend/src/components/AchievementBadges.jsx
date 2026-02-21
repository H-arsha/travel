/**
 * AchievementBadges.jsx
 * Premium SVG badge system — metallic, geometric, with glow accents.
 * Inspired by Tesla dashboard / Apple VisionOS / F1 telemetry.
 * 
 * ONE consistent style: dark chrome base, electric blue/amber rim glow,
 * geometric iconography, subtle 3D depth via gradients.
 */
import { useId } from 'react';

const BadgeShell = ({ children, earned = false, size = 48, glowColor = '#38bdf8' }) => {
    const uid = useId();

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id={`chrome-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={earned ? '#2a2d35' : '#16181d'} />
                        <stop offset="50%" stopColor={earned ? '#3a3e48' : '#1a1c22'} />
                        <stop offset="100%" stopColor={earned ? '#22252b' : '#111318'} />
                    </linearGradient>
                    <linearGradient id={`rim-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={earned ? glowColor : '#333'} stopOpacity={earned ? 0.6 : 0.2} />
                        <stop offset="50%" stopColor={earned ? glowColor : '#444'} stopOpacity={earned ? 0.2 : 0.05} />
                        <stop offset="100%" stopColor={earned ? glowColor : '#333'} stopOpacity={earned ? 0.5 : 0.15} />
                    </linearGradient>
                    <filter id={`glow-${uid}`}>
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>
                {/* Shadow */}
                <ellipse cx="40" cy="74" rx="20" ry="3" fill="black" opacity={earned ? 0.3 : 0.1} />
                {/* Base plate */}
                <circle cx="40" cy="38" r="32" fill={`url(#chrome-${uid})`}
                    stroke={`url(#rim-${uid})`} strokeWidth={earned ? 1.5 : 0.5} />
                {/* Inner ring */}
                <circle cx="40" cy="38" r="26" fill="none"
                    stroke={earned ? glowColor : '#333'} strokeWidth="0.5" opacity={earned ? 0.25 : 0.1} />
                {/* Top highlight (3D depth) */}
                <ellipse cx="40" cy="24" rx="18" ry="8" fill="white" opacity={earned ? 0.04 : 0.01} />
                {/* Icon content */}
                <g opacity={earned ? 1 : 0.3} filter={earned ? `url(#glow-${uid})` : undefined}>
                    {children}
                </g>
            </svg>
        </div>
    );
};

/* ── Individual Badge Icons ── */

const FirstConquest = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#38bdf8">
        <polygon points="40,18 28,50 52,50" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinejoin="miter" />
        <line x1="40" y1="18" x2="40" y2="28" stroke="#38bdf8" strokeWidth="0.8" opacity="0.5" />
        <polygon points="40,18 36,26 44,26" fill="#38bdf8" opacity="0.15" />
    </BadgeShell>
);

const SeasonedExplorer = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#22d3ee">
        <circle cx="40" cy="38" r="12" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
        <line x1="40" y1="26" x2="40" y2="22" stroke="#22d3ee" strokeWidth="1" />
        <line x1="40" y1="50" x2="40" y2="54" stroke="#22d3ee" strokeWidth="1" />
        <line x1="28" y1="38" x2="24" y2="38" stroke="#22d3ee" strokeWidth="1" />
        <line x1="52" y1="38" x2="56" y2="38" stroke="#22d3ee" strokeWidth="1" />
        <polygon points="40,28 37,38 40,42 43,38" fill="#22d3ee" opacity="0.6" />
        <circle cx="40" cy="38" r="2" fill="#22d3ee" />
    </BadgeShell>
);

const VeteranTraveler = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#818cf8">
        <rect x="28" y="26" width="24" height="24" rx="2" fill="none" stroke="#818cf8" strokeWidth="1.5" />
        <line x1="28" y1="34" x2="52" y2="34" stroke="#818cf8" strokeWidth="0.8" opacity="0.5" />
        <line x1="28" y1="42" x2="52" y2="42" stroke="#818cf8" strokeWidth="0.8" opacity="0.5" />
        <line x1="36" y1="26" x2="36" y2="50" stroke="#818cf8" strokeWidth="0.8" opacity="0.5" />
        <line x1="44" y1="26" x2="44" y2="50" stroke="#818cf8" strokeWidth="0.8" opacity="0.5" />
        <rect x="30" y="28" width="20" height="20" rx="1" fill="#818cf8" opacity="0.06" />
    </BadgeShell>
);

const LegendaryNomad = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#f59e0b">
        <polygon points="28,44 32,28 36,36 40,24 44,36 48,28 52,44" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinejoin="miter" />
        <line x1="28" y1="44" x2="52" y2="44" stroke="#f59e0b" strokeWidth="1.8" />
        <polygon points="28,44 32,28 36,36 40,24 44,36 48,28 52,44" fill="#f59e0b" opacity="0.08" />
    </BadgeShell>
);

const FiveStates = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#34d399">
        <path d="M34,22 L34,54" stroke="#34d399" strokeWidth="1.5" />
        <path d="M46,22 L46,54" stroke="#34d399" strokeWidth="1.5" />
        <path d="M34,22 L46,22 L46,34 L40,30 L34,34 Z" fill="#34d399" opacity="0.2" stroke="#34d399" strokeWidth="1" />
        <path d="M34,36 L46,36 L46,48 L40,44 L34,48 Z" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.4" />
    </BadgeShell>
);

const TenStates = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#60a5fa">
        <path d="M40,20 L56,30 L56,46 L40,56 L24,46 L24,30 Z" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="miter" />
        <path d="M40,20 L56,30 L56,46 L40,56 L24,46 L24,30 Z" fill="#60a5fa" opacity="0.06" />
        <polygon points="40,30 41.5,35 47,35 42.5,38.5 44.5,44 40,40.5 35.5,44 37.5,38.5 33,35 38.5,35" fill="#60a5fa" opacity="0.5" />
    </BadgeShell>
);

const IndiaDominator = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#f59e0b">
        <circle cx="40" cy="38" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="40" cy="38" r="13" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.3" />
        <path d="M40,24 L43,26 L45,30 L44,34 L45,38 L44,42 L42,46 L40,50 L38,48 L36,44 L35,40 L36,36 L35,32 L36,28 L38,25 Z"
            fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="0.8" />
    </BadgeShell>
);

const SoloWarrior = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#a78bfa">
        <polygon points="40,32 30,52 50,52" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="miter" />
        <polygon points="40,32 30,52 50,52" fill="#a78bfa" opacity="0.06" />
        <polygon points="40,20 41,23 44,23 41.5,25 42.5,28 40,26 37.5,28 38.5,25 36,23 39,23" fill="#a78bfa" opacity="0.7" />
    </BadgeShell>
);

const LoneWolf = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#e879f9">
        <path d="M40,24 L56,44 L48,40 L40,52 L32,40 L24,44 Z" fill="none" stroke="#e879f9" strokeWidth="1.5" strokeLinejoin="miter" />
        <path d="M40,24 L56,44 L48,40 L40,52 L32,40 L24,44 Z" fill="#e879f9" opacity="0.08" />
        <circle cx="40" cy="34" r="1.5" fill="#e879f9" opacity="0.6" />
    </BadgeShell>
);

const BudgetMaster = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#fbbf24">
        <ellipse cx="40" cy="44" rx="12" ry="4" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <ellipse cx="40" cy="40" rx="12" ry="4" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <ellipse cx="40" cy="36" rx="12" ry="4" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        <ellipse cx="40" cy="32" rx="12" ry="4" fill="#fbbf24" opacity="0.15" stroke="#fbbf24" strokeWidth="1.5" />
        <text x="40" y="35" textAnchor="middle" fill="#fbbf24" fontSize="6" fontWeight="800" opacity="0.6">₹</text>
    </BadgeShell>
);

const XPLegend = ({ earned, size }) => (
    <BadgeShell earned={earned} size={size} glowColor="#fb923c">
        <circle cx="40" cy="38" r="14" fill="none" stroke="#fb923c" strokeWidth="1.5" />
        <polygon points="43,24 36,40 42,40 37,52 44,36 38,36" fill="#fb923c" opacity="0.5" stroke="#fb923c" strokeWidth="1" strokeLinejoin="miter" />
    </BadgeShell>
);

/* ── Badge Registry ── */
const BADGE_COMPONENTS = {
    'First Conquest': FirstConquest,
    'Seasoned Explorer': SeasonedExplorer,
    'Veteran Traveler': VeteranTraveler,
    'Legendary Nomad': LegendaryNomad,
    '5 States Conquered': FiveStates,
    '10 States Conquered': TenStates,
    'India Dominator': IndiaDominator,
    'Solo Warrior': SoloWarrior,
    'Lone Wolf': LoneWolf,
    'Budget Master': BudgetMaster,
    'XP Legend': XPLegend,
};

/**
 * Render a single achievement badge by name.
 */
export const AchievementBadge = ({ name, earned = false, size = 48 }) => {
    const Badge = BADGE_COMPONENTS[name];
    if (!Badge) return null;
    return <Badge earned={earned} size={size} />;
};

/**
 * Achievement descriptions for display.
 */
export const ACHIEVEMENT_DATA = [
    { name: 'First Conquest', desc: 'Log your first trip' },
    { name: 'Seasoned Explorer', desc: 'Complete 5 trips' },
    { name: 'Veteran Traveler', desc: 'Complete 15 trips' },
    { name: 'Legendary Nomad', desc: 'Complete 30 trips' },
    { name: '5 States Conquered', desc: 'Conquer 5 states' },
    { name: '10 States Conquered', desc: 'Conquer 10 states' },
    { name: 'India Dominator', desc: 'Conquer all 28 states' },
    { name: 'Solo Warrior', desc: 'Complete 3 solo trips' },
    { name: 'Lone Wolf', desc: 'Complete 10 solo trips' },
    { name: 'Budget Master', desc: '5 trips under ₹3000' },
    { name: 'XP Legend', desc: 'Earn 5000+ XP' },
];

export default AchievementBadge;
