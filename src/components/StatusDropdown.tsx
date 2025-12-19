import { useState, useRef, useEffect } from "react";

type Status = "idea" | "planned" | "bought" | "shipped" | "wrapped" | "delayed";

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: string }> = {
  idea: { label: "💭 Idea", bg: "bg-purple-100", text: "text-purple-700", icon: "💭" },
  planned: { label: "📋 Planned", bg: "bg-amber-100", text: "text-amber-700", icon: "📋" },
  bought: { label: "💰 Bought", bg: "bg-holly/10", text: "text-holly", icon: "💰" },
  shipped: { label: "📦 Shipped", bg: "bg-blue-100", text: "text-blue-700", icon: "📦" },
  wrapped: { label: "🎁 Wrapped", bg: "bg-cranberry/10", text: "text-cranberry", icon: "🎁" },
  delayed: { label: "⏳ Delayed", bg: "bg-gray-100", text: "text-gray-600", icon: "⏳" },
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
            
            {/* Section: Ideas */}
            <div className="pb-2 lg:pb-0">
              <div className="px-5 lg:px-3 py-2 text-xs text-silver lg:text-gray-400 uppercase tracking-wide font-semibold">
                Brainstorming
              </div>
              {(["idea"] as Status[]).map((s) => (
                <StatusOption key={s} status={s} currentStatus={status} onChange={onChange} onClose={() => setOpen(false)} />
              ))}
            </div>

            {/* Section: Committed */}
            <div className="border-t border-frost lg:border-white/10 pb-2 lg:pb-0">
              <div className="px-5 lg:px-3 py-2 text-xs text-silver lg:text-gray-400 uppercase tracking-wide font-semibold">
                Committed
              </div>
              {(["planned"] as Status[]).map((s) => (
                <StatusOption key={s} status={s} currentStatus={status} onChange={onChange} onClose={() => setOpen(false)} />
              ))}
            </div>

            {/* Section: Purchased */}
            <div className="border-t border-frost lg:border-white/10 pb-8 lg:pb-1">
              <div className="px-5 lg:px-3 py-2 text-xs text-silver lg:text-gray-400 uppercase tracking-wide font-semibold">
                Purchased
              </div>
              {(["bought", "shipped", "wrapped", "delayed"] as Status[]).map((s) => (
                <StatusOption key={s} status={s} currentStatus={status} onChange={onChange} onClose={() => setOpen(false)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatusOption({ 
  status, 
  currentStatus, 
  onChange, 
  onClose 
}: { 
  status: Status; 
  currentStatus: Status; 
  onChange: (s: Status) => void; 
  onClose: () => void;
}) {
  const isSelected = status === currentStatus;
  
  return (
    <button
      onClick={() => {
        onChange(status);
        onClose();
      }}
      className={`w-full min-h-[52px] lg:min-h-[44px] px-5 lg:px-3 text-left text-base lg:text-sm text-coal lg:text-white hover:bg-gray-100 lg:hover:bg-white/10 active:bg-gray-200 lg:active:bg-white/20 flex items-center gap-3 ${
        isSelected ? "bg-gray-50 lg:bg-white/10" : ""
      }`}
    >
      {isSelected && (
        <svg className="w-5 h-5 text-holly lg:text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      <span className={!isSelected ? "ml-8 lg:ml-0" : ""}>{statusConfig[status].label}</span>
    </button>
  );
}
