export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399"/>
              <stop offset="100%" stopColor="#059669"/>
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
          <path d="M10 22V10l12 6-12 6z" fill="white" opacity="0.95"/>
          <circle cx="22" cy="10" r="3" fill="white" opacity="0.6"/>
        </svg>
      </div>
      <span className="font-bold text-lg tracking-tight text-foreground">Luma</span>
    </div>
  )
}
