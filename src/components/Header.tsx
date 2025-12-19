import { useState, useRef, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface HeaderProps {
  remaining: number;
}

export function Header({ remaining }: HeaderProps) {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

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
            <p className="text-base sm:text-xl font-bold text-holly">${remaining.toLocaleString()}</p>
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 -mr-1 rounded-lg hover:bg-frost active:bg-frost transition-colors"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-holly rounded-full flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
              <svg 
                className={`w-4 h-4 text-silver transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-frost py-2 z-30">
                <div className="px-4 py-2 border-b border-frost">
                  <p className="font-medium text-coal truncate">{displayName}</p>
                  {user?.email && (
                    <p className="text-sm text-silver truncate">{user.email}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-coal hover:bg-frost active:bg-frost transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
