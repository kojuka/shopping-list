import { useState, useRef, useEffect } from "react";

type Status = "planning" | "bought" | "shipped" | "wrapped" | "delayed";

const statusConfig: Record<Status, { label: string; bg: string; text: string }> = {
  planning: { label: "Planning", bg: "bg-gray-100", text: "text-gray-700" },
  bought: { label: "Bought", bg: "bg-holly/10", text: "text-holly" },
  shipped: { label: "Shipped", bg: "bg-blue-100", text: "text-blue-700" },
  wrapped: { label: "Wrapped", bg: "bg-gold/20", text: "text-amber-700" },
  delayed: { label: "Delayed", bg: "bg-cranberry/10", text: "text-cranberry" },
};

interface StatusDropdownProps {
  status: Status;
  onChange: (status: Status) => void;
}

export function StatusDropdown({ status, onChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = statusConfig[status];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`min-h-[44px] px-4 rounded-xl text-sm font-medium ${current.bg} ${current.text} hover:opacity-80 active:opacity-70 transition-opacity flex items-center gap-2`}
      >
        {current.label}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)} />
          
          {/* Dropdown - Bottom sheet on mobile, dropdown on desktop */}
          <div className="fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-auto lg:left-0 lg:right-auto lg:top-full lg:mt-1 bg-white lg:bg-coal rounded-t-2xl lg:rounded-xl shadow-lg z-50 overflow-hidden">
            {/* Mobile handle */}
            <div className="lg:hidden py-3 flex justify-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            <div className="pb-8 lg:pb-0 lg:py-1">
              {(Object.keys(statusConfig) as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                  className={`w-full min-h-[52px] lg:min-h-[44px] px-5 lg:px-3 text-left text-base lg:text-sm text-coal lg:text-white hover:bg-gray-100 lg:hover:bg-white/10 active:bg-gray-200 lg:active:bg-white/20 flex items-center gap-3 ${
                    s === status ? "bg-gray-50 lg:bg-white/10" : ""
                  }`}
                >
                  {s === status && (
                    <svg className="w-5 h-5 text-holly lg:text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={s !== status ? "ml-8 lg:ml-0" : ""}>{statusConfig[s].label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
