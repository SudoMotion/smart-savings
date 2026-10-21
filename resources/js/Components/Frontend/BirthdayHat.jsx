export default function BirthdayHat({ className = 'h-28 w-28' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <ellipse cx="60" cy="98" rx="38" ry="10" fill="#1e3a2d" opacity="0.25" />
            <path
                d="M28 92c8-42 32-68 32-68s24 26 32 68H28z"
                fill="url(#hat-gradient)"
            />
            <path
                d="M36 88c6-28 24-48 24-48s18 20 24 48H36z"
                fill="#febd69"
                opacity="0.35"
            />
            <path d="M44 50 L52 88 M60 38 L60 88 M76 50 L68 88" stroke="#0f281c" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
            <circle cx="60" cy="28" r="10" fill="#ef4444" />
            <circle cx="60" cy="28" r="6" fill="#fca5a5" />
            <defs>
                <linearGradient id="hat-gradient" x1="60" y1="24" x2="60" y2="92" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2d6a4f" />
                    <stop offset="1" stopColor="#0f281c" />
                </linearGradient>
            </defs>
        </svg>
    );
}
