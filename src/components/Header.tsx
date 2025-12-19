import { useAuthActions } from "@convex-dev/auth/react";

interface HeaderProps {
  remaining: number;
}

export function Header({ remaining }: HeaderProps) {
  const { signOut } = useAuthActions();

  return (
    <header className="bg-white border-b border-frost sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-cranberry rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2L6 14h4l-4 8h5l-4 8h18l-4-8h5l-4-8h4L16 2z"/>
            </svg>
          </div>
          <h1 className="font-display text-lg sm:text-xl font-semibold text-coal italic truncate">
            Shopping List
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="text-right">
            <p className="text-[10px] sm:text-xs text-silver uppercase tracking-wide">Left</p>
            <p className="text-base sm:text-xl font-bold text-holly">${remaining.toFixed(0)}</p>
          </div>
          
          <button
            onClick={() => signOut()}
            className="p-2 -mr-2 text-silver hover:text-coal active:text-coal transition-colors"
            aria-label="Sign out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
